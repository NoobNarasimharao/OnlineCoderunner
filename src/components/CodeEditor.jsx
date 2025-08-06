import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language, theme, fontSize, tabSize }) => {
  const handleEditorChange = (value) => {
    onChange(value || '');
  };

  const getMonacoTheme = () => {
    return theme === 'dark' ? 'vs-dark' : 'light';
  };

  const getLanguageId = (lang) => {
    const languageMap = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      csharp: 'csharp',
      php: 'php',
      ruby: 'ruby',
      go: 'go',
      rust: 'rust',
      swift: 'swift',
      kotlin: 'kotlin'
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={getLanguageId(language)}
        theme={getMonacoTheme()}
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: fontSize,
          tabSize: tabSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          glyphMargin: true,
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          contextmenu: true,
          mouseWheelZoom: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          wordBasedSuggestions: true,
          parameterHints: {
            enabled: true,
          },
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
        }}
        beforeMount={(monaco) => {
          // Customize editor appearance
          monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: 'C586C0' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
            ],
            colors: {
              'editor.background': '#1e1e1e',
              'editor.foreground': '#d4d4d4',
              'editor.lineHighlightBackground': '#2a2a2a',
              'editor.selectionBackground': '#264f78',
              'editor.inactiveSelectionBackground': '#3a3d41',
            }
          });

          monaco.editor.defineTheme('custom-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '008000' },
              { token: 'keyword', foreground: '0000ff' },
              { token: 'string', foreground: 'a31515' },
              { token: 'number', foreground: '098658' },
            ],
            colors: {
              'editor.background': '#ffffff',
              'editor.foreground': '#000000',
              'editor.lineHighlightBackground': '#f0f0f0',
              'editor.selectionBackground': '#add6ff',
              'editor.inactiveSelectionBackground': '#e5ebf1',
            }
          });
        }}
        onMount={(editor, monaco) => {
          // Apply custom theme
          const customTheme = theme === 'dark' ? 'custom-dark' : 'custom-light';
          monaco.editor.setTheme(customTheme);

          // Add some custom keybindings
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Save functionality could be added here
            console.log('Save triggered');
          });

          // Focus the editor
          editor.focus();
        }}
      />
    </div>
  );
};

export default CodeEditor; 