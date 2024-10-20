"use client"

import { useState, useEffect } from "react"

import D3visual from "./D3visual"
import { message } from "antd"
import axios from "axios"
import {
  treeData as init,
  defaultTreeData as defTree,
} from "@/app/utils/treeData"

const Choose = () => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [treeData, setTreeData] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setFileType(e.target.files[0].type)
  }

  const handleFile = () => {
    if (!file && !fileType) {
      message.error("Please upload a file")
    }

    const formData = new FormData()
    formData.append("file", file)

    axios
      .post("https://tops-gibbon-friendly.ngrok-free.app/api/test", formData, {
        "Content-Type": "multipart/form-data",
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="flex flex-col items-center justify-center gap-2 mt-6">
        <h2 className="text-4xl font-bold">Upload a file to visualize</h2>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col items-center justify-center p-4 rounded-md">
          <input
            type="file"
            accept="application/pdf, image/*, audio/*"
            onChange={handleFileChange}
            className="border-2 rounded-md p-2"
          />
          <button
            type="submit"
            onClick={handleFile}
            className="w-full mt-6 py-2 bg-accent text-background rounded-full form-btn"
          >
            Visualize
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
