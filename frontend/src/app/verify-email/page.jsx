"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import axios from "axios"

const VerifyEmail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const verificationAttempted = useRef(false)

  useEffect(() => {
    if (token && !verificationAttempted.current) {
      setIsLoading(true)
      verificationAttempted.current = true

      axios
        .get(`/api/verify-email?token=${token}`)
        .then((res) => {
          setMessage(res.data.message)
          setIsVerified(true)
        })
        .catch((err) => {
          setMessage(err.response.data?.message || "Something went wrong")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [token])

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Email Verification</h1>
      {isLoading ? (
        <p>Please wait, verifying...</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {isVerified ? (
            <>
              <p>{message}</p>
              <button
                className="w-40 mt-6 py-2 bg-background text-accent font-medium rounded-full hover:bg-zinc-300 transition"
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </button>
            </>
          ) : (
            <p>{message}</p>
          )}
        </div>
      )}
    </section>
  )
}

export default VerifyEmail
