import { supabase } from './supabase'

// ============================================================================
// USER API FUNCTIONS
// ============================================================================

export const userAPI = {
  // Get user profile by ID
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Search users by username or interests
  async searchUsers(query, limit = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, bio, interests, avatar_url')
      .or(`username.ilike.%${query}%, bio.ilike.%${query}%`)
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

// ============================================================================
// COMMUNITY API FUNCTIONS
// ============================================================================

export const communityAPI = {
  // Get all public communities with optional filtering
  async getCommunities(filters = {}) {
    let query = supabase
      .from('communities')
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        member_count
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false })

    if (filters.topic) {
      query = query.eq('topic', filters.topic)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Get communities user is a member of
  async getUserCommunities(userId) {
    const { data, error } = await supabase
      .from('community_memberships')
      .select(`
        community:communities(
          *,
          creator:users!creator_id(username, avatar_url)
        )
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data.map(item => item.community)
  },

  // Create a new community
  async createCommunity(communityData, userId) {
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .insert({
        ...communityData,
        creator_id: userId
      })
      .select()
      .single()

    if (communityError) throw communityError

    // Add creator as admin member
    const { error: membershipError } = await supabase
      .from('community_memberships')
      .insert({
        community_id: community.id,
        user_id: userId,
        role: 'admin'
      })

    if (membershipError) throw membershipError
    return community
  },

  // Join a community
  async joinCommunity(communityId, userId) {
    const { data, error } = await supabase
      .from('community_memberships')
      .insert({
        community_id: communityId,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Leave a community
  async leaveCommunity(communityId, userId) {
    const { error } = await supabase
      .from('community_memberships')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId)

    if (error) throw error
  },

  // Check if user is member of community
  async isMember(communityId, userId) {
    const { data, error } = await supabase
      .from('community_memberships')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
}

// ============================================================================
// POST API FUNCTIONS
// ============================================================================

export const postAPI = {
  // Get posts for a community
  async getCommunityPosts(communityId, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users!author_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  },

  // Create a new post
  async createPost(postData, userId) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        ...postData,
        author_id: userId
      })
      .select(`
        *,
        author:users!author_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Like/unlike a post
  async togglePostLike(postId, userId) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      
      if (error) throw error
      return false
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        })
      
      if (error) throw error
      return true
    }
  },

  // Get post with comments
  async getPostWithComments(postId) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users!author_id(username, avatar_url),
        community:communities!community_id(name),
        comments(
          *,
          author:users!author_id(username, avatar_url)
        )
      `)
      .eq('id', postId)
      .single()

    if (error) throw error
    return data
  }
}

// ============================================================================
// PROJECT API FUNCTIONS
// ============================================================================

export const projectAPI = {
  // Get projects for a community
  async getCommunityProjects(communityId, filters = {}) {
    let query = supabase
      .from('projects')
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        community:communities!community_id(name),
        members:project_memberships(
          user:users!user_id(username, avatar_url)
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.recruiting) {
      query = query.eq('is_recruiting', true)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Create a new project
  async createProject(projectData, userId) {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        creator_id: userId
      })
      .select()
      .single()

    if (projectError) throw projectError

    // Add creator as project lead
    const { error: membershipError } = await supabase
      .from('project_memberships')
      .insert({
        project_id: project.id,
        user_id: userId,
        role: 'lead'
      })

    if (membershipError) throw membershipError
    return project
  },

  // Join a project
  async joinProject(projectId, userId, skills = []) {
    const { data, error } = await supabase
      .from('project_memberships')
      .insert({
        project_id: projectId,
        user_id: userId,
        skills_contributing: skills
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user's projects
  async getUserProjects(userId) {
    const { data, error } = await supabase
      .from('project_memberships')
      .select(`
        project:projects(
          *,
          community:communities!community_id(name),
          creator:users!creator_id(username, avatar_url)
        )
      `)
      .eq('user_id', userId)

    if (error) throw error
    return data.map(item => item.project)
  }
}

// ============================================================================
// AI IDEAS API FUNCTIONS
// ============================================================================

export const aiIdeasAPI = {
  // Get AI ideas with optional filtering
  async getAIIdeas(filters = {}, limit = 20, offset = 0) {
    let query = supabase
      .from('ai_ideas')
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (filters.communityId) {
      query = query.eq('community_id', filters.communityId)
    }

    if (filters.status) {
      query = query.eq('validation_status', filters.status)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Create a new AI idea
  async createAIIdea(ideaData, userId) {
    const { data, error } = await supabase
      .from('ai_ideas')
      .insert({
        ...ideaData,
        creator_id: userId
      })
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Like/unlike an AI idea
  async toggleIdeaLike(ideaId, userId) {
    const { data: existingLike } = await supabase
      .from('ai_idea_likes')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      const { error } = await supabase
        .from('ai_idea_likes')
        .delete()
        .eq('idea_id', ideaId)
        .eq('user_id', userId)
      
      if (error) throw error
      return false
    } else {
      const { error } = await supabase
        .from('ai_idea_likes')
        .insert({
          idea_id: ideaId,
          user_id: userId
        })
      
      if (error) throw error
      return true
    }
  },

  // Add comment to AI idea
  async addIdeaComment(ideaId, userId, content, commentType = 'feedback') {
    const { data, error } = await supabase
      .from('ai_idea_comments')
      .insert({
        idea_id: ideaId,
        author_id: userId,
        content,
        comment_type: commentType
      })
      .select(`
        *,
        author:users!author_id(username, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Get user's AI ideas
  async getUserIdeas(userId) {
    const { data, error } = await supabase
      .from('ai_ideas')
      .select(`
        *,
        community:communities!community_id(name)
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// ============================================================================
// LEARNING RESOURCES API FUNCTIONS
// ============================================================================

export const resourcesAPI = {
  // Get learning resources
  async getResources(filters = {}, limit = 20, offset = 0) {
    let query = supabase
      .from('learning_resources')
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (filters.type) {
      query = query.eq('resource_type', filters.type)
    }

    if (filters.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty)
    }

    if (filters.communityId) {
      query = query.eq('community_id', filters.communityId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Create a new learning resource
  async createResource(resourceData, userId) {
    const { data, error } = await supabase
      .from('learning_resources')
      .insert({
        ...resourceData,
        creator_id: userId
      })
      .select(`
        *,
        creator:users!creator_id(username, avatar_url),
        community:communities!community_id(name)
      `)
      .single()

    if (error) throw error
    return data
  }
}

// ============================================================================
// NOTIFICATIONS API FUNCTIONS
// ============================================================================

export const notificationsAPI = {
  // Get user notifications
  async getUserNotifications(userId, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
  },

  // Mark all notifications as read
  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
  },

  // Create a notification
  async createNotification(notificationData) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

export const subscriptions = {
  // Subscribe to community posts
  subscribeToCommunityPosts(communityId, callback) {
    return supabase
      .channel(`community-${communityId}-posts`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `community_id=eq.${communityId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscribe to user notifications
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel(`user-${userId}-notifications`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // Unsubscribe from a channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription)
  }
}
