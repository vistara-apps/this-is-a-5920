import React, { useState, useEffect } from 'react'
import { Plus, Filter } from 'lucide-react'
import Button from '../components/ui/Button'
import ProjectCard from '../components/project/ProjectCard'
import CreateProjectModal from '../components/project/CreateProjectModal'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [joinedProjects, setJoinedProjects] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock data - in real app, this would come from Supabase
  useEffect(() => {
    const mockProjects = [
      {
        projectId: '1',
        name: 'AI Health Monitor',
        description: 'Developing a wearable AI system that monitors vital signs and predicts health issues before they become serious.',
        members: ['user1', 'user2', 'user3'],
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z',
        communityId: '1'
      },
      {
        projectId: '2',
        name: 'Smart Farm Assistant',
        description: 'Creating an AI-powered agricultural assistant that optimizes crop yields while minimizing environmental impact.',
        members: ['user4', 'user5'],
        status: 'planning',
        createdAt: '2024-02-01T14:30:00Z',
        communityId: '2'
      },
      {
        projectId: '3',
        name: 'Personalized Learning AI',
        description: 'Building an adaptive learning platform that personalizes education content based on individual learning styles.',
        members: ['user6', 'user7', 'user8', 'user9'],
        status: 'active',
        createdAt: '2024-01-28T09:15:00Z',
        communityId: '3'
      },
      {
        projectId: '4',
        name: 'Fraud Detection System',
        description: 'Completed AI system for real-time fraud detection in financial transactions using machine learning.',
        members: ['user10', 'user11'],
        status: 'completed',
        createdAt: '2024-01-10T16:45:00Z',
        communityId: '4'
      }
    ]
    setProjects(mockProjects)
  }, [])

  const filteredProjects = statusFilter === 'all' 
    ? projects 
    : projects.filter(project => project.status === statusFilter)

  const handleCreateProject = async (projectData) => {
    // In real app, this would use Supabase
    const newProject = {
      ...projectData,
      projectId: Date.now().toString(),
      members: ['current-user'],
      status: 'planning',
      createdAt: new Date().toISOString(),
      communityId: '1' // This would be selected in the modal
    }
    setProjects([newProject, ...projects])
  }

  const handleJoinProject = (project) => {
    const newJoined = new Set(joinedProjects)
    if (newJoined.has(project.projectId)) {
      newJoined.delete(project.projectId)
    } else {
      newJoined.add(project.projectId)
    }
    setJoinedProjects(newJoined)
  }

  const handleViewProject = (project) => {
    // In real app, this would navigate to project detail page
    console.log('Viewing project:', project)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Collaborate on AI-driven ventures</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        {['all', 'active', 'planning', 'completed'].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.projectId}
            project={project}
            onJoin={handleJoinProject}
            onView={handleViewProject}
            isJoined={joinedProjects.has(project.projectId)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects found with the current filter.</p>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4"
          >
            Start a new project
          </Button>
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        communityName="AI Community"
      />
    </div>
  )
}

export default Projects