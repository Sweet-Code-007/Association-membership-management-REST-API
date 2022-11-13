import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator"
import { Not } from "typeorm";
import { AppDataSource, Member } from '../database' 

export function UniqueOnMember(field: string, validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        registerDecorator({
            name: 'UniqueOnMember',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value:string, arg?: ValidationArguments){
                    const userRepo= AppDataSource.getRepository(Member)
                    let options= {
                        select: {id: true},
                        where: {
                            [`${field}`]: value,
                        }
                    } as any;
                    
                    //au cas hoe maao update ka efa manana ID ilay olona
                    if((arg?.object as any)['id'] != undefined)
                        options.where= {...options.where, id: Not((arg?.object as any)['id'])}

                    const found= await userRepo.findOne(options) 
                                        
                    return (found==null)
                },
                defaultMessage: ()=>`this ${field.toLowerCase()} is already used by another user`
            }
        })
    }
}