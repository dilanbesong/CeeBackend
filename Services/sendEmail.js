import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const sendEmail = async (email, message) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
   // host: "smpt.gmail.com",

    secure: false, 
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Dilan Besong 👻" <dylanbesong001@gmail.com>', 
    to: email, 
    subject: "Get code ✔", 
    text: `Welcome ${email} your reset code is ${message}`,
  });
    console.log(info.messageId);
};

export default sendEmail