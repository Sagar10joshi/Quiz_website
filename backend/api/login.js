import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import jwt from "jsonwebtoken"
import { sendOtp } from "./mail.js";
import {sendresult} from "./resultmail.js"
import dbConnect from "./dbConnect.js";
import {Register} from "./register_model.js"
dotenv.config({
    path: "./.env"
})

const app = express();
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({extended:false}))


//Route for login

app.post('/login',async(req,res)=>{
    try {
        const Username = req.body.username
        const Password = req.body.password

        const userlogin = await Register.findOne({username:Username})

        if (!userlogin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if(userlogin.password===Password && userlogin.username===Username){
            // Generate a JWT token
            const token = jwt.sign({ username: userlogin.username, password: userlogin.password }, '321', { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful',token, redirect: '/' });

        }
        else{
            return res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('User cannot be logged in, invalid credentials');
    }
})