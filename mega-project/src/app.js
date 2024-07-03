import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { LIMIT } from './constents';


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({
    limit:LIMIT
}))

app.use(express.urlencoded({extended: true, limit: LIMIT}))
app.use(express.static("public"))

app.use(cookieParser())


export {app}