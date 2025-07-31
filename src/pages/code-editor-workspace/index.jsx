import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EnhancedEditorToolbar from './components/EnhancedEditorToolbar';
import EnhancedCodeEditor from './components/EnhancedCodeEditor';
import OutputPanel from './components/OutputPanel';
import EnhancedKeyboardShortcuts from './components/EnhancedKeyboardShortcuts';
import Button from '../../components/ui/Button';
import { useAutosave } from '../../hooks/useAutosave';
import { codeExecutor } from '../../utils/codeExecutor';
import { formatCode } from '../../utils/formatters';
import LZString from 'lz-string';

const CodeEditorWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Editor state
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [filename, setFilename] = useState('untitled');
  
  // Output state
  const [output, setOutput] = useState([]);
  const [errors, setErrors] = useState([]);
  const [executionStats, setExecutionStats] = useState(null);
  
  // UI state
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [panelLayout, setPanelLayout] = useState('horizontal'); // horizontal, vertical
  const [leftPanelWidth, setLeftPanelWidth] = useState(60); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isAutosaveEnabled, setIsAutosaveEnabled] = useState(true);
  const [executionQueue, setExecutionQueue] = useState(0);
  const [validationErrors, setValidationErrors] = useState([]);

  // Autosave hook
  const { loadAutosave, clearAutosave } = useAutosave(
    code, 
    selectedLanguage, 
    filename, 
    isAutosaveEnabled ? 2000 : 0
  );

  // Initialize from route state or autosave
  useEffect(() => {
    if (location.state?.language) {
      setSelectedLanguage(location.state.language);
    }
    
    if (location.state?.codeItem) {
      const item = location.state.codeItem;
      setCode(item.code);
      setSelectedLanguage(item.language);
      setFilename(item.filename);
      clearAutosave();
    } else {
      // Try to load autosave
      const autosaved = loadAutosave();
      if (autosaved && !code) {
        const shouldRestore = window.confirm(
          `Found unsaved work from ${new Date(autosaved.timestamp).toLocaleString()}. Would you like to restore it?`
        );
        if (shouldRestore) {
          setCode(autosaved.code);
          setSelectedLanguage(autosaved.language);
          setFilename(autosaved.filename);
          setHasUnsavedChanges(true);
        }
      }
    }
  }, [location.state]);

  // Enhanced code execution
  const handleRunCode = useCallback(async () => {
    if (!code.trim()) {
      setErrors([{
        type: 'Error',
        message: 'No code to execute. Please write some code first.',
        suggestion: 'Write your code in the editor and try again.'
      }]);
      return;
    }

    setIsRunning(true);
    setOutput([]);
    setErrors([]);
    setExecutionQueue(codeExecutor.getQueueLength());

    try {
      const result = await codeExecutor.executeCode(code, selectedLanguage);
      
      setOutput(result.output || []);
      setErrors(result.errors || []);
      setExecutionStats({
        executionTime: result.executionTime,
        memoryUsage: result.memoryUsage,
        fromCache: result.fromCache
      });

      if (result.waitingForInput) {
        setWaitingForInput(true);
        setTimeout(() => setWaitingForInput(false), 5000);
      }
    } catch (error) {
      setErrors([{
        type: 'ExecutionError',
        message: error.message,
        suggestion: 'Check your code syntax and try again.'
      }]);
    } finally {
      setIsRunning(false);
      setExecutionQueue(0);
    }
  }, [code, selectedLanguage]);

  const handleCancelExecution = () => {
    codeExecutor.cancelExecution();
    setIsRunning(false);
    setExecutionQueue(0);
    setOutput(prev => [...prev, {
      content: 'Execution cancelled by user',
      type: 'warning',
      timestamp: Date.now()
    }]);
  };

  // Event handlers
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setHasUnsavedChanges(true);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setHasUnsavedChanges(true);
  };

  const handleNewFile = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to create a new file?');
      if (!confirmed) return;
    }
    setCode('');
    setOutput([]);
    setErrors([]);
    setHasUnsavedChanges(false);
    setFilename('untitled');
    clearAutosave();
  };

  const handleSaveFile = () => {
    // Enhanced save functionality
    const saveData = {
      code,
      language: selectedLanguage,
      filename,
      timestamp: Date.now()
    };

    try {
      // Simulate save to server/local storage
      const compressed = LZString.compress(JSON.stringify(saveData));
      localStorage.setItem(`coderunner-saved-${filename}`, compressed);
      setHasUnsavedChanges(false);
      clearAutosave();
      
      // Show success message
      setOutput(prev => [...prev, {
        content: `File saved successfully as ${filename}.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage}`,
        type: 'info',
        timestamp: Date.now()
      }]);
    } catch (error) {
      setErrors(prev => [...prev, {
        type: 'SaveError',
        message: 'Failed to save file: ' + error.message,
        suggestion: 'Try saving with a different filename or check your storage space.'
      }]);
    }
  };

  const handleShareCode = () => {
    const shareData = {
      code,
      language: selectedLanguage,
      filename,
      timestamp: Date.now()
    };

    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}/shared/${compressed}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('Code shared:', shareUrl);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const handleFormatCode = async () => {
    try {
      const formatted = await formatCode(code, selectedLanguage);
      setCode(formatted);
      setHasUnsavedChanges(true);
      setOutput(prev => [...prev, {
        content: 'Code formatted successfully',
        type: 'info',
        timestamp: Date.now()
      }]);
    } catch (error) {
      setErrors(prev => [...prev, {
        type: 'FormatError',
        message: error.message,
        suggestion: 'Check your code syntax before formatting.'
      }]);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
    setErrors([]);
    setExecutionStats(null);
  };

  const handleSendInput = (input) => {
    setOutput(prev => [...prev, {
      content: `> ${input}`,
      type: 'input',
      timestamp: Date.now()
    }]);
    setWaitingForInput(false);
  };

  const handleValidationChange = (errors) => {
    setValidationErrors(errors);
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Run code: Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      
      // Cancel execution: Ctrl/Cmd + Shift + C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        handleCancelExecution();
      }
      
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
      
      // New file: Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewFile();
      }
      
      // Format: Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handleFormatCode();
      }
      
      // Show shortcuts: ?
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      // Toggle layout: Ctrl/Cmd + \
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setPanelLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
      }

      // Toggle autosave: Ctrl/Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAutosaveEnabled(prev => !prev);
      }

      // Quick run: F5
      if (e.key === 'F5') {
        e.preventDefault();
        handleRunCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedLanguage, hasUnsavedChanges, isRunning]);

  // Panel resizing with enhanced visual feedback
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
    // Add visual feedback class
    document.body.classList.add('cursor-col-resize');
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const container = document.getElementById('editor-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      
      if (panelLayout === 'horizontal') {
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftPanelWidth(Math.min(Math.max(newWidth, 30), 80));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Remove visual feedback class
      document.body.classList.remove('cursor-col-resize');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, panelLayout]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[60px] h-screen flex flex-col">
        {/* Enhanced Toolbar */}
        <EnhancedEditorToolbar
          onRunCode={handleRunCode}
          onNewFile={handleNewFile}
          onSaveFile={handleSaveFile}
          onShareCode={handleShareCode}
          onFormatCode={handleFormatCode}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          isRunning={isRunning}
          hasUnsavedChanges={hasUnsavedChanges}
          isAutosaveEnabled={isAutosaveEnabled}
          onToggleAutosave={() => setIsAutosaveEnabled(prev => !prev)}
          executionQueue={executionQueue}
          onCancelExecution={handleCancelExecution}
          onToggleLayout={() => setPanelLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
        />

        {/* Enhanced Main Editor Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div 
            id="editor-container"
            className={`flex-1 flex ${panelLayout === 'vertical' ? 'flex-col' : 'flex-row'} overflow-hidden interactive-panel`}
          >
            {/* Enhanced Code Editor Panel */}
            <div 
              className={`${
                panelLayout === 'horizontal' 
                  ? `w-[${leftPanelWidth}%]` 
                  : 'h-3/5'
              } flex flex-col p-4 pr-2 animate-slide-in`}
              style={{
                width: panelLayout === 'horizontal' ? `${leftPanelWidth}%` : '100%',
                height: panelLayout === 'vertical' ? '60%' : '100%'
              }}
            >
              <div className="flex items-center justify-between mb-4 interactive-panel rounded-lg p-3 bg-muted/20">
                <h2 className="text-lg font-semibold text-foreground animate-glow">
                  {filename}.{selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage}
                </h2>
                <div className="flex items-center space-x-2">
                  {isAutosaveEnabled && (
                    <div className="flex items-center space-x-1 text-xs text-success interactive-panel rounded-full px-2 py-1 bg-success/10 animate-fade-in">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse pulse-glow"></div>
                      <span className="font-medium">Autosave</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPanelLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                    iconName={panelLayout === 'horizontal' ? 'SplitSquareVertical' : 'SplitSquareHorizontal'}
                    className="btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 hover:rotate-12 transition-all duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShortcuts(true)}
                    iconName="Keyboard"
                    className="btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex-1 monaco-editor-container">
                <EnhancedCodeEditor
                  code={code}
                  onChange={handleCodeChange}
                  language={selectedLanguage}
                  onCursorChange={(pos) => console.log('Cursor:', pos)}
                  onValidationChange={handleValidationChange}
                />
              </div>
            </div>

            {/* Enhanced Resizer */}
            {panelLayout === 'horizontal' && (
              <div
                className={`w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-all duration-300 group ${
                  isResizing ? 'bg-primary w-2 shadow-lg shadow-primary/30' : ''
                }`}
                onMouseDown={handleMouseDown}
              >
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/20 to-primary/40 transition-opacity duration-300"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>
            )}

            {/* Enhanced Output Panel */}
            <div 
              className={`${
                panelLayout === 'horizontal' 
                  ? `w-[${100 - leftPanelWidth}%]` 
                  : 'h-2/5'
              } flex flex-col p-4 pl-2 animate-slide-in`}
              style={{
                width: panelLayout === 'horizontal' ? `${100 - leftPanelWidth}%` : '100%',
                height: panelLayout === 'vertical' ? '40%' : '100%',
                animationDelay: '0.2s'
              }}
            >
              <div className="flex items-center justify-between mb-4 interactive-panel rounded-lg p-3 bg-muted/20">
                <h2 className="text-lg font-semibold text-foreground">Output</h2>
                <div className="flex items-center space-x-2">
                  {isRunning && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground interactive-panel rounded-full px-3 py-1 bg-primary/10">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse pulse-glow"></div>
                      <span className="font-medium">Executing...</span>
                    </div>
                  )}
                  {executionStats && (
                    <div className="text-xs text-muted-foreground interactive-panel rounded px-2 py-1 bg-success/10 animate-scale-in">
                      <span className="font-mono">{executionStats.executionTime}ms</span>
                      {executionStats.fromCache && <span className="text-warning"> (cached)</span>}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <OutputPanel
                  output={output}
                  errors={errors}
                  isRunning={isRunning}
                  onClearOutput={handleClearOutput}
                  onSendInput={handleSendInput}
                  waitingForInput={waitingForInput}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile-specific controls */}
        <div className="lg:hidden border-t border-border p-4 bg-card interactive-panel">
          <div className="flex items-center justify-between animate-slide-in">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPanelLayout(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                iconName={panelLayout === 'horizontal' ? 'SplitSquareVertical' : 'SplitSquareHorizontal'}
                className="btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200"
              >
                Layout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShortcuts(true)}
                iconName="Keyboard"
                className="btn-interactive ripple-effect hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200"
              >
                Shortcuts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormatCode}
                iconName="Code"
                className="btn-interactive ripple-effect hover:bg-info/10 hover:text-info transform hover:scale-105 transition-all duration-200"
              >
                Format
              </Button>
            </div>
            
            <Button
              variant="default"
              onClick={handleRunCode}
              loading={isRunning}
              iconName="Play"
              iconPosition="left"
              className={`btn-interactive ripple-effect transform transition-all duration-200 ${
                isRunning 
                  ? 'animate-pulse scale-105' :'hover:scale-105 hover:shadow-lg hover:shadow-primary/25'
              } gradient-border`}
            >
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Keyboard Shortcuts Modal */}
      <EnhancedKeyboardShortcuts
        isVisible={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

export default CodeEditorWorkspace;