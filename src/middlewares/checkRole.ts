import { Request, Response, NextFunction } from "express";
import { ROLES } from "../database";

export default function checkRole(roles: ROLES[]) {
    return (req: Request, res: Response, next: NextFunction)=>{
        const { role } = res.locals.jwtPayload;

        if (roles.indexOf(role) == -1)
            res.status(401).json({
                err: true,
                message: 'Unauthorized'
            })
        else next();
    }
}