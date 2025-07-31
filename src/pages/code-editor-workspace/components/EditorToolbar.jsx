import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const EditorToolbar = ({ 
  onRunCode, 
  onNewFile, 
  onSaveFile, 
  onShareCode,
  selectedLanguage,
  onLanguageChange,
  isRunning,
  hasUnsavedChanges 
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' }
  ];

  const handleShare = () => {
    onShareCode();
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 3000);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-card border-b border-border">
        {/* Left side - Language selector and file actions */}
        <div className="flex items-center space-x-3">
          <Select
            options={languageOptions}
            value={selectedLanguage}
            onChange={onLanguageChange}
            placeholder="Select Language"
            className="w-40"
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewFile}
              iconName="FileText"
              iconPosition="left"
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
            >
              Save
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              iconName="Share2"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Right side - Run button */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground">
            {hasUnsavedChanges && (
              <span className="flex items-center space-x-1">
                <Icon name="Circle" size={8} className="text-warning fill-current" />
                <span>Unsaved changes</span>
              </span>
            )}
          </div>
          
          <Button
            variant="default"
            onClick={onRunCode}
            loading={isRunning}
            iconName="Play"
            iconPosition="left"
            className="bg-primary hover:bg-primary/90"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      {/* Share Success Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="Check" size={20} className="text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Code Shared Successfully!</h3>
                <p className="text-sm text-muted-foreground">Share link copied to clipboard</p>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <code className="text-sm text-foreground break-all">
                https://coderunner.dev/shared/abc123xyz
              </code>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorToolbar;