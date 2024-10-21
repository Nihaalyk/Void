"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-4"
      >
        <h1 className="text-8xl font-bold">WELCOME TO THE VOID</h1>
        <p className="text-3xl font-medium">
          Your personalized AI assistant for knowlegde and productivity.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 flex flex-col items-center justify-center"
      >
        <Link
          href="/visualize"
          className="bg-foreground px-4 py-2 rounded-full w-96 font-bold text-xl text-accent flex justify-center"
        >
          <button>Visualize Now!</button>
        </Link>
      </motion.div>
    </section>
  )
}

export default Hero
