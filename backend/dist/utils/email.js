import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "email-smtp.ap-south-1.amazonaws.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASS,
    },
});
const sendEmail = async (email, subject, text) => {
    try {
        const mail = await transporter.sendMail({
            from: '"CallMyDoctor" <CallMyDoctor@shubhamgoyal.dev>',
            to: email,
            subject,
            text,
        });
        return mail;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to send email");
    }
};
export { sendEmail };
