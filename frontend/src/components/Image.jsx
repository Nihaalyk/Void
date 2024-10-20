"use client"

import { useState } from "react"
import Tesseract from "tesseract.js"
import { message } from "antd"

const Image = () => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleImageChange(e) {
    setFile(e.target.files[0])
  }

  async function handleImage() {
    if (file) {
      try {
        setIsLoading(true)

        Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        })
          .then(({ data: { text } }) => {
            console.log("text", text)
            setIsLoading(false)
            message.success("Successfully")
          })
          .catch((err) => {
            console.log(err)
            setIsLoading(false)
            message.error("Failed")
          })
      } catch (error) {
        console.log(error)
        message.error("Failed to convert image to text.")
      }
    } else {
      message.error("Please upload an image file first.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-md">
      <h2 className="text-3xl font-bold">IMAGE</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button
        type="submit"
        onClick={handleImage}
        disabled={isLoading}
        className="w-full mt-6 py-2 bg-accent text-background rounded-full form-btn"
      >
        Convert
      </button>
    </div>
  )
}

export default Image
