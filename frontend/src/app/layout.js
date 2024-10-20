import localFont from "next/font/local"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { getCurrentUser } from "@/app/actions/getCurrentUser"

const mabry = localFont({
  src: [
    {
      path: "./fonts/MabryPro-Light.ttf",
      weight: "300",
    },
    {
      path: "./fonts/MabryPro-Regular.ttf",
      weight: "400",
    },
    {
      path: "./fonts/MabryPro-Medium.ttf",
      weight: "500",
    },
    {
      path: "./fonts/MabryPro-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-mabry",
})

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={`${mabry.variable} font-mabry antialiased`}>
        <Navbar currentUser={currentUser} />
        {children}
      </body>
    </html>
  )
}
