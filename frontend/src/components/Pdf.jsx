"use client"

import { useState } from "react"
import pdfToText from "react-pdftotext"
import { message } from "antd"

const Pdf = () => {
  const [file, setFile] = useState(null)


  function handlePdfChange(e) {
    setFile(e.target.files[0])
    message.success("File uploaded successfully.")
  }

  async function handlePdf() {
    if (file) {
      try {
        const text = await pdfToText(file)
        console.log("text", text)
        message.success("PDF converted to text successfully.")
      } catch (error) {
        console.log(error)
        message.error("Failed to convert PDF to text.")
      }
    } else {
      message.error("Please upload a PDF file first.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-md">
      <h2 className="text-3xl font-bold">PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handlePdfChange}
        className="border-2 rounded-md"
      />
      <button
        type="submit"
        onClick={handlePdf}
        className="w-full mt-6 py-2 bg-accent text-background rounded-full form-btn"
      >
        Convert
      </button>
    </div>
  )
}

export default Pdf
