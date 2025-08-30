import nodemailer from "nodemailer"


export const sendEmail = ({
    to="",
    subject="",
    text="",
    html=""
}={})=>{
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,  
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from:"social-app",
    to,
    subject,
    text, // plain‑text body
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
})();
}