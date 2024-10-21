"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import groqClient from "@/libs/misc/groqClient"
import { useEffect, useState } from "react"
import axios from "axios"

const Hero = ({ currentUser }) => {
  const [subTitle, setSubTitle] = useState("")

  const PROMPT = `
  Develop a five-word tagline for an app that helps students organize their study materials, including text, images, and audio, and automatically generates a personal knowledge graph to make study sessions more efficient and personalized.
  `

  useEffect(() => {
    const getSubTitle = async () => {
      const completion = await groqClient.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: PROMPT }],
        temperature: 1.0,
        max_tokens: 8,
        top_p: 1,
        stream: false,
      })

      setSubTitle(completion.choices[0].message.content)
    }

    getSubTitle()
  }, [subTitle])

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <h1 className="text-8xl font-bold">WELCOME TO THE VOID</h1>
        <p className="text-3xl font-medium">{subTitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 flex flex-col items-center justify-center"
      >
        <Link
          href={currentUser ? "/visualize" : "/sign-in"}
          className="bg-background px-4 py-2 rounded-full w-96 font-bold text-xl text-accent flex justify-center"
        >
          <button>Visualize Now!</button>
        </Link>
      </motion.div>
    </section>
  )
}

export default Hero
