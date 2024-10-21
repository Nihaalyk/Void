"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import toast, { Toaster } from "react-hot-toast"

const Navbar = ({ currentUser }) => {
  return (
    <nav className="bg-accent flex justify-between p-4 border-b-[1px] border-foreground fixed w-full">
      <Toaster />
      <div className="flex justify-center items-center">
        <Link href="/">
          <h1 className="text-white text-4xl font-bold">VOID</h1>
        </Link>
      </div>

      <div className="flex justify-center items-center gap-4">
        {currentUser ? (
          <>
            <Link
              href="/visualize"
              className="bg-foreground px-4 py-2 rounded-full"
            >
              <span className="font-bold text-sm text-accent">Visualize</span>
            </Link>

            <Link
              href="/mygraphs"
              className="bg-foreground px-4 py-2 rounded-full"
            >
              <span className="font-bold text-sm text-accent">My Graphs</span>
            </Link>

            <Link
              href="/"
              onClick={() => {
                signOut()

                toast.success("Logged out successfully")
              }}
              className="bg-foreground px-4 py-2 rounded-full"
            >
              <span className="font-bold text-sm text-accent">Logout</span>
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="bg-foreground px-4 py-2 rounded-full"
          >
            <span className="font-bold text-sm text-accent">Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
