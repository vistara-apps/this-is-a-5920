import React from 'react'
import AIIdeaGenerator from '../components/ai/AIIdeaGenerator'

const AIIdeas = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Business Ideas</h1>
        <p className="text-gray-600">
          Generate, refine, and validate AI-powered business concepts with our intelligent assistant.
        </p>
      </div>

      <AIIdeaGenerator />
    </div>
  )
}

export default AIIdeas