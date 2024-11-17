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
app.use(cors({
    origin: '*',  // Allow requests from your frontend domain only
    methods: 'GET,POST,PUT,DELETE', // Allow only these HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
  }));
app.use(express.json());
app.use(express.urlencoded({extended:false}))




// app.get('/',(req,res)=>{
//     res.json("Welcome to Server")
// })

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


//Route for sending final score in user mail

app.post('/score', async(req, res) => {

    const token = req.headers['authorization']?.split(' ')[1]; // Assuming 'Bearer <token>'
    if (!token) return res.status(401).send('Access denied. No token provided.');

    console.log('Received score:', req.body.score);  // Log the incoming score
    const score = req.body.score;
    try {
      // Save the score to your database

      // Decode the JWT token 
    const decoded = jwt.verify(token, '321');
    const username = decoded.username; 

    if (!username) {
      return res.status(400).send('Invalid token: User ID not found');
    }

    // Fetch the user's email from the database using the userId
    const user = await Register.findOne({ username: username });

    if (!user) {
      return res.status(404).send('User not found');
    }

        const email = user.email;


      await sendresult(email,score);
  
      res.status(200).json({ message: 'Score saved successfully' });
    } catch (error) {
      console.error('Error saving score:', error);
      res.status(500).json({ message: 'Failed to save score' });
    }
  });
  


dbConnect()//Function for the connection of database

app.listen(process.env.PORT,()=>{
    console.log(`App is listning on PORT : ${process.env.PORT}`)
})
