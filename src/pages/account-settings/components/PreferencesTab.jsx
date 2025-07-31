import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    fontSize: 'medium',
    autoSave: true,
    autoSaveFrequency: '30',
    defaultLanguage: 'javascript',
    emailNotifications: true,
    pushNotifications: false,
    codeCompletion: true,
    lineNumbers: true,
    wordWrap: false,
    minimap: true,
    bracketMatching: true,
    indentGuides: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'System Default' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small (12px)' },
    { value: 'medium', label: 'Medium (14px)' },
    { value: 'large', label: 'Large (16px)' },
    { value: 'xlarge', label: 'Extra Large (18px)' }
  ];

  const autoSaveOptions = [
    { value: '10', label: '10 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' },
    { value: '300', label: '5 minutes' }
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const handleSelectChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, checked) => {
    setPreferences(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const resetToDefaults = () => {
    setPreferences({
      theme: 'dark',
      fontSize: 'medium',
      autoSave: true,
      autoSaveFrequency: '30',
      defaultLanguage: 'javascript',
      emailNotifications: true,
      pushNotifications: false,
      codeCompletion: true,
      lineNumbers: true,
      wordWrap: false,
      minimap: true,
      bracketMatching: true,
      indentGuides: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} color="var(--color-success)" />
          <span className="text-success font-medium">Preferences saved successfully!</span>
        </div>
      )}

      {/* Editor Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Code Editor Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Theme"
            description="Choose your preferred editor theme"
            options={themeOptions}
            value={preferences.theme}
            onChange={(value) => handleSelectChange('theme', value)}
          />

          <Select
            label="Font Size"
            description="Set the editor font size"
            options={fontSizeOptions}
            value={preferences.fontSize}
            onChange={(value) => handleSelectChange('fontSize', value)}
          />

          <Select
            label="Default Language"
            description="Language to load when creating new files"
            options={languageOptions}
            value={preferences.defaultLanguage}
            onChange={(value) => handleSelectChange('defaultLanguage', value)}
          />

          <Select
            label="Auto-save Frequency"
            description="How often to automatically save your code"
            options={autoSaveOptions}
            value={preferences.autoSaveFrequency}
            onChange={(value) => handleSelectChange('autoSaveFrequency', value)}
            disabled={!preferences.autoSave}
          />
        </div>

        {/* Editor Features */}
        <div className="mt-6">
          <h4 className="font-medium text-foreground mb-4">Editor Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Auto-save"
              description="Automatically save your code while typing"
              checked={preferences.autoSave}
              onChange={(e) => handleCheckboxChange('autoSave', e.target.checked)}
            />

            <Checkbox
              label="Code Completion"
              description="Enable intelligent code suggestions"
              checked={preferences.codeCompletion}
              onChange={(e) => handleCheckboxChange('codeCompletion', e.target.checked)}
            />

            <Checkbox
              label="Line Numbers"
              description="Show line numbers in the editor"
              checked={preferences.lineNumbers}
              onChange={(e) => handleCheckboxChange('lineNumbers', e.target.checked)}
            />

            <Checkbox
              label="Word Wrap"
              description="Wrap long lines to fit the editor width"
              checked={preferences.wordWrap}
              onChange={(e) => handleCheckboxChange('wordWrap', e.target.checked)}
            />

            <Checkbox
              label="Minimap"
              description="Show a miniature overview of your code"
              checked={preferences.minimap}
              onChange={(e) => handleCheckboxChange('minimap', e.target.checked)}
            />

            <Checkbox
              label="Bracket Matching"
              description="Highlight matching brackets and parentheses"
              checked={preferences.bracketMatching}
              onChange={(e) => handleCheckboxChange('bracketMatching', e.target.checked)}
            />

            <Checkbox
              label="Indent Guides"
              description="Show vertical lines for code indentation"
              checked={preferences.indentGuides}
              onChange={(e) => handleCheckboxChange('indentGuides', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Notifications</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Receive updates about your account and new features via email"
            checked={preferences.emailNotifications}
            onChange={(e) => handleCheckboxChange('emailNotifications', e.target.checked)}
          />

          <Checkbox
            label="Push Notifications"
            description="Get browser notifications for important updates"
            checked={preferences.pushNotifications}
            onChange={(e) => handleCheckboxChange('pushNotifications', e.target.checked)}
          />
        </div>

        {/* Notification Types */}
        {(preferences.emailNotifications || preferences.pushNotifications) && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Notification Types</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-accent)" />
                <span>Account security alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-accent)" />
                <span>New feature announcements</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-accent)" />
                <span>Subscription and billing updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} color="var(--color-accent)" />
                <span>System maintenance notifications</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Accessibility</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Eye" size={20} color="var(--color-primary)" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">High Contrast Mode</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Enhance text and UI element contrast for better visibility
                </p>
                <Button variant="outline" size="sm">
                  Enable High Contrast
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Type" size={20} color="var(--color-primary)" className="mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Screen Reader Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Optimize the interface for screen readers and assistive technologies
                </p>
                <Button variant="outline" size="sm">
                  Configure Screen Reader
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={resetToDefaults}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset to Defaults
        </Button>

        <Button
          variant="default"
          onClick={handleSave}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesTab;