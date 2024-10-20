"use client"

import { useState } from "react"
import { message } from "antd"

const Audio = () => {
  const [file, setFile] = useState(null)

  function handleAudioChange(e) {
    setFile(e.target.files[0])
    message.success("File uploaded successfully.")
  }

  async function handleAudio() {
    if (file) {
      try {
        console.log("file", file)
        message.success("Sucessful.")
      } catch (error) {
        console.log(error)
        message.error("Failed")
      }
    } else {
      message.error("Please upload a Audio file first.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-md">
      <h2 className="text-3xl font-bold">PDF</h2>
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioChange}
        className="border-2 rounded-md"
      />
      <button
        type="submit"
        onClick={handleAudio}
        className="w-full mt-6 py-2 bg-accent text-background rounded-full form-btn"
      >
        Convert
      </button>
    </div>
  )
}

export default Audio
