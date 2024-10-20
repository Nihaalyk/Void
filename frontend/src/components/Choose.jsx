"use client"

import { useState, useEffect } from "react"
import D3visual from "./D3visual"
import { message } from "antd"
import axios from "axios"
import {
  treeData as init,
  defaultTreeData as defTree,
} from "@/app/utils/treeData"

const Choose = ({ currentUser }) => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [save, setSave] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) {
      message.error("Please select a file")
      setFile(null)
      setFileType(null)
      return
    }

    setFile(selectedFile)
    setFileType(selectedFile.type)
  }

  const handleFile = () => {
    if (!file && !fileType) {
      message.error("Please upload a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    axios
      .post(
        "https://tops-gibbon-friendly.ngrok-free.app/api/knowledge-graph",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      )
      .then((res) => {
        console.log(res)
        setTreeData(res.data)
        if (res.data !== null) setSave(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSave = async () => {
    await axios
      .post("/api/savegraph", {
        graph: treeData,
        user: currentUser.id,
      })
      .then((res) => {
        message.success("Saved!")
        console.log(res)
      })
      .catch(() => {
        message.error("Failed to save")
      })
  }

  const handleCancel = () => {
    setSave(false)
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

      {save && (
        <div className="flex flex-col justify-center items-center gap-x-4">
          <p>Save the graph?</p>
          <div className="flex gap-x-4 mt-2">
            <button
              onClick={handleSave}
              className="w-32 py-2 bg-accent text-background rounded-full form-btn"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="w-32 py-2 bg-accent text-background rounded-full form-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div>
        <D3visual data={treeData} />
      </div>
    </section>
  )
}

export default Choose
