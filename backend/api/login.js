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

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            // Find the user by username
            const userlogin = await Register.findOne({ username });

            if (!userlogin) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check if the password matches
            if (userlogin.password === password && userlogin.username === username) {
                // Generate a JWT token
                const token = jwt.sign({ username: userlogin.username, password: userlogin.password }, '321', { expiresIn: '1h' });

                // Send the response with the token and redirect (if needed)
                return res.status(200).json({
                    message: 'Login successful',
                    token,
                    redirect: '/' // This could be a frontend route where the user is redirected after logging in
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'User cannot be logged in, invalid credentials' });
        }
    } else {
        // If the request method is not POST, return a 405 (Method Not Allowed)
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}