import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, TrendingUp, DollarSign, Clock, Target, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import UserAvatar from '../ui/UserAvatar'

const AIIdeaCard = ({ 
  idea, 
  onLike, 
  onComment, 
  onShare, 
  onValidate,
  currentUser,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const getValidationStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'validating':
        return 'bg-yellow-100 text-yellow-800'
      case 'validated':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getValidationIcon = (status) => {
    switch (status) {
      case 'validated':
        return CheckCircle
      case 'rejected':
        return AlertCircle
      case 'validating':
        return Clock
      default:
        return Lightbulb
    }
  }

  const handleLike = async () => {
    setIsLiked(!isLiked)
    await onLike?.(idea.id)
  }

  const ValidationIcon = getValidationIcon(idea.validation_status)

  return (
    <Card className={`${className} transition-all duration-200`} hover>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {idea.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getValidationStatusColor(idea.validation_status)}`}>
                <ValidationIcon className="h-3 w-3 inline mr-1" />
                {idea.validation_status}
              </span>
              {idea.ai_generated && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  AI Generated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-gray-600 text-sm ${isExpanded ? '' : 'line-clamp-3'}`}>
            {idea.description}
          </p>
          {idea.description.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 text-sm font-medium mt-1 hover:text-purple-700"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Target Market */}
          {idea.target_market && (
            <div className="flex items-start space-x-2">
              <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-700 block">Target Market</span>
                <span className="text-sm text-gray-600">{idea.target_market}</span>
              </div>
            </div>
          )}

          {/* AI Technology */}
          {idea.ai_technology && (
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-700 block">AI Technology</span>
                <span className="text-sm text-gray-600">{idea.ai_technology}</span>
              </div>
            </div>
          )}

          {/* Revenue Model */}
          {idea.revenue_model && (
            <div className="flex items-start space-x-2">
              <DollarSign className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-700 block">Revenue Model</span>
                <span className="text-sm text-gray-600">{idea.revenue_model}</span>
              </div>
            </div>
          )}

          {/* Time to Market */}
          {idea.time_to_market && (
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-700 block">Time to Market</span>
                <span className="text-sm text-gray-600">{idea.time_to_market}</span>
              </div>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
            {/* Competitive Advantage */}
            {idea.competitive_advantage && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">Competitive Advantage</span>
                <p className="text-sm text-gray-600">{idea.competitive_advantage}</p>
              </div>
            )}

            {/* Potential Challenges */}
            {idea.potential_challenges && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">Potential Challenges</span>
                <p className="text-sm text-gray-600">{idea.potential_challenges}</p>
              </div>
            )}

            {/* Implementation Steps */}
            {idea.implementation_steps && idea.implementation_steps.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Implementation Steps</span>
                <ol className="list-decimal list-inside space-y-1">
                  {idea.implementation_steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600">{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Estimated Cost */}
            {idea.estimated_cost && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">Estimated Cost</span>
                <p className="text-sm text-gray-600">{idea.estimated_cost}</p>
              </div>
            )}
          </div>
        )}

        {/* Community Badge */}
        {idea.community && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
              {idea.community.name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{(idea.likes_count || 0) + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => onComment?.(idea)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{idea.comments_count || 0}</span>
            </button>

            <button
              onClick={() => onShare?.(idea)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {idea.validation_status === 'draft' && currentUser && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onValidate?.(idea)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Validate
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <UserAvatar 
              user={idea.creator} 
              size="sm" 
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {idea.creator?.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(idea.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Validation Score */}
          {idea.validation_score && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {idea.validation_score}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default AIIdeaCard
