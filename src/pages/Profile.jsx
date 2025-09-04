import React, { useState } from 'react'
import { User, Edit2, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: user?.user_metadata?.username || 'Student User',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || 'Passionate about AI and innovation',
    interests: user?.user_metadata?.interests?.join(', ') || 'Machine Learning, Healthcare, Education'
  })

  const handleSave = () => {
    // In real app, this would update the user profile in Supabase
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original values
    setProfileData({
      username: user?.user_metadata?.username || 'Student User',
      email: user?.email || '',
      bio: user?.user_metadata?.bio || 'Passionate about AI and innovation',
      interests: user?.user_metadata?.interests?.join(', ') || 'Machine Learning, Healthcare, Education'
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Input
                label="Username"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={true} // Email typically can't be changed
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <Input
                label="Interests (comma-separated)"
                name="interests"
                value={profileData.interests}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {profileData.username}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{profileData.email}</p>
              
              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                  <p className="text-gray-600 text-sm">Communities Joined</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-600">7</span>
                  <p className="text-gray-600 text-sm">Projects</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-600">15</span>
                  <p className="text-gray-600 text-sm">Posts</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Current Plan</div>
              <div className="text-lg font-semibold text-purple-600 mb-4">Free Tier</div>
              <Button className="w-full">
                Upgrade to Premium
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                $10/month for premium features
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile