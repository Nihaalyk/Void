"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Context } from "./context/contextProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
