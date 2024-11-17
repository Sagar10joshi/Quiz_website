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

export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Extract the token from the Authorization header
      const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>'
      if (!token) {
        return res.status(401).send('Access denied. No token provided.');
      }
  
      try {
        // Extract the OTP entered by the user
        const { otp: enteredOtp } = req.body;
        const currentTime = Date.now();
  
        // Decode the JWT token to get the stored OTP and timestamp
        const decoded = jwt.verify(token, '321');
        const { otp, otpTimestamp, username, email, password } = decoded;
  
        // Check if the entered OTP matches the stored OTP and if the OTP is still valid (within 2 minutes)
        if (enteredOtp === otp && currentTime - otpTimestamp < 120000) {
          // Save the user to the database
          const registerUser = new Register({
            username,
            email,
            password
          });
  
          const Registered = await registerUser.save();
  
          // Return success response
          return res.status(200).json({
            message: 'Registration successful!',
            redirect: '/login' // Redirect to login page (adjust according to your frontend route)
          });
        } else {
          return res.status(400).json({ message: "Invalid OTP or OTP expired" });
        }
      } catch (error) {
        console.error('Error processing OTP:', error);
        return res.status(400).json({ message: error.message });
      }
    } else {
      // If not a POST request, respond with Method Not Allowed
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  }