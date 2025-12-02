import nodemailer from "nodemailer"

const USER = process.env.EMAIL_USER
const PASS = process.env.EMAIL_PASS


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USER,
    pass: PASS
  }
  
})

export default transporter
