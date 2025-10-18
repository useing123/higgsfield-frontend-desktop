import React from "react"
import { Message as MessageType } from "./types"
import GeneratedContent from "./GeneratedContent"

interface MessageProps {
  message: MessageType
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-3 rounded-lg max-w-md ${
          message.sender === "user"
            ? "bg-blue-500 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        <p>{message.text}</p>
      </div>
      {message.content && <GeneratedContent content={message.content} />}
    </div>
  )
}

export default Message