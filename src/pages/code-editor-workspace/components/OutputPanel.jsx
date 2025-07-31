import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const OutputPanel = ({ 
  output, 
  errors, 
  isRunning, 
  onClearOutput,
  onSendInput,
  waitingForInput = false 
}) => {
  const [activeTab, setActiveTab] = useState('output');
  const [inputValue, setInputValue] = useState('');
  const outputRef = useRef(null);
  const errorRef = useRef(null);

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (activeTab === 'output' && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, activeTab]);

  useEffect(() => {
    if (activeTab === 'errors' && errorRef.current) {
      errorRef.current.scrollTop = errorRef.current.scrollHeight;
    }
  }, [errors, activeTab]);

  const handleSendInput = () => {
    if (inputValue.trim()) {
      onSendInput(inputValue);
      setInputValue('');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendInput();
    }
  };

  const tabs = [
    { id: 'output', label: 'Output', icon: 'Terminal', count: output.length },
    { id: 'errors', label: 'Errors', icon: 'AlertCircle', count: errors.length },
    { id: 'input', label: 'Input', icon: 'Keyboard', count: null }
  ];

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden editor-panel animate-fade-in">
      {/* Enhanced Tab Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 editor-toolbar">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-300 tab-button btn-interactive ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-background transform scale-105' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-102'
              }`}
            >
              <Icon name={tab.icon} size={16} className={activeTab === tab.id ? 'animate-glow' : ''} />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-200 animate-scale-in ${
                  tab.id === 'errors' ?'bg-error/10 text-error animate-pulse' :'bg-muted text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 px-4">
          {isRunning && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground interactive-panel rounded-full px-3 py-1 bg-primary/10">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse pulse-glow"></div>
              <span className="font-medium">Running...</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearOutput}
            iconName="Trash2"
            disabled={isRunning}
            className="btn-interactive ripple-effect hover:bg-error/10 hover:text-error transform hover:scale-105 transition-all duration-200"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* Output Tab */}
        {activeTab === 'output' && (
          <div 
            ref={outputRef}
            className="h-full overflow-y-auto p-4 font-mono text-sm output-console animate-slide-in"
          >
            {output.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-fade-in">
                <Icon name="Terminal" size={48} className="mb-4 opacity-50 float-animation" />
                <p className="text-center font-medium">
                  Output will appear here when you run your code
                </p>
                <p className="text-xs mt-2 opacity-75">
                  Click the "Run Code" button to execute your program
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {output.map((item, index) => (
                  <div key={index} className="group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start space-x-3 interactive-panel rounded-lg p-2 hover:bg-muted/20">
                      <span className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                        {formatTimestamp(item.timestamp)}
                      </span>
                      <div className="flex-1">
                        <pre className={`whitespace-pre-wrap break-words transition-all duration-200 hover:scale-[1.02] ${
                          item.type === 'error' ? 'text-error animate-shake' 
                            : item.type === 'warning'? 'text-warning animate-wiggle' :'text-foreground'
                        }`}>
                          {item.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
                
                {waitingForInput && (
                  <div className="flex items-center space-x-2 text-primary animate-bounce-slow interactive-panel rounded-lg p-3 bg-primary/5">
                    <Icon name="ChevronRight" size={16} />
                    <span className="animate-pulse font-medium">Waiting for input...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Errors Tab */}
        {activeTab === 'errors' && (
          <div 
            ref={errorRef}
            className="h-full overflow-y-auto p-4 animate-slide-in"
          >
            {errors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-fade-in">
                <Icon name="CheckCircle" size={48} className="mb-4 opacity-50 text-success float-animation" />
                <p className="text-center font-medium">
                  No errors found
                </p>
                <p className="text-xs mt-2 opacity-75">
                  Compilation and runtime errors will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {errors.map((error, index) => (
                  <div key={index} className="bg-error/5 border border-error/20 rounded-lg p-4 interactive-panel hover:bg-error/10 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-start space-x-3">
                      <Icon name="AlertCircle" size={20} className="text-error mt-0.5 flex-shrink-0 animate-wiggle" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-error">
                            {error.type || 'Error'}
                          </span>
                          {error.line && (
                            <span className="text-xs bg-error/10 text-error px-2 py-1 rounded animate-scale-in">
                              Line {error.line}
                            </span>
                          )}
                        </div>
                        <pre className="text-sm text-foreground whitespace-pre-wrap break-words hover:scale-[1.01] transition-transform duration-200">
                          {error.message}
                        </pre>
                        {error.suggestion && (
                          <div className="mt-3 p-3 bg-muted rounded-md interactive-panel hover:bg-muted/80">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon name="Lightbulb" size={16} className="text-warning animate-glow" />
                              <span className="text-sm font-medium text-foreground">Suggestion</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{error.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Input Tab */}
        {activeTab === 'input' && (
          <div className="h-full p-4 animate-slide-in">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h3 className="font-medium text-foreground mb-2">Program Input</h3>
                <p className="text-sm text-muted-foreground">
                  Send input to your running program. Press Enter or click Send to submit.
                </p>
              </div>
              
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter input for your program..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleInputKeyPress}
                    disabled={!waitingForInput}
                    className={`flex-1 form-control-enhanced transition-all duration-300 ${
                      waitingForInput ? 'border-primary/50 shadow-lg' : ''
                    }`}
                  />
                  <Button
                    onClick={handleSendInput}
                    disabled={!inputValue.trim() || !waitingForInput}
                    iconName="Send"
                    iconPosition="left"
                    className={`btn-interactive ripple-effect transition-all duration-200 ${
                      waitingForInput && inputValue.trim() 
                        ? 'transform hover:scale-105 animate-glow' 
                        : ''
                    }`}
                  >
                    Send
                  </Button>
                </div>
                
                {!waitingForInput && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground interactive-panel rounded-lg p-3 bg-info/5 animate-fade-in">
                    <Icon name="Info" size={16} className="animate-glow" />
                    <span>Run your program to enable input functionality</span>
                  </div>
                )}
                
                <div className="flex-1 bg-muted/30 rounded-lg p-4 overflow-y-auto interactive-panel">
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2 font-medium">Input History:</p>
                    <div className="space-y-1 font-mono text-xs">
                      {/* Mock input history with animations */}
                      <div className="opacity-50 hover:opacity-75 transition-opacity duration-200">$ python script.py</div>
                      <div className="opacity-50 hover:opacity-75 transition-opacity duration-200">&gt; Hello World</div>
                      <div className="opacity-50 hover:opacity-75 transition-opacity duration-200">&gt; 42</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;