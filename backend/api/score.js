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

//Route for sending final score in user mail

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>'
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const score = req.body.score;
    console.log('Received score:', score);  // Log the incoming score

    try {
      // Decode the JWT token
      const decoded = jwt.verify(token, '321');
      const username = decoded.username;

      if (!username) {
        return res.status(400).send('Invalid token: User ID not found');
      }

      // Fetch the user's email from the database using the username
      const user = await Register.findOne({ username: username });

      if (!user) {
        return res.status(404).send('User not found');
      }

      const email = user.email;

      // Send the score result to the user's email
      await sendresult(email, score);

      // Respond with a success message
      return res.status(200).json({ message: 'Score saved successfully' });

    } catch (error) {
      console.error('Error saving score:', error);
      return res.status(500).json({ message: 'Failed to save score' });
    }
  } else {
    // If not a POST request, respond with Method Not Allowed
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}