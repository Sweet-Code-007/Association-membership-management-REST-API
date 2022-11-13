import {config} from 'dotenv';

config({
    path: 'PROD' === process.env.NODE_ENV?.trim().toUpperCase() ? './.env.prod' : './.env.dev'
})

export default process;