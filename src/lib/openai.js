import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const generateAIIdea = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an AI business idea generator. Generate creative, feasible AI-powered business ideas based on the user\'s input. Provide a brief description, target market, and potential challenges.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500
    })
    
    return response.choices[0].message.content
  } catch (error) {
    console.error('Error generating AI idea:', error)
    return 'Sorry, I couldn\'t generate an idea right now. Please try again later.'
  }
}