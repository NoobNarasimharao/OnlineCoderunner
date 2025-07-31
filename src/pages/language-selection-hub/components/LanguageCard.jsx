import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LanguageCard = ({ language, userTier = 'free' }) => {
  const navigate = useNavigate();

  const handleStartCoding = () => {
    navigate('/code-editor-workspace', { 
      state: { 
        language: language.id,
        template: language.defaultTemplate 
      } 
    });
  };

  const getSpeedIndicator = (speed) => {
    const speedConfig = {
      fast: { color: 'text-success', icon: 'Zap', label: 'Fast' },
      medium: { color: 'text-warning', icon: 'Clock', label: 'Medium' },
      slow: { color: 'text-muted-foreground', icon: 'Timer', label: 'Slow' }
    };
    return speedConfig[speed] || speedConfig.medium;
  };

  const speedInfo = getSpeedIndicator(language.compilationSpeed);
  const isPremiumOnly = language.tier === 'premium' && userTier === 'free';

  return (
    <div className={`bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
      isPremiumOnly ? 'opacity-75' : 'hover:border-primary/20'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src={language.logo} 
              alt={`${language.name} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{language.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name={speedInfo.icon} size={14} className={speedInfo.color} />
              <span className={`text-xs ${speedInfo.color}`}>{speedInfo.label}</span>
            </div>
          </div>
        </div>
        {language.tier === 'premium' && (
          <div className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
            Pro
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {language.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {language.features.slice(0, 3).map((feature, index) => (
          <span 
            key={index}
            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* Action Button */}
      <Button
        variant={isPremiumOnly ? 'outline' : 'default'}
        fullWidth
        onClick={isPremiumOnly ? () => navigate('/user-authentication') : handleStartCoding}
        disabled={isPremiumOnly}
        iconName={isPremiumOnly ? 'Lock' : 'Play'}
        iconPosition="left"
        className="text-sm"
      >
        {isPremiumOnly ? 'Upgrade to Access' : 'Start Coding'}
      </Button>
    </div>
  );
};

export default LanguageCard;