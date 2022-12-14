import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { FindOneOptions } from "typeorm";
import { AppDataSource, Member, ROLES } from "../database";
import getErrorObject from "../validator/errorInClassValidator";

export function memberValidation(role: ROLES, update= false, mdpOnly= false) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, mail, password, newPassword } = req.body as { [key: string]: string };
        
        res.locals.member = new Member()
            res.locals.member.firstName = (firstName!=undefined && !mdpOnly) ? firstName.trim() : undefined;
            res.locals.member.lastName = (lastName && !mdpOnly) ? lastName.trim() : undefined;
            res.locals.member.mail = (mail && !mdpOnly) ? mail.trim() : undefined;
            if(update){
                if(mdpOnly)
                    res.locals.member.password= newPassword;
                else
                    res.locals.member.password= undefined;
                }
            else
                res.locals.member.password =  password;
            res.locals.member.role= (update) ? undefined : role;

            if(update)
                res.locals.member.id= res.locals?.jwtPayload?.userId;

        //validate if the parameters are ok
        const errors = await validate(res.locals.member, {skipMissingProperties: update});
        if (errors.length > 0)
            return res.status(400).json({ err: true, msg: getErrorObject(errors) });   
            
        next();
    }
}

export async function checkMdp(req: Request, res: Response, next: NextFunction){
    const {userId}= res.locals.jwtPayload || {userId: undefined};
    
    const { mail, password } = req.body;
        if (!mail || !password)
            return res.status(401).json({err: true, msg: 'You should provide a value to "mail" and "password" field'});

        //get Member from databasse
        const MemberRepository = AppDataSource.getRepository(Member);
        let member!: Member;
        let option= { where: { mail: mail.trim() }, select: ['id','password','role'] } as FindOneOptions
        if(userId) option.where= { id: userId }

        try {
            member = await MemberRepository.findOneOrFail(option);
        } catch (error) {
            return res.status(404).json({err: true, msg:'Member not found'});
        }

        //check if encrypted password match
        const match= await member.checkIfPasswordMatch(password);        
        if (!match)
            return res.status(401).json({err: true, msg: 'Wrong password'});

        res.locals= { jwtPayload: {...res.locals.jwtPayload} }
        res.locals.jwtPayload.userId= member.id;
        res.locals.jwtPayload.role= member.role;

        next();
}