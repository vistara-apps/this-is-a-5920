import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here')

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Join up to 3 communities',
      'Basic AI idea generation (5 per month)',
      'Community discussions',
      'Basic project collaboration'
    ],
    limits: {
      communities: 3,
      aiIdeas: 5,
      projects: 2
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 10,
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    features: [
      'Unlimited community access',
      'Unlimited AI idea generation',
      'Advanced AI business validation tools',
      'Priority mentorship matching',
      'Exclusive premium content',
      'Advanced project management tools',
      'Direct messaging with mentors',
      'Early access to new features'
    ],
    limits: {
      communities: Infinity,
      aiIdeas: Infinity,
      projects: Infinity
    }
  }
}

export const stripeAPI = {
  // Create a checkout session for subscription
  async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
    try {
      // Get user profile to check if they have a Stripe customer ID
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id, email')
        .eq('id', userId)
        .single()

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          customerEmail: user?.email,
          customerId: user?.stripe_customer_id,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  },

  // Create a customer portal session for managing subscription
  async createPortalSession(userId, returnUrl) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single()

      if (!user?.stripe_customer_id) {
        throw new Error('No Stripe customer found')
      }

      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  },

  // Get user's current subscription status
  async getSubscriptionStatus(userId) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status, stripe_customer_id')
        .eq('id', userId)
        .single()

      return {
        tier: user?.subscription_tier || 'free',
        status: user?.subscription_status || 'inactive',
        hasStripeCustomer: !!user?.stripe_customer_id
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return {
        tier: 'free',
        status: 'inactive',
        hasStripeCustomer: false
      }
    }
  },

  // Check if user can perform an action based on their subscription
  async checkSubscriptionLimit(userId, action) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', userId)
        .single()

      const tier = user?.subscription_tier || 'free'
      const plan = SUBSCRIPTION_PLANS[tier.toUpperCase()]

      switch (action) {
        case 'join_community':
          if (plan.limits.communities === Infinity) return true
          
          const { count: communityCount } = await supabase
            .from('community_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
          
          return communityCount < plan.limits.communities

        case 'create_ai_idea':
          if (plan.limits.aiIdeas === Infinity) return true
          
          // Check ideas created this month
          const startOfMonth = new Date()
          startOfMonth.setDate(1)
          startOfMonth.setHours(0, 0, 0, 0)
          
          const { count: ideaCount } = await supabase
            .from('ai_ideas')
            .select('*', { count: 'exact', head: true })
            .eq('creator_id', userId)
            .gte('created_at', startOfMonth.toISOString())
          
          return ideaCount < plan.limits.aiIdeas

        case 'create_project':
          if (plan.limits.projects === Infinity) return true
          
          const { count: projectCount } = await supabase
            .from('project_memberships')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('role', 'lead')
          
          return projectCount < plan.limits.projects

        default:
          return true
      }
    } catch (error) {
      console.error('Error checking subscription limit:', error)
      return false
    }
  },

  // Get usage statistics for the user
  async getUsageStats(userId) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', userId)
        .single()

      const tier = user?.subscription_tier || 'free'
      const plan = SUBSCRIPTION_PLANS[tier.toUpperCase()]

      // Get current usage
      const [
        { count: communityCount },
        { count: projectCount }
      ] = await Promise.all([
        supabase
          .from('community_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('project_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('role', 'lead')
      ])

      // Get AI ideas created this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      const { count: aiIdeasThisMonth } = await supabase
        .from('ai_ideas')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      return {
        tier,
        plan,
        usage: {
          communities: {
            current: communityCount || 0,
            limit: plan.limits.communities
          },
          projects: {
            current: projectCount || 0,
            limit: plan.limits.projects
          },
          aiIdeas: {
            current: aiIdeasThisMonth || 0,
            limit: plan.limits.aiIdeas,
            period: 'monthly'
          }
        }
      }
    } catch (error) {
      console.error('Error getting usage stats:', error)
      return null
    }
  }
}

// Webhook handler utilities (for backend)
export const webhookHandlers = {
  // Handle successful subscription creation
  async handleSubscriptionCreated(subscription) {
    const customerId = subscription.customer
    const priceId = subscription.items.data[0].price.id
    
    // Determine tier based on price ID
    let tier = 'free'
    if (priceId === SUBSCRIPTION_PLANS.PREMIUM.priceId) {
      tier = 'premium'
    }

    // Update user subscription status
    const { error } = await supabase
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        stripe_customer_id: customerId
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  },

  // Handle subscription updates
  async handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer
    const status = subscription.status
    
    let subscriptionStatus = 'inactive'
    if (status === 'active' || status === 'trialing') {
      subscriptionStatus = 'active'
    } else if (status === 'canceled') {
      subscriptionStatus = 'cancelled'
    }

    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: subscriptionStatus
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error updating subscription status:', error)
    }
  },

  // Handle subscription cancellation
  async handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer

    const { error } = await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'cancelled'
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error handling subscription cancellation:', error)
    }
  },

  // Handle customer creation
  async handleCustomerCreated(customer) {
    const { error } = await supabase
      .from('users')
      .update({
        stripe_customer_id: customer.id
      })
      .eq('email', customer.email)

    if (error) {
      console.error('Error updating customer ID:', error)
    }
  }
}

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const getPlanFeatures = (tier) => {
  const plan = SUBSCRIPTION_PLANS[tier?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  return plan.features
}

export const canUpgrade = (currentTier) => {
  return currentTier === 'free'
}

export const getUpgradeUrl = (userId) => {
  return `/upgrade?user=${userId}`
}
