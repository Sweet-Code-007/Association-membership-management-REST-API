import {compare, hash} from 'bcryptjs'

export default class CryptSystem{
    static async hash(smthgToHash: string){
        return hash(smthgToHash, 8)
    }

    static async checkUnencryptedMatchWithCrypted(unnecrypted: string, encrypted: string){
        return compare(unnecrypted, encrypted);
    }
}