"use client"

import { useState, useEffect } from "react"
import pdfToText from "react-pdftotext"
import Tesseract from "tesseract.js"
import D3visual from "./D3visual"
import { message } from "antd"
import axios from "axios"
import {
  treeData as init,
  treeDat as init2,
  treeData2 as init3,
} from "@/app/utils/treeData"

const Choose = () => {
  const [current, setCurrent] = useState("pdf")
  const [file, setFile] = useState(null)
  const [textData, setTextData] = useState(null)
  const [treeData, setTreeData] = useState(init)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleFile = async () => {
    try {
      if (file) {
        if (current === "pdf") {
          const text = await pdfToText(file)
          setTextData(text)
          console.log("text", textData)
          message.success("Successful")
        } else if (current === "image") {
          const {
            data: { text },
          } = await Tesseract.recognize(file, "eng", {
            logger: (m) => console.log(m),
          })
          console.log("text", text)
          setTextData(text)
          message.success("Successful")
        } else if (current === "audio") {
          console.log("file", file)
          message.success("Successful")
        }
      }
    } catch (error) {
      console.error(error)
      message.error("Failed to convert file.")
    }
  }

  useEffect(() => {
    const processTextData = async () => {
      if (textData) {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/process",
            { raw_text: textData }
          )
          console.log(response.data)
          /* setTreeData(response.data); */
        } catch (err) {
          console.log(err)
          message.error("Failed to process file.")
        }
      }
    }

    async function processText(rawText) {
      try {
        const response = await fetch("http://localhost:8000/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw_text: rawText }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        // Handle the received knowledge graph
        console.log(data.knowledge_graph)
        // Update your state or context with the received data
      } catch (error) {
        console.error("Error processing text:", error)
      }
    }

    processTextData()
  }, [textData])

  const handleButtonClick = (type) => {
    setCurrent(type)
  }

  const buttonClass = (type) =>
    `px-4 py-2 rounded-md w-48 transition-all duration-300 ${
      current === type
        ? "bg-foreground text-background"
        : "bg-accent text-background"
    }`

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="flex flex-col items-center justify-center gap-2 my-20">
        <h2 className="text-4xl font-bold">Welcome to Omni</h2>
        <p>Choose a file to upload and visualize</p>
      </div>
      <div className="flex lg:flex-row flex-col gap-4 px-4 py-2 rounded-md">
        <button
          onClick={() => handleButtonClick("pdf")}
          className={buttonClass("pdf")}
        >
          Pdf
        </button>

        <button
          onClick={() => handleButtonClick("image")}
          className={buttonClass("image")}
        >
          Image
        </button>

        <button
          onClick={() => handleButtonClick("audio")}
          className={buttonClass("audio")}
        >
          Audio
        </button>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col items-center justify-center p-4 rounded-md">
          <h2 className="text-3xl font-bold">PDF</h2>
          <input
            type="file"
            accept="application/pdf image/* audio/*"
            onChange={handleFileChange}
            className="border-2 rounded-md"
          />
          <button
            type="submit"
            onClick={handleFile}
            className="w-full mt-6 py-2 bg-accent text-background rounded-full form-btn"
          >
            Convert
          </button>
        </div>
      </div>

      <div>
        <D3visual data={treeData} />
      </div>
    </section>
  )
}

export default Choose
