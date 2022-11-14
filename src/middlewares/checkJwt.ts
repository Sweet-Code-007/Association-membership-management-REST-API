import { Request, Response, NextFunction } from "express";
import { WebToken } from "../modules/WebToken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the cookies
    const token = req.cookies.authorization;
    let jwtPayload: any;    

    //Try to validate the token and get data
    try {
        jwtPayload = WebToken.verify(token);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token invalid => not loged in or token validation expired
        res.status(401).json({
            err: true,
            message: "You're not logged in"
        });
        return  next({})
    }

    //The token is valid for 2 hour. Give a new token each new request by a member
    const { userId, role } = jwtPayload;
    const newToken = WebToken.sign({ userId, role }, {
        expiresIn: 7200
    });
    res.cookie("authorization", newToken);

    next();
};

export const checkLogedOut= (req: Request, res: Response, next: NextFunction)=>{
    const token = req.cookies.authorization;
    let jwtPayload: any;    

    try {
        jwtPayload = WebToken.verify(token);
    } catch (error) {
        //if the token is'nt valid or doesn't exist then we can create an account
        return next();
    }
    //If token is valid, make them logout first
    res.status(401).json({
        err: true,
        message: "Logout First"
    });
}