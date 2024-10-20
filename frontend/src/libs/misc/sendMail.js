import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const sendMail = async (email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Email Verification",
      html: message,
    }

    await transporter.sendMail(mailOptions)
  } catch (err) {
    return NextResponse.json(
      { message: "Error sending email" + err.message },
      { status: 500 }
    )
  }
}
