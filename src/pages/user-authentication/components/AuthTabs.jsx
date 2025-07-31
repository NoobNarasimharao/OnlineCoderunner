import React from 'react';
import Button from '../../../components/ui/Button';

const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      <Button
        variant={activeTab === 'signin' ? 'default' : 'ghost'}
        onClick={() => onTabChange('signin')}
        className="flex-1 text-sm font-medium"
      >
        Sign In
      </Button>
      <Button
        variant={activeTab === 'register' ? 'default' : 'ghost'}
        onClick={() => onTabChange('register')}
        className="flex-1 text-sm font-medium"
      >
        Register
      </Button>
    </div>
  );
};

export default AuthTabs;