import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProfileTab = () => {
  const [profileData, setProfileData] = useState({
    username: 'codemaster2024',
    email: 'john.doe@example.com',
    displayName: 'John Doe',
    bio: 'Full-stack developer passionate about clean code and innovative solutions. Love working with React, Node.js, and exploring new technologies.'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (profileData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to original data (in real app, would fetch from server)
    setProfileData({
      username: 'codemaster2024',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      bio: 'Full-stack developer passionate about clean code and innovative solutions. Love working with React, Node.js, and exploring new technologies.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} color="var(--color-success)" />
          <span className="text-success font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={32} color="var(--color-primary)" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-3">
              Upload a profile picture to personalize your account. Recommended size: 200x200px
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" iconName="Upload" iconPosition="left">
                Upload Photo
              </Button>
              <Button variant="ghost" iconName="Trash2" iconPosition="left">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              iconName="Edit2"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Username"
            type="text"
            value={profileData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            error={errors.username}
            disabled={!isEditing}
            required
            description="This will be your unique identifier on the platform"
          />

          <Input
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            disabled={!isEditing}
            required
            description="Used for account notifications and recovery"
          />

          <div className="md:col-span-2">
            <Input
              label="Display Name"
              type="text"
              value={profileData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              error={errors.displayName}
              disabled={!isEditing}
              required
              description="This name will be shown to other users"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio
              <span className="text-muted-foreground ml-1">(Optional)</span>
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg resize-none transition-colors duration-200 ${
                !isEditing 
                  ? 'bg-muted border-border text-muted-foreground cursor-not-allowed' 
                  : 'bg-input border-border text-foreground focus:border-ring focus:ring-1 focus:ring-ring'
              }`}
              placeholder="Tell us about yourself, your coding interests, and experience..."
            />
            <div className="flex justify-between items-center mt-2">
              {errors.bio && (
                <span className="text-sm text-error">{errors.bio}</span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {profileData.bio.length}/500 characters
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">247</div>
            <div className="text-sm text-muted-foreground">Code Executions</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent mb-1">12</div>
            <div className="text-sm text-muted-foreground">Languages Used</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-warning mb-1">45</div>
            <div className="text-sm text-muted-foreground">Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;