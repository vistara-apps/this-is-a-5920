import React from 'react'
import { Users, Calendar, CheckCircle, Clock } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProjectCard = ({ project, onJoin, onView, isJoined = false }) => {
  const { name, description, members = [], status, createdAt } = project

  const statusConfig = {
    active: { icon: Clock, color: 'text-green-600', bg: 'bg-green-100' },
    completed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
    planning: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' }
  }

  const StatusIcon = statusConfig[status]?.icon || Clock

  return (
    <Card hover className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${statusConfig[status]?.bg} ${statusConfig[status]?.color}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onView(project)}>
            View
          </Button>
          {!isJoined && (
            <Button variant="primary" size="sm" onClick={() => onJoin(project)}>
              Join
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {members.length} members
        </span>
        <span className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>
    </Card>
  )
}

export default ProjectCard