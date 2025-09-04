import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// AI Idea Generation with structured output
export const generateAIIdea = async (prompt, context = {}) => {
  try {
    const systemPrompt = `You are an expert AI business consultant specializing in generating innovative, feasible AI-powered business ideas. 

Your task is to generate a comprehensive business idea based on the user's input. Always respond with a JSON object containing the following structure:

{
  "title": "Catchy business name (max 50 characters)",
  "description": "Detailed description of the business idea (200-300 words)",
  "targetMarket": "Specific target market and customer segments",
  "potentialChallenges": "Key challenges and risks to consider",
  "aiTechnology": "Specific AI technologies that would be used",
  "revenueModel": "How the business would make money",
  "competitiveAdvantage": "What makes this idea unique",
  "implementationSteps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "estimatedCost": "Rough estimate of initial investment needed",
  "timeToMarket": "Estimated time to launch (e.g., '6-12 months')"
}

Focus on practical, implementable ideas that leverage current AI capabilities. Consider the user's background and interests if provided.`

    const userPrompt = `Generate an AI business idea based on: ${prompt}
    
    ${context.userInterests ? `User interests: ${context.userInterests.join(', ')}` : ''}
    ${context.communityTopic ? `Community focus: ${context.communityTopic}` : ''}
    ${context.experienceLevel ? `Experience level: ${context.experienceLevel}` : ''}`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8
    })
    
    const content = response.choices[0].message.content
    
    // Try to parse JSON response
    try {
      const parsedIdea = JSON.parse(content)
      return parsedIdea
    } catch (parseError) {
      // Fallback to plain text if JSON parsing fails
      return {
        title: 'AI Business Idea',
        description: content,
        targetMarket: 'To be determined',
        potentialChallenges: 'To be analyzed',
        aiTechnology: 'Various AI technologies',
        revenueModel: 'To be defined',
        competitiveAdvantage: 'To be identified',
        implementationSteps: ['Research market', 'Develop MVP', 'Test with users', 'Scale business'],
        estimatedCost: 'To be estimated',
        timeToMarket: '6-12 months'
      }
    }
  } catch (error) {
    console.error('Error generating AI idea:', error)
    throw new Error('Failed to generate AI idea. Please try again.')
  }
}

// Validate and improve an existing AI idea
export const validateAIIdea = async (idea) => {
  try {
    const systemPrompt = `You are an expert business validator specializing in AI ventures. Analyze the provided business idea and give constructive feedback.

Respond with a JSON object containing:
{
  "overallScore": 85, // Score out of 100
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "marketViability": "Assessment of market potential",
  "technicalFeasibility": "Assessment of technical implementation",
  "competitiveAnalysis": "Analysis of competition and differentiation",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please validate this AI business idea:
          
          Title: ${idea.title}
          Description: ${idea.description}
          Target Market: ${idea.targetMarket}
          AI Technology: ${idea.aiTechnology}
          Revenue Model: ${idea.revenueModel}`
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error validating AI idea:', error)
    throw new Error('Failed to validate AI idea. Please try again.')
  }
}

// Generate AI-powered content suggestions for posts
export const generateContentSuggestions = async (topic, communityContext) => {
  try {
    const systemPrompt = `You are a content strategist for AI communities. Generate engaging post ideas and discussion starters.

Respond with a JSON array of 5 content suggestions:
[
  {
    "title": "Post title",
    "content": "Post content or discussion starter",
    "type": "discussion|question|resource|idea",
    "tags": ["tag1", "tag2", "tag3"]
  }
]`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate content suggestions for topic: ${topic} in the context of: ${communityContext}`
        }
      ],
      max_tokens: 600,
      temperature: 0.8
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating content suggestions:', error)
    return []
  }
}

// AI-powered project idea generation
export const generateProjectIdea = async (skills, interests, communityTopic) => {
  try {
    const systemPrompt = `You are a project ideation expert for AI communities. Generate collaborative project ideas that match the user's skills and interests.

Respond with a JSON object:
{
  "name": "Project name",
  "description": "Detailed project description",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "timeline": "Estimated timeline",
  "difficulty": "beginner|intermediate|advanced",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "learningOutcomes": ["What participants will learn"],
  "potentialImpact": "How this project could make a difference"
}`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate a project idea for:
          Skills: ${skills.join(', ')}
          Interests: ${interests.join(', ')}
          Community Topic: ${communityTopic}`
        }
      ],
      max_tokens: 700,
      temperature: 0.8
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating project idea:', error)
    throw new Error('Failed to generate project idea. Please try again.')
  }
}

// Smart mentorship matching suggestions
export const generateMentorshipMatches = async (userProfile, availableMentors) => {
  try {
    const systemPrompt = `You are a mentorship matching expert. Analyze the user profile and suggest the best mentor matches from the available list.

Respond with a JSON array of top 3 matches:
[
  {
    "mentorId": "mentor_id",
    "matchScore": 95, // Score out of 100
    "reasons": ["Reason 1", "Reason 2", "Reason 3"],
    "suggestedTopics": ["Topic 1", "Topic 2"],
    "approachStrategy": "How to approach this mentor"
  }
]`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User Profile: ${JSON.stringify(userProfile)}
          Available Mentors: ${JSON.stringify(availableMentors)}`
        }
      ],
      max_tokens: 600,
      temperature: 0.6
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating mentorship matches:', error)
    return []
  }
}

// AI-powered learning path recommendations
export const generateLearningPath = async (currentSkills, targetGoals, timeCommitment) => {
  try {
    const systemPrompt = `You are a learning path designer for AI professionals. Create a personalized learning roadmap.

Respond with a JSON object:
{
  "title": "Learning path title",
  "duration": "Total estimated duration",
  "difficulty": "beginner|intermediate|advanced",
  "phases": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "Phase duration",
      "topics": ["Topic 1", "Topic 2"],
      "resources": [
        {
          "title": "Resource title",
          "type": "course|book|article|video",
          "url": "resource_url_if_available",
          "estimatedTime": "time_needed"
        }
      ],
      "projects": ["Hands-on project suggestions"],
      "milestones": ["What you'll achieve in this phase"]
    }
  ],
  "prerequisites": ["What you need to know before starting"],
  "outcomes": ["What you'll be able to do after completion"]
}`

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a learning path for:
          Current Skills: ${currentSkills.join(', ')}
          Target Goals: ${targetGoals.join(', ')}
          Time Commitment: ${timeCommitment} hours per week`
        }
      ],
      max_tokens: 1200,
      temperature: 0.7
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating learning path:', error)
    throw new Error('Failed to generate learning path. Please try again.')
  }
}
