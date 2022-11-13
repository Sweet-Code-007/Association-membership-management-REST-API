import { Request, Response } from "express";
import { Member, AppDataSource } from "../database";

export class MemberController {
    static repository = AppDataSource.getRepository(Member);

    // static listAll = async (req: Request, res: Response) => {
    //     //get Member from database
    //     const Members = await MemberController.repository.find(
    //         { 
    //             select: ["id", "firstName", "lastName", "dateOfBirth", "mail"],
    //             where: {isAdmin: false}
    //         }
    //     );

    //     //send the Members object
    //     return res.status(200).json(Members);
    // }

    // static getOneById = async (req: Request, res: Response) => {
    //     //get the ID from the url
    //     const id: number = parseInt(req.params.id, 10);

    //     //get the Member from database

    //     try {
    //         let Member = await MemberController.repository.findOneOrFail({
    //             select: ["id", "firstName", "lastName", "dateOfBirth", "mail"],
    //             where: { id: id }
    //         });

    //         res.status(200).json(Member);
    //     } catch (error) {
    //         res.status(401).send("Member not found");
    //     }

    // };

    static newMember = async (req: Request, res: Response) => {
        const { member } = res.locals;
        try {
            await MemberController.repository.save(member);
        } catch (e) {
            return res.status((500)).json({ err: true, msg: "Internal server error" });
        }

        //If all Ok send 201 response
        res.status(201).json({ err: true, msg: `${member.role} account created` });
    }

    // static editMember = async (req: Request, res: Response) => {
    //     //get the id from the url
    //     const id: number = parseInt(req.params.id);
    //     //try to find Member on database
    //     try {
    //         await MemberController.repository.findOneOrFail({ 
    //             select: ['id'],
    //             where: {id: id} 
    //         });
    //     } catch (error) {
    //         //if not found, send 404 erros response
    //         return res.status(404).json({err: true, msg:"Member not found"});
    //     }

    //     let MemberUpdate: {[keys: string]: any}= {};
    //     const tmp= new Member();

    //     for(let prop in req.body){
    //         if(prop in tmp){
    //             switch (prop) {
    //                 case "firstName":
    //                 case "lastName":
    //                 case 'mail':
    //                 case 'dateOfBirth':
    //                     MemberUpdate[prop]= req.body[prop].trim();
    //                     break;
    //             }
    //         }
    //     }

    //     //validate the new values on model
    //     const errors = await validate(MemberUpdate);
    //     if (errors.length > 0)
    //         return res.status(400).json({err: true, msg: getErrorObject(errors)})

    //     //try to save, if failsn that means mail already in use
    //     try {
    //         await MemberController.repository.update({id:id},MemberUpdate);
    //     } catch (e) {
    //         return res.status(401).json({err: true, msg: 'the provided email is already used by another Member'});
    //     }

    //     res.status(200).json({err: false, msg: "Member updated"});
    // };

    // static deleteMember = async (req: Request, res: Response) => {
    //     //get the id from the url
    //     const id = parseInt(req.params.body, 10);

    //     try {
    //         await MemberController.repository.findOne({where: {id: id} , select: ['id']});
    //     } catch (error) {
    //         return res.status(404).json({err: true, msg:"Member not found"});
    //     }
    //     MemberController.repository.delete(id);

    //     //after all, send a 204 status(no content but acceptes) response
    //     res.status(204).json({err: false, msg: "Member deleted"});
    // };
};
export default MemberController;