import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const KeyboardShortcuts = ({ isVisible, onClose }) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const shortcuts = [
    {
      category: 'Code Execution',
      items: [
        { keys: ['Ctrl', 'Enter'], mac: ['Cmd', 'Enter'], description: 'Run code' },
        { keys: ['Ctrl', 'Shift', 'Enter'], mac: ['Cmd', 'Shift', 'Enter'], description: 'Run with input' },
        { keys: ['Ctrl', '.'], mac: ['Cmd', '.'], description: 'Stop execution' }
      ]
    },
    {
      category: 'File Operations',
      items: [
        { keys: ['Ctrl', 'N'], mac: ['Cmd', 'N'], description: 'New file' },
        { keys: ['Ctrl', 'S'], mac: ['Cmd', 'S'], description: 'Save file' },
        { keys: ['Ctrl', 'Shift', 'S'], mac: ['Cmd', 'Shift', 'S'], description: 'Save as' },
        { keys: ['Ctrl', 'O'], mac: ['Cmd', 'O'], description: 'Open file' }
      ]
    },
    {
      category: 'Editor',
      items: [
        { keys: ['Ctrl', 'Z'], mac: ['Cmd', 'Z'], description: 'Undo' },
        { keys: ['Ctrl', 'Y'], mac: ['Cmd', 'Shift', 'Z'], description: 'Redo' },
        { keys: ['Ctrl', 'F'], mac: ['Cmd', 'F'], description: 'Find' },
        { keys: ['Ctrl', 'H'], mac: ['Cmd', 'Option', 'F'], description: 'Replace' },
        { keys: ['Ctrl', 'A'], mac: ['Cmd', 'A'], description: 'Select all' },
        { keys: ['Ctrl', '/'], mac: ['Cmd', '/'], description: 'Toggle comment' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', 'G'], mac: ['Cmd', 'G'], description: 'Go to line' },
        { keys: ['Ctrl', 'L'], mac: ['Cmd', 'L'], description: 'Select line' },
        { keys: ['Alt', '↑'], mac: ['Option', '↑'], description: 'Move line up' },
        { keys: ['Alt', '↓'], mac: ['Option', '↓'], description: 'Move line down' }
      ]
    },
    {
      category: 'Interface',
      items: [
        { keys: ['F11'], mac: ['F11'], description: 'Toggle fullscreen' },
        { keys: ['Ctrl', '`'], mac: ['Cmd', '`'], description: 'Toggle output panel' },
        { keys: ['Ctrl', 'Shift', 'P'], mac: ['Cmd', 'Shift', 'P'], description: 'Command palette' },
        { keys: ['?'], mac: ['?'], description: 'Show shortcuts' }
      ]
    }
  ];

  const formatKeys = (keys, macKeys) => {
    const keysToUse = isMac && macKeys ? macKeys : keys;
    return keysToUse.map(key => {
      // Replace common key names with symbols on Mac
      if (isMac) {
        const macSymbols = {
          'Cmd': '⌘',
          'Option': '⌥',
          'Shift': '⇧',
          'Ctrl': '⌃',
          'Enter': '↵',
          '↑': '↑',
          '↓': '↓'
        };
        return macSymbols[key] || key;
      }
      return key;
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-soft-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Boost your productivity with these keyboard shortcuts
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="font-medium text-card-foreground text-lg border-b border-border pb-2">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-card-foreground">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {formatKeys(shortcut.keys, shortcut.mac).map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && (
                              <span className="text-muted-foreground text-xs">+</span>
                            )}
                            <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono text-muted-foreground">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>
                Press <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">?</kbd> anytime to show this dialog
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;