import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, User } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const PostCard = ({ post, onLike, onComment }) => {
  const { content, authorId, createdAt, likes = 0, commentsCount = 0 } = post
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(post.postId)
  }

  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">User {authorId}</span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-800 leading-relaxed mb-4">{content}</p>
          
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes + (isLiked ? 1 : 0)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment(post.postId)}
              className="flex items-center space-x-2 text-gray-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{commentsCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-500"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default PostCard