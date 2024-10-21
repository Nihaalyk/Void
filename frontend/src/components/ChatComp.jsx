"use client"

import { useState, useEffect, useRef } from "react"
import { SendHorizonal, Mic } from "lucide-react"
import { chatTestData } from "@/utils/chatTestData"
import axios from "axios"
import { message } from "antd"

const ChatComp = ({ currentUser }) => {
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([])
  const audioRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return

      const response = await axios.post(
        `https://tops-gibbon-friendly.ngrok-free.app/api/chat-history`,
        { user_id: currentUser.id }
      )

      console.log(response)
    }

    fetchMessages()
  }, [])

  const handleSubmit = async () => {
    const response = await axios.post("/api/chat", {
      messageText,
    })

    setMessages([...messages, response.data])
  }

  const handleAudioFile = async (e) => {
    const file = e.target.files[0]

    if (!file) {
      message.error("No file selected")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axios.post("/api/audiotext", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("response", response.data)
    } catch (error) {
      message.error("Error uploading file")
    }
  }

  return (
    <section className="h-screen flex flex-col justify-end text-background pt-20">
      <div className="flex flex-col w-full gap-2 overflow-y-auto scrollbar">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message.content}
            role={message.role}
          />
        ))}
      </div>
      <div className="flex w-full gap-2 px-20 pb-6 mt-6">
        <div>
          <button className="bg-background text-accent p-2 rounded-md">
            <Mic size={30} />
          </button>
          <input
            type="file"
            ref={audioRef}
            accept="audio/*"
            onChange={handleAudioFile}
            className="absolute left-[77px] w-[50px] h-[50px] border-2 opacity-0"
          />
        </div>

        <input
          type="text"
          placeholder="Ask a question"
          className="w-full border-2 border-background rounded-md p-2 text-xl text-accent"
        />

        <button
          onClick={handleSubmit}
          className="bg-background text-accent p-2 rounded-md"
        >
          <SendHorizonal size={30} />
        </button>
      </div>
    </section>
  )
}

const Message = ({ message, role }) => {
  return (
    <div
      className={`text-xl font-medium w-full px-20 rounded-md p-2 flex ${
        role === "assistant" ? "justify-start" : "justify-end"
      }`}
    >
      <div className="bg-background text-accent rounded-md py-2 px-8 max-w-[50%]">
        <p className="text-sm">{role}</p>
        {message}
      </div>
    </div>
  )
}

export default ChatComp
