import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <Navbar currentUser={currentUser} />
        {children}
      </body>
    </html>
  )
}
