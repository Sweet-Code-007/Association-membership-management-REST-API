import { MigrationInterface, QueryRunner } from "typeorm";

export class User1668342055113 implements MigrationInterface {
    name = 'User1668342055113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."members_role_enum" AS ENUM('member', 'admin')`);
        await queryRunner.query(`CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(35) NOT NULL, "lastName" character varying(30) NOT NULL, "mail" character varying NOT NULL, "role" "public"."members_role_enum" NOT NULL DEFAULT 'member', "password" character varying NOT NULL, "inscriptionDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_061b00c27959b553b9199892cc5" UNIQUE ("mail"), CONSTRAINT "pk_user" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "members"`);
        await queryRunner.query(`DROP TYPE "public"."members_role_enum"`);
    }

}
