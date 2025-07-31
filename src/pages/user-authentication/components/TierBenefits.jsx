import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TierBenefits = () => {
  const freeTierFeatures = [
    { icon: 'Code', text: 'Basic code editor with syntax highlighting' },
    { icon: 'Play', text: '10 code executions per day' },
    { icon: 'Clock', text: '30-second execution timeout' },
    { icon: 'FileText', text: 'Save up to 5 code snippets' }
  ];

  const premiumFeatures = [
    { icon: 'Zap', text: 'Unlimited code executions' },
    { icon: 'Timer', text: '5-minute execution timeout' },
    { icon: 'Database', text: 'Unlimited code storage' },
    { icon: 'Share', text: 'Private code sharing' },
    { icon: 'Download', text: 'Code export & download' },
    { icon: 'Headphones', text: 'Priority support' }
  ];

  return (
    <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Choose Your Coding Experience
        </h3>
        <p className="text-sm text-muted-foreground">
          Start free and upgrade anytime for enhanced features
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Tier */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Free Tier</h4>
            <span className="text-lg font-bold text-primary">$0</span>
          </div>
          
          <ul className="space-y-2 mb-4">
            {freeTierFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <Icon name={feature.icon} size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">{feature.text}</span>
              </li>
            ))}
          </ul>
          
          <div className="text-xs text-muted-foreground">
            Perfect for learning and small projects
          </div>
        </div>
        
        {/* Premium Tier */}
        <div className="bg-card rounded-lg p-4 border-2 border-primary relative">
          <div className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Popular
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Pro Tier</h4>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">$9</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
          </div>
          
          <ul className="space-y-2 mb-4">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <Icon name={feature.icon} size={16} className="text-primary" />
                <span className="text-foreground">{feature.text}</span>
              </li>
            ))}
          </ul>
          
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="ArrowRight"
            iconPosition="right"
            className="mt-2"
          >
            Upgrade After Signup
          </Button>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          All plans include SSL security, regular backups, and community support
        </p>
      </div>
    </div>
  );
};

export default TierBenefits;