import React from 'react'
import { Users, MessageCircle, Calendar } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const CommunityCard = ({ community, onJoin, isJoined = false }) => {
  const { name, description, topic, members = 0, postsCount = 0, createdAt } = community

  return (
    <Card hover className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            {topic}
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button
            variant={isJoined ? "secondary" : "primary"}
            size="sm"
            onClick={() => onJoin(community)}
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {members} members
          </span>
          <span className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            {postsCount} posts
          </span>
        </div>
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  )
}

export default CommunityCard