import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { Member, ROLES } from "../database";
import getErrorObject from "../validator/errorInClassValidator";

export default function memberValidation(role: ROLES,skipMissingProp= false) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, mail, password } = req.body as { [key: string]: string };
        
        res.locals.member = new Member()
            res.locals.member.firstName = (firstName) ? firstName.trim() : firstName;
            res.locals.member.lastName = (lastName) ? lastName.trim() : lastName;
            res.locals.member.mail = (mail) ? mail.trim() : mail;
            res.locals.member.password = password;
            res.locals.member.role= role;
            res.locals.member.id= res.locals?.jwtPayload?.userId;

        //validate if the parameters are ok
        const errors = await validate(res.locals.member, {skipMissingProperties: skipMissingProp});
        if (errors.length > 0)
            return res.status(400).json({ err: true, msg: getErrorObject(errors) });   
            
        next();
    }
}