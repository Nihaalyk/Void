"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

const Navbar = ({ currentUser }) => {
  const router = useRouter()

  return (
    <nav className="bg-accent flex justify-between p-4 border-b-[1px] border-background fixed w-full">
      <Toaster />
      <div className="flex justify-center items-center">
        <Link href="/">
          <h1 className="text-background text-4xl font-bold">VOID</h1>
        </Link>
      </div>

      {currentUser && (
        <div className="flex justify-center items-center gap-10">
          <Link href="/visualize">
            <span className="font-bold text-md text-background hover:bg-background hover:text-accent transition duration-300 rounded-full px-4 py-2">
              Visualize
            </span>
          </Link>

          <Link href="/mygraphs">
            <span className="font-bold text-md text-background hover:bg-background hover:text-accent transition duration-300 rounded-full px-4 py-2">
              My Graphs
            </span>
          </Link>

          <Link href="/chat">
            <span className="font-bold text-md text-background hover:bg-background hover:text-accent transition duration-300 rounded-full px-4 py-2">
              Chat
            </span>
          </Link>
        </div>
      )}

      <div className="flex justify-center items-center gap-4">
        {currentUser ? (
          <>
            <Link
              href="/"
              onClick={() => {
                signOut()
                router.push("/")
                toast.success("Logged out successfully")
              }}
              className="bg-background px-4 py-2 rounded-full"
            >
              <span className="font-bold text-sm text-accent">Logout</span>
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="bg-background px-4 py-2 rounded-full"
          >
            <span className="font-bold text-sm text-accent">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
