import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

const CreateCommunityModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topic: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({ name: '', description: '', topic: '' })
      onClose()
    } catch (error) {
      console.error('Error creating community:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Community">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Community Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., AI in Healthcare"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe what this community is about..."
            required
          />
        </div>
        
        <Input
          label="Topic/Category"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="e.g., Healthcare, Education, Finance"
          required
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateCommunityModal