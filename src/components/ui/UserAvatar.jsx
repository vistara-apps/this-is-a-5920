import React from 'react'
import { User } from 'lucide-react'

const UserAvatar = ({ 
  user, 
  size = 'default', 
  variant = 'default',
  className = '',
  showName = false,
  onClick 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    default: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  }

  const avatarClasses = `
    ${sizeClasses[size]}
    rounded-full
    flex items-center justify-center
    font-medium
    ${variant === 'group' ? 'border-2 border-white shadow-sm' : ''}
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${className}
  `

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getBackgroundColor = (name) => {
    if (!name) return 'bg-gray-400'
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const displayName = user?.username || user?.name || 'Unknown User'

  return (
    <div className={`flex items-center ${showName ? 'space-x-2' : ''}`}>
      <div
        className={`${avatarClasses} ${user?.avatar_url ? 'bg-gray-200' : `${getBackgroundColor(displayName)} text-white`}`}
        onClick={onClick}
        title={displayName}
      >
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={displayName}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {!user?.avatar_url && (
          <span className="select-none">
            {displayName ? getInitials(displayName) : <User className="h-1/2 w-1/2" />}
          </span>
        )}
      </div>
      
      {showName && (
        <span className="text-sm font-medium text-gray-900 truncate">
          {displayName}
        </span>
      )}
    </div>
  )
}

// Group avatar component for showing multiple users
export const GroupAvatar = ({ users = [], maxVisible = 3, size = 'default', className = '' }) => {
  const visibleUsers = users.slice(0, maxVisible)
  const remainingCount = users.length - maxVisible

  return (
    <div className={`flex -space-x-1 ${className}`}>
      {visibleUsers.map((user, index) => (
        <UserAvatar
          key={user.id || index}
          user={user}
          size={size}
          variant="group"
          className="relative"
        />
      ))}
      
      {remainingCount > 0 && (
        <div className={`
          ${size === 'sm' ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'}
          rounded-full
          bg-gray-100
          border-2 border-white
          flex items-center justify-center
          text-gray-600
          font-medium
          relative
        `}>
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

export default UserAvatar
