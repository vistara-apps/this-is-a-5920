import React, { useState } from 'react'
import { Lightbulb, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { generateAIIdea } from '../../lib/openai'

const AIIdeaGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedIdea, setGeneratedIdea] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const idea = await generateAIIdea(prompt)
      setGeneratedIdea(idea)
    } catch (error) {
      console.error('Error generating idea:', error)
      setGeneratedIdea('Sorry, there was an error generating your idea. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI Business Idea Generator</h2>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Describe your interests or problem area"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., healthcare efficiency, sustainable agriculture, student productivity..."
          />
          
          <Button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate AI Business Idea'
            )}
          </Button>
        </div>
      </Card>

      {generatedIdea && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your AI Business Idea</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{generatedIdea}</p>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Save Idea
            </Button>
            <Button variant="ghost" size="sm">
              Share with Community
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setGeneratedIdea('')}>
              Generate Another
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AIIdeaGenerator