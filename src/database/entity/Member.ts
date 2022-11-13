import { IsEmail, IsEnum, IsNotEmpty, Length, Matches, MaxLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm"
import CryptSystem from "../../modules/CryptSystem";
import { UniqueOnMember } from "../../validator/member.validation";

export enum ROLES {
    //raha vo tsy mpreciser clé de ataony 0 à nbr choix-1 io de lasa raisiny otrany tab indexé io
    MEMBER= 'member',
    ADMIN= 'admin',
}

@Entity({name: 'members'})
export class Member {
    @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'pk_user' })
    id: string;

    @Column({
        type: "varchar",
        length: 35,
        nullable: false
    })
    @MaxLength(35)
    @Matches(/^\D*$/, {message: 'couldn\'t contain number'})
    firstName: string;
    
    @MaxLength(30)
    @Matches(/^\D*$/, {message: 'couldn\'t contain number'})
    @IsNotEmpty({message: 'cannot be left empty'})
    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    lastName: string;
    
    @Column({
        type: 'varchar',
        nullable: false,
        unique: true
    })
    @UniqueOnMember('mail')
    @IsEmail(undefined ,{message: 'enter a valid mail adress'})
    @IsNotEmpty({message: 'cannot be left empty'})
    mail: string;
    
    @Column({
        type: 'enum',
        enum: ROLES,
        default: ROLES.MEMBER
    })
    @IsEnum(ROLES)
    role: ROLES;

    @Column({
        type: 'varchar',
        nullable: false,
        select: false
    })
    @Length(6, 20, {message: 'should have at least 6 characters and mostly 20'})
    @IsNotEmpty({message: 'cannot be left empty'})
    password: string;

    @Column({name: 'inscription_date'})
    @CreateDateColumn()
    inscriptionDate: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async encryptPassword(){
        if(this.password)
            this.password= await CryptSystem.hash(this.password)
    }

    checkIfPasswordMatch(encryptedPswd: string){
        return CryptSystem.checkUnencryptedMatchWithCrypted(this.password, encryptedPswd);
    }
}
