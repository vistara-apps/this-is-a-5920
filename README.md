# NicheNet AI

**Connect, Collaborate, and Create AI Ventures**

NicheNet AI is a comprehensive web application designed for students and AI enthusiasts to create and join niche communities, share ideas, collaborate on AI-driven business ventures, and find resources and mentorship.

![NicheNet AI Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=NicheNet+AI+Dashboard)

## 🚀 Features

### 🏘️ Niche Community Creation & Joining
- Create or join communities based on specific academic or career interests
- Specialized feeds for posts, discussions, and resource sharing
- Community-specific project collaboration spaces

### 🤝 Collaborative Project Spaces
- Dedicated spaces for proposing and managing AI-driven business ventures
- Team formation and task management tools
- Integration with GitHub for code collaboration

### 🧠 AI Business Idea Generation & Validation
- AI-powered business idea generation with structured output
- Community-driven validation and feedback system
- Advanced AI analysis for market viability and technical feasibility

### 📚 Curated Learning Resources & Mentorship
- Access to expert-curated learning materials and workshops
- Mentorship matching system with AI-powered recommendations
- Personalized learning paths based on skills and goals

### 💳 Subscription Model
- **Free Tier**: Basic community access, limited AI features
- **Premium Tier ($10/month)**: Unlimited access, advanced AI tools, priority mentorship

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI API / OpenRouter
- **Payments**: Stripe
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key or OpenRouter account
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vistara-apps/this-is-a-5920.git
cd this-is-a-5920
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI/OpenRouter Configuration
VITE_OPENAI_API_KEY=your-openai-or-openrouter-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly_id
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies as defined in the schema

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ai/             # AI-related components
│   ├── community/      # Community components
│   ├── layout/         # Layout components
│   ├── post/           # Post components
│   ├── project/        # Project components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── lib/               # Utility libraries
│   ├── api.js         # Supabase API functions
│   ├── openai.js      # AI service functions
│   ├── stripe.js      # Payment functions
│   └── supabase.js    # Supabase client
├── pages/             # Page components
└── App.jsx            # Main app component
```

## 🎨 Design System

The application follows a consistent design system with:

- **Colors**: Primary purple theme with accent colors
- **Typography**: Clean, readable font hierarchy
- **Components**: Modular, reusable UI components
- **Spacing**: Consistent spacing scale (sm: 8px, md: 16px, lg: 24px)
- **Animations**: Smooth transitions and hover effects

## 🔧 API Integration

### Supabase APIs
- User management and authentication
- Community and project data
- Real-time subscriptions
- File storage for avatars and images

### AI Services
- Business idea generation with structured output
- Idea validation and scoring
- Content suggestions for posts
- Mentorship matching recommendations
- Personalized learning paths

### Stripe Integration
- Subscription management
- Customer portal
- Usage-based limitations
- Webhook handling for subscription events

## 🚀 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t nichenet-ai .

# Run the container
docker run -p 3000:3000 nichenet-ai
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

- Database URLs and keys
- API keys for external services
- Stripe webhook endpoints
- CORS settings for your domain

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📚 API Documentation

### Core Entities

#### User
```javascript
{
  id: "uuid",
  username: "string",
  email: "string",
  bio: "string",
  interests: ["array", "of", "strings"],
  subscription_tier: "free|premium",
  subscription_status: "active|inactive|cancelled"
}
```

#### Community
```javascript
{
  id: "uuid",
  name: "string",
  description: "string",
  topic: "string",
  creator_id: "uuid",
  member_count: "number",
  is_private: "boolean"
}
```

#### Project
```javascript
{
  id: "uuid",
  name: "string",
  description: "string",
  status: "planning|active|completed|paused",
  target_ai_application: "string",
  required_skills: ["array"],
  max_members: "number",
  is_recruiting: "boolean"
}
```

#### AI Idea
```javascript
{
  id: "uuid",
  title: "string",
  description: "string",
  target_market: "string",
  ai_technology: "string",
  revenue_model: "string",
  validation_status: "draft|validating|validated|rejected",
  ai_generated: "boolean"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Community**: Join our Discord server for discussions

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core community and project features
- ✅ AI idea generation and validation
- ✅ Basic subscription system
- ✅ User authentication and profiles

### Phase 2 (Next)
- 🔄 Advanced mentorship system
- 🔄 Real-time collaboration tools
- 🔄 Mobile app development
- 🔄 Integration with more AI services

### Phase 3 (Future)
- 📋 Marketplace for AI tools and services
- 📋 Advanced analytics and insights
- 📋 Enterprise features
- 📋 API for third-party integrations

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [OpenAI](https://openai.com) for AI capabilities
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for the design system
- [Lucide React](https://lucide.dev) for icons

---

**Built with ❤️ for the AI community**
