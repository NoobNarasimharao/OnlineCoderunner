import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useTheme } from '../../../hooks/useTheme';
import Icon from '../../../components/AppIcon';

const EnhancedEditorToolbar = ({ 
  onRunCode, 
  onNewFile, 
  onSaveFile, 
  onShareCode,
  onFormatCode,
  selectedLanguage,
  onLanguageChange,
  isRunning,
  hasUnsavedChanges,
  isAutosaveEnabled,
  onToggleAutosave,
  executionQueue = 0,
  onCancelExecution,
  onToggleLayout
}) => {
  const { theme, toggleTheme } = useTheme();
  const [showShareModal, setShowShareModal] = useState(false);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'c', label: 'C', icon: '🔧' },
    { value: 'csharp', label: 'C#', icon: '💜' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📋' }
  ];

  const handleShare = () => {
    onShareCode();
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 3000);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-card border-b border-border editor-toolbar">
        {/* Left side - Language selector and file actions */}
        <div className="flex items-center space-x-3 animate-slide-in">
          <div className="interactive-panel rounded-lg p-1">
            <Select
              options={languageOptions}
              value={selectedLanguage}
              onChange={onLanguageChange}
              placeholder="Select Language"
              className="w-48 form-control-enhanced"
              renderOption={(option) => (
                <div className="flex items-center space-x-2 hover:bg-accent/50 transition-colors duration-200 rounded px-2 py-1">
                  <span className="text-lg animate-scale-in">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
              )}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewFile}
              iconName="FileText"
              iconPosition="left"
              className="hidden sm:flex btn-interactive ripple-effect hover:bg-primary/10 hover:text-primary transform hover:scale-105 transition-all duration-200"
            >
              New
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveFile}
              iconName="Save"
              iconPosition="left"
              disabled={!hasUnsavedChanges}
              className={`hidden sm:flex btn-interactive ripple-effect transition-all duration-200 ${
                hasUnsavedChanges 
                  ? 'hover:bg-success/10 hover:text-success transform hover:scale-105 animate-glow' 
                  : 'opacity-50'
              }`}
            >
              Save
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onFormatCode}
              iconName="Code"
              iconPosition="left"
              className="hidden md:flex btn-interactive ripple-effect hover:bg-info/10 hover:text-info transform hover:scale-105 hover:rotate-3 transition-all duration-200"
            >
              Format
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              iconName="Share2"
              iconPosition="left"
              className="hidden sm:flex btn-interactive ripple-effect hover:bg-warning/10 hover:text-warning transform hover:scale-105 transition-all duration-200"
            >
              Share
            </Button>

            {/* Mobile menu */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                className="btn-interactive ripple-effect hover:bg-accent hover:rotate-90 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Center - Execution status with enhanced animations */}
        <div className="flex items-center space-x-3 animate-fade-in">
          {executionQueue > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground interactive-panel rounded-full px-3 py-1 bg-warning/10">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse pulse-glow"></div>
              <span className="font-medium">Queue: {executionQueue}</span>
            </div>
          )}
          
          {isRunning && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelExecution}
              iconName="Square"
              className="text-error border-error hover:bg-error/10 btn-interactive ripple-effect transform hover:scale-105 animate-wiggle"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Right side - Theme toggle, settings, and run button */}
        <div className="flex items-center space-x-3 animate-slide-in">
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleAutosave}
              iconName={isAutosaveEnabled ? "Save" : "SaveOff"}
              className={`btn-interactive ripple-effect transition-all duration-200 ${
                isAutosaveEnabled 
                  ? "text-success hover:bg-success/10 pulse-glow" :"hover:bg-muted hover:text-foreground"
              } transform hover:scale-105`}
            />
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-1 interactive-panel rounded-full px-2 py-1 bg-warning/10 animate-bounce-slow">
                <Icon name="Circle" size={8} className="text-warning fill-current animate-pulse" />
                <span className="font-medium">Unsaved</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              iconName={theme === 'dark' ? 'Sun' : 'Moon'}
              className="hidden sm:flex btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 hover:rotate-12 transition-all duration-300"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLayout}
              iconName="SplitSquareHorizontal"
              className="hidden lg:flex btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200"
            />
            
            <Button
              variant="default"
              onClick={onRunCode}
              loading={isRunning}
              iconName={isRunning ? "Square" : "Play"}
              iconPosition="left"
              className={`bg-primary hover:bg-primary/90 btn-interactive ripple-effect transform transition-all duration-200 ${
                isRunning 
                  ? 'animate-pulse scale-105' :'hover:scale-105 hover:shadow-lg hover:shadow-primary/25'
              } gradient-border`}
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Share Success Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4 interactive-panel animate-scale-in glass-effect">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center animate-bounce-slow">
                <Icon name="Check" size={20} className="text-success animate-scale-in" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Code Shared Successfully!</h3>
                <p className="text-sm text-muted-foreground">Share link copied to clipboard</p>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3 interactive-panel hover:bg-muted/80 transition-all duration-200">
              <code className="text-sm text-foreground break-all font-mono">
                https://coderunner.dev/shared/{Math.random().toString(36).substr(2, 9)}
              </code>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(false)}
                className="btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedEditorToolbar;