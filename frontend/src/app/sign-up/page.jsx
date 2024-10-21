"use client"

import { useState } from "react"
import axios from "axios"
import { z } from "zod"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import Link from "next/link"

const SignUp = () => {
  const router = useRouter()
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    password: false,
  })

  const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
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
      signUpSchema.parse(formData)
      return true
    } catch (error) {
      setErrors(error.errors)
      error.errors.forEach((error) => {
        toast.error(error.message)
      })
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    await axios
      .post("/api/signup", formData)
      .then(() => {
        toast.success("An email verification link has been sent to your email")
        router.push("/sign-in")
      })
      .catch((err) => {
        toast.error(err.response?.data.message || "Something went wrong")
      })
  }

  return (
    <section className="flex items-center justify-center h-full md:h-screen pt-28 pb-12">
      <Toaster />
      <div className="h-auto flex flex-row select-none">
        <form className="flex flex-col w-full mx-6 md:mx-0 md:w-[400px] gap-y-2 p-6 rounded-md border-2 relative">
          <h2 className="text-4xl font-bold text-background text-center mb-4">
            Sign Up
          </h2>

          {/* NAME */}
          <div className="flex flex-col">
            <motion.label
              htmlFor="name"
              animate={{
                y: focused.name ? 0 : 33,
                x: 10,
                color: focused.name ? "#fffce8" : "#999999",
              }}
              transition={{ duration: 0.1 }}
            >
              Name
            </motion.label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              className="px-4 py-2 bg-background border-2 border-none hover:border-lightgreen focus:border-lightgreen transition duration-300 rounded-md outline-none text-accent"
            />
          </div>

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
              className="px-4 py-2 bg-background border-2 border-none hover:border-lightgreen focus:border-lightgreen transition duration-300 rounded-md outline-none text-accent"
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
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className="px-4 py-2 bg-background border-2 border-none hover:border-lightgreen focus:border-lightgreen transition duration-300 rounded-md outline-none text-accent"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-6 py-2 bg-background text-accent font-medium rounded-full hover:bg-zinc-300 transition"
          >
            Submit
          </button>

          <div className="mt-4">
            <div className="flex justify-center items-center text-sm text-background gap-2">
              <p>Already have an account?</p>
              <Link
                href="/sign-in"
                className="hover:text-lightgreen hover:underline transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SignUp
