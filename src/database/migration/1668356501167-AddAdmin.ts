import { MigrationInterface, QueryRunner } from "typeorm"
import { Member, AppDataSource, ROLES } from "../";

export class AddAdmin1668356501167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // mdp: admin1234
        await queryRunner.query(
            'INSERT INTO members ("firstName", "lastName", "role", "mail", "password") VALUES ($1, $2, $3, $4, $5)',
            ['Bema','RABE', ROLES.ADMIN, 'admin@test.com', '$2a$08$uyzi/BY20LQ8SCxpgAKDW.AQZ27JMKzAwSo76nNlZMYAIfIZF9E5m']
        )
    }

    public async down(): Promise<void> {
    }

}
