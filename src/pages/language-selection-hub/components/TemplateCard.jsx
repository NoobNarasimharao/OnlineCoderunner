import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TemplateCard = ({ template, userTier = 'free' }) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    navigate('/code-editor-workspace', { 
      state: { 
        language: template.language,
        template: template.code,
        templateName: template.name
      } 
    });
  };

  const isPremiumOnly = template.tier === 'premium' && userTier === 'free';

  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
      isPremiumOnly ? 'opacity-75' : 'hover:border-primary/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="FileCode" size={16} className="text-primary" />
          <h4 className="font-medium text-card-foreground text-sm">{template.name}</h4>
        </div>
        {template.tier === 'premium' && (
          <div className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
            Pro
          </div>
        )}
      </div>

      {/* Language Badge */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
          {template.language}
        </span>
        <span className="text-xs text-muted-foreground">
          {template.difficulty}
        </span>
      </div>

      {/* Code Preview */}
      <div className="bg-muted rounded-md p-3 mb-3 overflow-hidden">
        <pre className="text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
          {template.preview}
        </pre>
      </div>

      {/* Action Button */}
      <Button
        variant={isPremiumOnly ? 'outline' : 'secondary'}
        size="sm"
        fullWidth
        onClick={isPremiumOnly ? () => navigate('/user-authentication') : handleUseTemplate}
        disabled={isPremiumOnly}
        iconName={isPremiumOnly ? 'Lock' : 'Code'}
        iconPosition="left"
        className="text-xs"
      >
        {isPremiumOnly ? 'Upgrade Required' : 'Use Template'}
      </Button>
    </div>
  );
};

export default TemplateCard;