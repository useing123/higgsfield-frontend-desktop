import React from "react"

interface GeneratedContentProps {
  content: React.ReactNode
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({ content }) => {
  // This component will render different types of content based on its type.
  // For now, it's a placeholder.
  return (
    <div className="generated-content">
      <p>Generated Content</p>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  )
}

export default GeneratedContent