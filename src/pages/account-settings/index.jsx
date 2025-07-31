import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProfileTab from './components/ProfileTab';
import SubscriptionTab from './components/SubscriptionTab';
import PreferencesTab from './components/PreferencesTab';
import SecurityTab from './components/SecurityTab';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      component: ProfileTab
    },
    {
      id: 'subscription',
      label: 'Subscription',
      icon: 'CreditCard',
      component: SubscriptionTab
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      component: PreferencesTab
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      component: SecurityTab
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ProfileTab;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button
              onClick={() => navigate('/language-selection-hub')}
              className="hover:text-foreground transition-colors duration-200"
            >
              Home
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">Account Settings</span>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile, subscription, preferences, and security settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon 
                        name={tab.icon} 
                        size={18} 
                        color={activeTab === tab.id ? 'currentColor' : 'var(--color-muted-foreground)'}
                      />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/code-editor-workspace')}
                      iconName="Code2"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Code Editor
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/code-history-dashboard')}
                      iconName="History"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      My Code
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/language-selection-hub')}
                      iconName="Grid3X3"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Languages
                    </Button>
                  </div>
                </div>

                {/* Support */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Need Help?</h4>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="HelpCircle"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Help Center
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageCircle"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg">
                {/* Tab Header - Mobile */}
                <div className="lg:hidden border-b border-border p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={tabs.find(tab => tab.id === activeTab)?.icon || 'User'} 
                        size={20} 
                        color="var(--color-primary)" 
                      />
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <ActiveComponent />
                </div>
              </div>
            </div>
          </div>

          {/* Account Deletion Section */}
          <div className="mt-12 bg-card border border-error/20 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Icon name="AlertTriangle" size={24} color="var(--color-error)" className="mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">Danger Zone</h3>
                <p className="text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                  variant="destructive"
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;