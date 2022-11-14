import { Request, Response } from "express";
import { validate } from "class-validator";
import { Member, AppDataSource } from "../database";
import { WebToken } from "../modules/WebToken";
import MemberController from "./user.controller";

class AuthController {

    static login = async (req: Request, res: Response) => {
        const token = WebToken.sign({ userId: res.locals.jwtPayload.userId, role: res.locals.jwtPayload.role })

        //send the jwt in the response
        //res.send(token);
        res.cookie("authorization", token)
            .status(200)
            .json({
                err: false,
                message: "Login successfull"
            });
    };

    static logout(req: Request, res: Response) {
        return res.clearCookie('authorization').status(200).json({ err: false, msg: 'Successfully logout' })
    }

    static changePassword = async (req: Request, res: Response) => {
        const id = res.locals.jwtPayload.userId;

        const { password, newPassword } = req.body;

        if (password == newPassword)
            return res.status(401).json({ err: true, msg: 'The old password and the new one can\'t be the same' });

        const memberRepository = AppDataSource.getRepository(Member);
        const update = new Member();
        update.id = id;
        update.password = newPassword;
        memberRepository.update({ id }, update);

        return res.status(200).json({ err: false, msg: 'Password changed' });
    };

    static async deleteMyAccount(req: Request, res: Response) {
        res.clearCookie('authorization');
        await (deleteMember(res.locals.jwtPayload.userId))(req, res);        
    }
    
    static async deleteMember(req: Request, res: Response){
        if(req.params.id != res.locals.jwtPayload.userId)
            await (deleteMember(req.params.id))(req, res);
        else res.status(400).json({
            err: true,
            msg: 'Use the correct way to delete your own account'
        })
    }
}

function deleteMember(id: string){
    return async (req: Request, res: Response)=>{
        try {
            await MemberController.repository.findOne({ where: { id: id }, select: ['id'] });
            await MemberController.repository.delete(id);
        } catch (error) {
            return res.status(404).json({ err: true, msg: "Member not found" });
        }

        res.status(200).json({ err: false, msg: `Member account deleted` });
    }
}
export default AuthController;