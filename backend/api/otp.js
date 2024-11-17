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

//Route for verifying otp and saving user in database

app.post('/otp',async(req,res)=>{

    const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>'
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const code = req.body.otp
        const currentTime = Date.now()
        const decoded = jwt.verify(token, '321');
        const { otp, otpTimestamp } = decoded;
        // Access the user data from the decoded token
        const { username, email, password } = decoded;
        

        if (code===otp && currentTime-otpTimestamp<120000) {
            const registerUser = new Register({
                username, 
                email, 
                password
            })
            const Registered = await registerUser.save();
            return res.status(200).json({
                message: 'Registration successful!',
                redirect: '/login' // Redirect to quiz page
            });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})