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

//Route for Registration and to send otp       

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpTimestamp = Date.now();
    const token = jwt.sign({ username, email, password,otp, otpTimestamp }, '321', { expiresIn: '5m' });
    
    if (email) {
        try {
            await sendOtp(email,otp)
            res.status(200).json({
                message: 'Otp Sent Successfully!!',
                token, // Send the token to the client
                redirect: '/otp' // Redirect to OTP page
            });
            console.log("Otp Sent Successfully!!");
            //console.log("Session data after registration:", req.session.userData);

        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).send('Error sending OTP');
        }
    } else {
        res.status(400).send('Email is required');
    }
});