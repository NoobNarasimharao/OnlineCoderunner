import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AuthTabs from './components/AuthTabs';
import SignInForm from './components/SignInForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';
import TierBenefits from './components/TierBenefits';
import Icon from '../../components/AppIcon';

const UserAuthentication = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/code-editor-workspace');
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    setAuthSuccess(true);
    // Navigation is handled by individual form components
  };

  if (authSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-[60px] flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Check" size={32} color="white" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to CodeRunner!</h2>
            <p className="text-muted-foreground">Redirecting you to the code editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[60px] min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Code" size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join CodeRunner'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'signin' ?'Sign in to continue coding in your browser' :'Create your account and start coding instantly'
              }
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'signin' ? (
              <SignInForm onSuccess={handleAuthSuccess} />
            ) : (
              <RegisterForm onSuccess={handleAuthSuccess} />
            )}
            
            <SocialAuth onSuccess={handleAuthSuccess} />
          </div>

          {/* Feature Comparison */}
          <TierBenefits />

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors duration-200">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-primary transition-colors duration-200">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-primary transition-colors duration-200">
                Help Center
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} CodeRunner. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;