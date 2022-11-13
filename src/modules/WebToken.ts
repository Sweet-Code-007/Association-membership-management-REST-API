import { sign, SignOptions, verify } from 'jsonwebtoken'
import { process } from '../config'

export class WebToken{
    static #secret: string;
    static{
        WebToken.#secret= process.env.JWT_SECRET!; 
    }

    static sign(object: Object, options: SignOptions = {expiresIn: 7200}){
        return sign(object, WebToken.#secret, options);
    }

    static verify(token: string){
        return verify(token, WebToken.#secret);
    }
}