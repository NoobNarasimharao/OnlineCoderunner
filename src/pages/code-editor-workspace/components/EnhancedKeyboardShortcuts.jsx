import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EnhancedKeyboardShortcuts = ({ isVisible, onClose }) => {
  const shortcuts = [
    {
      category: "Execution",
      items: [
        { keys: ["Ctrl", "Enter"], mac: ["Cmd", "Enter"], description: "Run code" },
        { keys: ["Ctrl", "Shift", "C"], mac: ["Cmd", "Shift", "C"], description: "Cancel execution" },
        { keys: ["F5"], description: "Quick run" }
      ]
    },
    {
      category: "File Operations",
      items: [
        { keys: ["Ctrl", "S"], mac: ["Cmd", "S"], description: "Save file" },
        { keys: ["Ctrl", "N"], mac: ["Cmd", "N"], description: "New file" },
        { keys: ["Ctrl", "O"], mac: ["Cmd", "O"], description: "Open file" },
        { keys: ["Ctrl", "Shift", "S"], mac: ["Cmd", "Shift", "S"], description: "Save as" }
      ]
    },
    {
      category: "Code Editing",
      items: [
        { keys: ["Ctrl", "K"], mac: ["Cmd", "K"], description: "Format code" },
        { keys: ["Ctrl", "Shift", "F"], mac: ["Cmd", "Shift", "F"], description: "Format document" },
        { keys: ["Ctrl", "Z"], mac: ["Cmd", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Y"], mac: ["Cmd", "Y"], description: "Redo" },
        { keys: ["Ctrl", "D"], mac: ["Cmd", "D"], description: "Duplicate line" },
        { keys: ["Ctrl", "/"], mac: ["Cmd", "/"], description: "Toggle comment" },
        { keys: ["Alt", "↑"], mac: ["Alt", "↑"], description: "Move line up" },
        { keys: ["Alt", "↓"], mac: ["Alt", "↓"], description: "Move line down" }
      ]
    },
    {
      category: "Navigation",
      items: [
        { keys: ["Ctrl", "G"], mac: ["Cmd", "G"], description: "Go to line" },
        { keys: ["Ctrl", "F"], mac: ["Cmd", "F"], description: "Find" },
        { keys: ["Ctrl", "H"], mac: ["Cmd", "H"], description: "Replace" },
        { keys: ["F3"], description: "Find next" },
        { keys: ["Shift", "F3"], description: "Find previous" }
      ]
    },
    {
      category: "Editor Features",
      items: [
        { keys: ["Ctrl", "Space"], mac: ["Cmd", "Space"], description: "Trigger autocomplete" },
        { keys: ["Ctrl", "Shift", "P"], mac: ["Cmd", "Shift", "P"], description: "Command palette" },
        { keys: ["Ctrl", "\\"], mac: ["Cmd", "\\"], description: "Toggle layout" },
        { keys: ["F11"], description: "Toggle fullscreen" },
        { keys: ["Ctrl", "B"], mac: ["Cmd", "B"], description: "Toggle sidebar" }
      ]
    },
    {
      category: "View & Theme",
      items: [
        { keys: ["Ctrl", "Shift", "T"], mac: ["Cmd", "Shift", "T"], description: "Toggle theme" },
        { keys: ["Ctrl", "+"], mac: ["Cmd", "+"], description: "Zoom in" },
        { keys: ["Ctrl", "-"], mac: ["Cmd", "-"], description: "Zoom out" },
        { keys: ["Ctrl", "0"], mac: ["Cmd", "0"], description: "Reset zoom" }
      ]
    },
    {
      category: "Help",
      items: [
        { keys: ["?"], description: "Show shortcuts" },
        { keys: ["F1"], description: "Help" },
        { keys: ["Escape"], description: "Close dialogs" }
      ]
    }
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const renderKey = (key) => {
    const keyMap = {
      'Ctrl': isMac ? '⌘' : 'Ctrl',
      'Cmd': '⌘',
      'Alt': isMac ? '⌥' : 'Alt',
      'Shift': isMac ? '⇧' : 'Shift',
      'Enter': '↵',
      'Tab': '⇥',
      'Space': '␣',
      '↑': '↑',
      '↓': '↓',
      '←': '←',
      '→': '→'
    };

    return keyMap[key] || key;
  };

  const getKeysForPlatform = (item) => {
    if (isMac && item.mac) {
      return item.mac;
    }
    return item.keys;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Keyboard" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
              <p className="text-sm text-muted-foreground">
                Master these shortcuts to code faster
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg border-b border-border pb-2">
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex-1">
                        {item.description}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getKeysForPlatform(item).map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                              {renderKey(key)}
                            </kbd>
                            {keyIndex < getKeysForPlatform(item).length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Platform: {isMac ? 'macOS' : 'Windows/Linux'}</span>
              <span>•</span>
              <span>Press ? to toggle this dialog</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} />
              <span>Some shortcuts may vary based on your browser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedKeyboardShortcuts;