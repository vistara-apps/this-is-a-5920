import React from 'react'
import { Calendar, Users, GitBranch, ExternalLink, Clock, Target } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import UserAvatar, { GroupAvatar } from '../ui/UserAvatar'

const ProjectCard = ({ 
  project, 
  variant = 'active', 
  onJoin, 
  onView, 
  currentUser,
  className = '' 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isUserMember = project.members?.some(member => member.user?.id === currentUser?.id)
  const canJoin = project.is_recruiting && !isUserMember && project.current_members < project.max_members

  return (
    <Card className={`${className} ${variant === 'completed' ? 'opacity-75' : ''} relative`} hover>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className="space-y-3 mb-4">
          {/* AI Application */}
          {project.target_ai_application && (
            <div className="flex items-center text-sm text-gray-600">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              <span className="font-medium">Focus:</span>
              <span className="ml-1">{project.target_ai_application}</span>
            </div>
          )}

          {/* Timeline */}
          {project.timeline && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">Timeline:</span>
              <span className="ml-1">{project.timeline}</span>
            </div>
          )}

          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-medium">
                {project.current_members || project.members?.length || 0}/{project.max_members || 10} members
              </span>
            </div>
            
            {project.members && project.members.length > 0 && (
              <GroupAvatar 
                users={project.members.map(m => m.user || m)} 
                maxVisible={3}
                size="sm"
              />
            )}
          </div>

          {/* Required Skills */}
          {project.required_skills && project.required_skills.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Required Skills:</span>
              <div className="flex flex-wrap gap-1">
                {project.required_skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {project.required_skills.length > 4 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                    +{project.required_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Difficulty Level */}
          {project.difficulty && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Difficulty:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}>
                {project.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Project Links */}
        {(project.github_url || project.demo_url) && (
          <div className="flex space-x-2 mb-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <GitBranch className="h-4 w-4 mr-1" />
                GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <UserAvatar 
              user={project.creator} 
              size="sm" 
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {project.creator?.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(project.created_at || project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView?.(project)}
            >
              View Details
            </Button>
            
            {canJoin && (
              <Button
                size="sm"
                onClick={() => onJoin?.(project)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Join Project
              </Button>
            )}
            
            {isUserMember && (
              <Button
                size="sm"
                onClick={() => onView?.(project)}
                className="bg-green-600 hover:bg-green-700"
              >
                Open Project
              </Button>
            )}
          </div>
        </div>

        {/* Recruiting Badge */}
        {project.is_recruiting && !isUserMember && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Recruiting
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProjectCard
