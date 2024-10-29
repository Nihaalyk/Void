"use client"

import { useState, useEffect } from "react"
import D3visual from "./D3visual"
import { message } from "antd"
import axios from "axios"
import Extra from "./Extra"
import {
  treeData as init,
  defaultTreeData as defTree,
} from "@/app/utils/treeData"

const Choose = ({ currentUser }) => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [treeData, setTreeData] = useState(null)
  const [save, setSave] = useState(false)
  const [graphName, setGraphName] = useState("")

  console.log(currentUser)

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

  const handleFile = async () => {
    if (!file && !fileType) {
      message.error("Please upload a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    await axios
      .post(
        "http://localhost:8000/api/knowledge-graph",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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

  const handleFile2 = () => {
    if (!file && !fileType) {
      message.error("Please upload a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    axios
      .post(
        "http://localhost/api/knowledge-graph",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
    try {
      if (graphName == "") {
        message.error("Please enter a graph name")
        return
      }

      if (!currentUser || !currentUser.id) {
        console.error("User not found")
      }

      await axios.post("/api/savegraph", {
        id: currentUser.id,
        graph: treeData,
        name: graphName,
        raw_text: "This is a test",
      })

      message.success("Saved!")
      setSave(false)
      graphName("")
    } catch (error) {
      console.error("Error:", error)
      // message.error("Failed to save")
    }
  }

  const handleCancel = () => {
    setSave(false)
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-20 pb-10">
      <div className="flex flex-col items-center justify-center gap-2 mt-6">
        <h2 className="text-4xl font-bold">Upload a file to visualize</h2>
      </div>

      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-col items-center justify-center p-4 rounded-md">
          <input
            type="file"
            id="file-upload"
            accept="application/pdf, image/*, audio/*"
            onChange={handleFileChange}
            className="border-2 rounded-md p-2  bg-accent"
          />

          <button
            type="submit"
            onClick={handleFile}
            className="w-full mt-6 py-2 bg-background text-accent font-medium rounded-full hover:bg-zinc-300 transition"
          >
            Visualize
          </button>
        </div>
      </div>

      {save && (
        <div className="flex flex-col justify-center items-center gap-x-4">
          <p>Save the graph?</p>
          <input
            type="text"
            placeholder="Graph name"
            className="border-2 rounded-md p-2 text-accent"
            onChange={(e) => setGraphName(e.target.value)}
          />
          <div className="flex gap-x-4 mt-2">
            <button
              onClick={handleSave}
              className="w-32 py-2 bg-background text-accent font-medium rounded-full hover:bg-zinc-300 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="w-32 py-2 bg-background text-accent font-medium rounded-full hover:bg-zinc-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div>
        <D3visual data={treeData} />
      </div>
      <div>
        <Extra />
      </div>
    </section>
  )
}

export default Choose
