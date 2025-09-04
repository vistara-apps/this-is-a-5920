# NicheNet AI Deployment Guide

This guide covers the complete deployment process for NicheNet AI, from development to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (React/Vite)  │◄──►│   (Database)    │    │   Services      │
│                 │    │   (Auth)        │    │                 │
│   - Communities │    │   (Real-time)   │    │   - OpenAI      │
│   - Projects    │    │   (Storage)     │    │   - Stripe      │
│   - AI Ideas    │    │                 │    │   - Email       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Deployment (Vercel/Netlify)

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_OPENAI_API_KEY=your-openai-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
   VITE_STRIPE_PREMIUM_PRICE_ID=price_live_id
   ```

### Netlify Deployment

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

2. **Environment Variables**
   Add the same variables as above in Netlify dashboard.

## 🐳 Docker Deployment

### Development

```bash
# Build development image
docker build -f Dockerfile.dev -t nichenet-ai:dev .

# Run with environment file
docker run --env-file .env -p 5173:5173 nichenet-ai:dev
```

### Production

```bash
# Build production image
docker build -t nichenet-ai:prod .

# Run production container
docker run -d \
  --name nichenet-ai \
  -p 3000:3000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-anon-key \
  -e VITE_OPENAI_API_KEY=your-openai-key \
  -e VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key \
  nichenet-ai:prod
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  nichenet-ai:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
      - VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
      - VITE_STRIPE_PREMIUM_PRICE_ID=${VITE_STRIPE_PREMIUM_PRICE_ID}
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nichenet-ai
    restart: unless-stopped
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   Add all required environment variables in Amplify console.

#### Using EC2 + Docker

1. **Launch EC2 Instance**
   ```bash
   # Amazon Linux 2
   sudo yum update -y
   sudo yum install -y docker
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/vistara-apps/this-is-a-5920.git
   cd this-is-a-5920
   
   # Build and run
   docker build -t nichenet-ai .
   docker run -d -p 80:3000 --name nichenet-ai nichenet-ai
   ```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Push Image**
   ```bash
   # Build for Cloud Run
   docker build -t gcr.io/PROJECT_ID/nichenet-ai .
   docker push gcr.io/PROJECT_ID/nichenet-ai
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy nichenet-ai \
     --image gcr.io/PROJECT_ID/nichenet-ai \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure Deployment

#### Using Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name nichenet-ai \
  --image nichenet-ai:latest \
  --dns-name-label nichenet-ai \
  --ports 3000 \
  --environment-variables \
    VITE_SUPABASE_URL=https://your-project.supabase.co \
    VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down the URL and anon key

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `database-schema.sql`
3. Execute the script

### 3. Configure Authentication

1. **Email Authentication**
   - Enable email authentication
   - Configure email templates
   - Set up SMTP (optional)

2. **Social Authentication** (Optional)
   ```sql
   -- Enable Google OAuth
   -- Configure in Supabase Auth settings
   ```

3. **Row Level Security**
   - Policies are included in the schema
   - Verify they're enabled for all tables

### 4. Storage Setup

1. **Create Buckets**
   ```sql
   -- Create avatars bucket
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('avatars', 'avatars', true);
   
   -- Create community images bucket
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('community-images', 'community-images', true);
   ```

2. **Storage Policies**
   ```sql
   -- Allow users to upload their own avatars
   CREATE POLICY "Users can upload own avatar" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

## 💳 Stripe Configuration

### 1. Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete account verification
3. Get API keys from dashboard

### 2. Create Products and Prices

```bash
# Create Premium product
stripe products create \
  --name "NicheNet AI Premium" \
  --description "Unlimited access to AI features and premium content"

# Create monthly price
stripe prices create \
  --product prod_XXXXXXXXXX \
  --unit-amount 1000 \
  --currency usd \
  --recurring interval=month
```

### 3. Configure Webhooks

1. **Webhook Endpoint**: `https://your-domain.com/api/stripe/webhook`
2. **Events to Listen**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 4. Test Payments

Use Stripe test cards:
- Success: `4242424242424242`
- Decline: `4000000000000002`

## 🤖 AI Service Configuration

### OpenAI Setup

1. **Get API Key**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Create API key
   - Set usage limits

2. **Configure Models**
   ```javascript
   // Recommended models
   const models = {
     ideaGeneration: 'gpt-4-turbo-preview',
     validation: 'gpt-4',
     contentSuggestions: 'gpt-3.5-turbo'
   }
   ```

### OpenRouter Alternative

1. **Sign up** at [openrouter.ai](https://openrouter.ai)
2. **Get API key** and credits
3. **Configure models**:
   ```javascript
   const models = {
     ideaGeneration: 'google/gemini-2.0-flash-001',
     validation: 'anthropic/claude-3-sonnet',
     contentSuggestions: 'meta-llama/llama-3.1-8b-instruct'
   }
   ```

## 🔒 Security Configuration

### 1. Environment Variables

**Never commit sensitive data!**

```bash
# Production .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... # Anon key (safe for client)
VITE_OPENAI_API_KEY=sk-... # API key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... # Publishable key (safe for client)
```

### 2. CORS Configuration

In Supabase dashboard:
```
Allowed origins: https://your-domain.com
```

### 3. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://your-project.supabase.co https://api.openai.com https://api.stripe.com;
">
```

### 4. Rate Limiting

Implement rate limiting for API calls:
```javascript
// Example rate limiting
const rateLimiter = {
  aiRequests: 10, // per minute for free users
  premiumAiRequests: 100 // per minute for premium users
}
```

## 📊 Monitoring & Analytics

### 1. Error Tracking

**Sentry Integration**
```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE
})
```

### 2. Analytics

**Google Analytics 4**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Performance Monitoring

**Web Vitals**
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 🚀 Performance Optimization

### 1. Build Optimization

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

### 2. Image Optimization

```javascript
// Use WebP format with fallbacks
const ImageComponent = ({ src, alt }) => (
  <picture>
    <source srcSet={`${src}.webp`} type="image/webp" />
    <img src={`${src}.jpg`} alt={alt} loading="lazy" />
  </picture>
)
```

### 3. Caching Strategy

```javascript
// Service Worker for caching
const CACHE_NAME = 'nichenet-ai-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
        VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Testing in Production

### 1. Health Checks

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})
```

### 2. Feature Flags

```javascript
// Feature flag system
const features = {
  aiFeatures: process.env.VITE_ENABLE_AI_FEATURES === 'true',
  payments: process.env.VITE_ENABLE_PAYMENTS === 'true',
  realTime: process.env.VITE_ENABLE_REAL_TIME === 'true'
}
```

### 3. A/B Testing

```javascript
// Simple A/B testing
const abTest = (userId, testName) => {
  const hash = hashCode(userId + testName)
  return hash % 2 === 0 ? 'A' : 'B'
}
```

## 📋 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database schema applied
- [ ] Authentication working
- [ ] Payment system tested
- [ ] AI features functional
- [ ] Real-time features working
- [ ] Error tracking configured
- [ ] Analytics implemented
- [ ] Performance monitoring active
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] CDN configured (if applicable)
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variables Not Loading**
   ```bash
   # Check variable names (must start with VITE_)
   # Restart development server after changes
   ```

3. **Supabase Connection Issues**
   ```javascript
   // Check CORS settings in Supabase dashboard
   // Verify URL and key are correct
   ```

4. **Stripe Webhook Issues**
   ```bash
   # Test webhook locally with Stripe CLI
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### Logs and Debugging

```bash
# View application logs
docker logs nichenet-ai

# View real-time logs
docker logs -f nichenet-ai

# Debug build issues
npm run build -- --debug
```

---

**Need help?** Check our [GitHub Issues](https://github.com/vistara-apps/this-is-a-5920/issues) or join our Discord community.
