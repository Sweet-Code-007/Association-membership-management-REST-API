import "reflect-metadata"
import { DataSource } from "typeorm"
import { Member } from "./entity/Member"
import { process } from '../config'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [Member],
    migrations: ['src/database/migration/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [],
})
