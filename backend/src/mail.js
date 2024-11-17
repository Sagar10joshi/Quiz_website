import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

async function sendOtp(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD // Use the app password here
        }
    });

    let mailOptions = {
        from: 'OTP Service : GEHU Bhimtal Quiz Portal',
        to: `${email}`,
        // to: 'joshisagar0596@gmail.com',
        subject: 'Your OTP for Quiz Portal Registration',
        //you can type your message here
        text: `Thank you for registering on our Quiz Portal! To complete your registration, please use the OTP (One-Time Password) provided below:

Your OTP: ${otp}

This OTP is valid for a limited time and will expire in [2 minutes]. Please enter it to verify your email address and activate your account.

Thank you for choosing our Quiz Portal! `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export {sendOtp};
