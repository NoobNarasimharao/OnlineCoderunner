import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialAuth = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialAuth = async (provider) => {
    setLoadingProvider(provider);
    
    // Simulate social authentication
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userTier', 'free');
      localStorage.setItem('userEmail', `user@${provider}.com`);
      localStorage.setItem('authProvider', provider);
      onSuccess();
      navigate('/code-editor-workspace');
      setLoadingProvider(null);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          loading={loadingProvider === 'google'}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Chrome" size={18} />
          <span>Google</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleSocialAuth('github')}
          loading={loadingProvider === 'github'}
          className="flex items-center justify-center space-x-2"
        >
          <Icon name="Github" size={18} />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;