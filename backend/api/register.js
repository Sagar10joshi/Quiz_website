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

// The handler function for the registration API route
export default async function handler(req, res) {
    // Only allow POST requests for registration
    if (req.method === 'POST') {
        const { username, email, password } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Generate OTP and token
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpTimestamp = Date.now();
        const token = jwt.sign({ username, email, password, otp, otpTimestamp }, '321', { expiresIn: '5m' });

        try {
            // Send the OTP email
            await sendOtp(email, otp);

            // Return the response
            return res.status(200).json({
                message: 'Otp Sent Successfully!!',
                token, // Send the token to the client
                redirect: '/otp' // Optionally redirect the client to the OTP verification page
            });

        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ error: 'Error sending OTP' });
        }
    } else {
        // Handle other HTTP methods (e.g., GET, PUT)
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
