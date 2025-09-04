import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import CommunityCard from '../components/community/CommunityCard'
import CreateCommunityModal from '../components/community/CreateCommunityModal'
import { useAuth } from '../contexts/AuthContext'

const Communities = () => {
  const { user } = useAuth()
  const [communities, setCommunities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [joinedCommunities, setJoinedCommunities] = useState(new Set())

  // Mock data - in real app, this would come from Supabase
  useEffect(() => {
    const mockCommunities = [
      {
        communityId: '1',
        name: 'AI in Healthcare',
        description: 'Exploring applications of artificial intelligence in medical diagnosis, treatment, and patient care.',
        topic: 'Healthcare',
        members: 245,
        postsCount: 89,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        communityId: '2',
        name: 'Sustainable Tech',
        description: 'Building AI solutions for environmental sustainability and climate change mitigation.',
        topic: 'Environment',
        members: 189,
        postsCount: 67,
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        communityId: '3',
        name: 'EdTech Innovation',
        description: 'Revolutionizing education through AI-powered learning platforms and personalized tutoring.',
        topic: 'Education',
        members: 156,
        postsCount: 45,
        createdAt: '2024-02-01T09:15:00Z'
      },
      {
        communityId: '4',
        name: 'FinTech AI',
        description: 'AI applications in finance, from fraud detection to algorithmic trading and robo-advisors.',
        topic: 'Finance',
        members: 203,
        postsCount: 78,
        createdAt: '2024-01-28T16:45:00Z'
      }
    ]
    setCommunities(mockCommunities)
  }, [])

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCommunity = async (communityData) => {
    // In real app, this would use Supabase
    const newCommunity = {
      ...communityData,
      communityId: Date.now().toString(),
      members: 1,
      postsCount: 0,
      createdAt: new Date().toISOString()
    }
    setCommunities([newCommunity, ...communities])
  }

  const handleJoinCommunity = (community) => {
    const newJoined = new Set(joinedCommunities)
    if (newJoined.has(community.communityId)) {
      newJoined.delete(community.communityId)
    } else {
      newJoined.add(community.communityId)
    }
    setJoinedCommunities(newJoined)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
          <p className="text-gray-600">Discover and join niche AI communities</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <CommunityCard
            key={community.communityId}
            community={community}
            onJoin={handleJoinCommunity}
            isJoined={joinedCommunities.has(community.communityId)}
          />
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No communities found matching your search.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4"
          >
            Create the first one
          </Button>
        </div>
      )}

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCommunity}
      />
    </div>
  )
}

export default Communities