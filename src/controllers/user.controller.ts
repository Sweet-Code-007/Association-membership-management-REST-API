import { Request, Response } from "express";
import { FindManyOptions } from "typeorm";
import { Member, AppDataSource } from "../database";

export class MemberController {
    static repository = AppDataSource.getRepository(Member);

    static getAll = async (req: Request, res: Response) => {
        try {
            const { page, perPage, sortBy, order, role } = req.query;
            const skip = (parseInt(page as string) - 1) * (parseInt(perPage as string));
            let opt= {
                select: ["id", "firstName", "lastName", "inscriptionDate", "role", "mail"],
                order: { [`${sortBy}`]: order },
                take: parseInt(perPage as string),
                skip: (skip < 0) ? 0 : skip
            } as FindManyOptions<Member>
    
            if(role) opt= {...opt, where: {role: role as any}}
    
            const members = await MemberController.repository.find(opt);
    
            return res.status(200).json({
                err: false,
                data: members
            });
        } catch (error) {
            res.status(404).json({
                err: true,
                message: 'Role not found'
            })
        }
    }

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

    static editMember = async (req: Request, res: Response) => {
        try {
            await MemberController.repository.update({ id: res.locals.member.id }, res.locals.member);
        } catch (e) {
            return res.status(500).json({ err: true, msg: 'Internal server error' });
        }

        res.status(200).json({ err: false, msg: "Member updated" });
    };
};
export default MemberController;