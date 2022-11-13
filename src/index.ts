import { AppDataSource } from "./database";
import {process} from './config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from './routes';

AppDataSource.initialize().then(async () => {
    const { PORT, HOST } = process.env;
    const app= express();

    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use('/', router);

    app.listen(+PORT!, HOST!, ()=>{
        console.log(`Server running on http://${HOST}:${PORT}`)
    })

}).catch(error => console.log(error))