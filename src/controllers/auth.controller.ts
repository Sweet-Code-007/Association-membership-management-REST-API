import { Request, Response } from "express";
import { validate } from "class-validator";
import { Member, AppDataSource } from "../database";
import { WebToken } from "../modules/WebToken";

class AuthController {

    static login = async (req: Request, res: Response) => {
        const { mail, password } = req.body;
        if (!mail || !password)
            return res.status(401).json({err: true, msg: 'You should provide a value to "mail" and "password" field'});

        //get Member from databasse
        const MemberRepository = AppDataSource.getRepository(Member);
        let member!: Member;
        try {
            member = await MemberRepository.findOneOrFail({ where: { mail: mail.trim() }, select: ['id','password','role'] });
        } catch (error) {
            return res.status(404).json({err: true, msg:'Member not found'});
        }

        //check if encrypted password match
        if (!member.checkIfPasswordMatch(password))
            return res.status(401).json({err: true, msg: 'Wrong password'});

        const token =  WebToken.sign({ userId: member.id, role: member.role })

        //send the jwt in the response
        //res.send(token);
        res.cookie("authorization", token)
            .status(200)
            .json({
                err: false,
                message: "Login successfull"
            });
    };

    static logout(req: Request, res:Response){
        return res.clearCookie('authorization').status(200).json({err: false, msg: 'Successfully logout'})
    }

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;
        
        //get parameters from body
        const { oldPassword, newPassword, newPasswordVerif } = req.body;
        if (!(oldPassword && newPassword && newPasswordVerif)) 
            return res.status(401).json({err: true, msg: 'You should provide a value to "oldPassword", "newPassword" and "newPasswordVerif" field'});
            
        if(newPassword!=newPasswordVerif)
            return res.status(401).json({err: true, msg: '"newPassword" and "newPasswordVerif" doesn\'t match'});
            
        if(oldPassword==newPasswordVerif)
            return res.status(401).json({err: true, msg: '"oldPassword" and "newPasswordVerif" can\'t be the same'});

        const MemberRepository = AppDataSource.getRepository(Member);
        let member!: Member;
        try {
            member = await MemberRepository.findOneOrFail({ where: { id }, select:['password']});
        } catch (err) {
            return res.status(401).json({err: true, msg: 'Please connect to your account first'});
        }

        //check if old password matchs
        if (!member.checkIfPasswordMatch(oldPassword))
            return res.status(401).json({err: true, msg: 'Wrong old password'});

        //validate de model(password length)
        member.password = newPassword;
        const errors = await validate(Member, {skipMissingProperties: true});
        if (errors.length > 0) {
            const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                m+=`${singleError.property}: ${breakedRules.join(', ')}. `;
                return m;
            }, '');
            return res.status(401).json({err: true, msg: msg});
        }

        MemberRepository.update({id}, {password: member.password});

        return res.status(200).json({err: false, msg: 'Password changed'});
    };
}
export default AuthController;