"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

const SignIn = () => {
  const router = useRouter()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [focused, setFocused] = useState({
    email: false,
    password: false,
  })

  const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  })

  // -----------------------------------------------------------------------

  function handleFocus(field) {
    setFocused(function (prev) {
      return { ...prev, [field]: true }
    })
  }

  function handleBlur(field) {
    if (formData[field] === "") {
      setFocused(function (prev) {
        return { ...prev, [field]: false }
      })
    }
  }

  function validateForm() {
    try {
      signInSchema.parse(formData)
      return true
    } catch (error) {
      setErrors(error.errors)
      error.errors.forEach((error) => {
        toast.error(error.message)
      })
      return false
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    }).then((res) => {
      if (res?.ok) {
        toast.success("Logged in successfully")
        router.refresh()
        router.push("/")
      }

      if (res?.error) {
        toast.error(res.error || "Something went wrong")
      }
    })
  }

  return (
    <section className="flex items-center justify-center h-screen">
      <Toaster />
      <div className="h-auto flex flex-row select-none">
        <form
          action=""
          className="flex flex-col w-full md:w-[400px] gap-y-2 p-6 rounded-md bg-darkgreen relative"
        >
          <h2 className="text-4xl font-bold text-background text-center mb-4">
            Login
          </h2>

          {/* EMAIl */}
          <div className="flex flex-col">
            <motion.label
              htmlFor="email"
              animate={{
                y: focused.email ? 0 : 33,
                x: 10,
                color: focused.email ? "#fffce8" : "#999999",
              }}
              transition={{ duration: 0.1 }}
            >
              Email
            </motion.label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className="px-4 py-2 bg-background border-2 border-none hover:border-lightgreen focus:border-lightgreen transition duration-300 rounded-md outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col">
            <motion.label
              htmlFor="password"
              animate={{
                y: focused.password ? 0 : 33,
                x: 10,
                color: focused.password ? "#fffce8" : "#999999",
              }}
              transition={{ duration: 0.1 }}
            >
              Password
            </motion.label>
            <input
              type="tel"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className="px-4 py-2 bg-background border-2 border-none hover:border-lightgreen focus:border-lightgreen transition duration-300 rounded-md outline-none"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-6 py-2 bg-background rounded-full form-btn"
          >
            Submit
          </button>

          <div className="mt-4">
            <div className="flex justify-center items-center text-sm text-background gap-2">
              <p>Don&apos;t have an account?</p>
              <Link
                href="/sign-up"
                className="hover:text-lightgreen hover:underline transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SignIn
