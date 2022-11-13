import { Request, Response } from "express";
import { validate } from "class-validator";
import { Member, AppDataSource } from "../database";
import { WebToken } from "../modules/WebToken";

class AuthController {

    static login = async (req: Request, res: Response) => {
        const token =  WebToken.sign({ userId: res.locals.jwtPayload.userId, role: res.locals.jwtPayload.role })

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
        const id = res.locals.jwtPayload.userId;
        
        const { password, newPassword } = req.body;
        
        if(password==newPassword)
            return res.status(401).json({err: true, msg: 'The old password and the new one can\'t be the same'});

        const memberRepository = AppDataSource.getRepository(Member);
        const update= new Member();
        update.id= id;
        update.password= newPassword;
        memberRepository.update({id}, update);

        return res.status(200).json({err: false, msg: 'Password changed'});
    };
}
export default AuthController;