import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

async function sendresult(email , score) {
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
        subject: 'Your Test Results and Thank You for Participating!',
        //you can type your message here
        text: `Thank you for participating in our test! We truly appreciate the time and effort you put into completing it.

We are pleased to inform you that your final score is ${score}.

We hope you enjoyed the experience, and we encourage you to keep learning and improving.
Thank you for choosing our Quiz Portal! `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export {sendresult};
