import React, { useRef, useEffect, useState } from 'react';


const CodeEditor = ({ 
  code, 
  onChange, 
  language, 
  readOnly = false,
  onCursorChange 
}) => {
  const editorRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Language-specific starter code templates
  const getStarterCode = (lang) => {
    const templates = {
      javascript: `// Welcome to CodeRunner Online!\n// Write your JavaScript code here\n\nconsole.log("Hello, World!");`,
      python: `# Welcome to CodeRunner Online!\n# Write your Python code here\n\nprint("Hello, World!")`,
      java: `// Welcome to CodeRunner Online!\n// Write your Java code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      cpp: `// Welcome to CodeRunner Online!\n// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
      c: `// Welcome to CodeRunner Online!\n// Write your C code here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
      csharp: `// Welcome to CodeRunner Online!\n// Write your C# code here\n\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
      go: `// Welcome to CodeRunner Online!\n// Write your Go code here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
      rust: `// Welcome to CodeRunner Online!\n// Write your Rust code here\n\nfn main() {\n    println!("Hello, World!");\n}`,
      typescript: `// Welcome to CodeRunner Online!\n// Write your TypeScript code here\n\nconsole.log("Hello, World!");`,
      php: `<?php\n// Welcome to CodeRunner Online!\n// Write your PHP code here\n\necho "Hello, World!";\n?>`
    };
    return templates[lang] || `// Welcome to CodeRunner Online!\n// Write your ${lang} code here\n\nconsole.log("Hello, World!");`;
  };

  useEffect(() => {
    if (!code && language) {
      onChange(getStarterCode(language));
    }
  }, [language]);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    onChange(value);
    
    // Calculate cursor position
    const textarea = e.target;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    setCursorPosition({ line, column });
    onCursorChange && onCursorChange({ line, column });
  };

  const handleKeyDown = (e) => {
    const textarea = e.target;
    
    // Tab key handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineText = value.substring(lineStart, start);
        if (lineText.startsWith('    ')) {
          const newValue = value.substring(0, lineStart) + lineText.substring(4) + value.substring(start);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 4;
          }, 0);
        } else if (lineText.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + lineText.substring(2) + value.substring(start);
          onChange(newValue);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 2;
          }, 0);
        }
      } else {
        // Tab: Add indentation
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    }
    
    // Auto-indentation on Enter
    if (e.key === 'Enter') {
      const start = textarea.selectionStart;
      const value = textarea.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indent = currentLine.match(/^\s*/)[0];
      
      // Add extra indent for opening braces
      const extraIndent = currentLine.trim().endsWith('{') ? '    ' : '';
      
      setTimeout(() => {
        const newValue = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(start);
        onChange(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
        }, 0);
      }, 0);
    }
  };

  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Line Numbers */}
      <div className="bg-muted border-r border-border px-3 py-4 text-right select-none">
        <div className="font-mono text-sm text-muted-foreground leading-6">
          {lineNumbers.map(num => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={code}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm text-foreground leading-6 placeholder:text-muted-foreground"
          placeholder={`Start coding in ${language}...`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        
        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-muted/50 border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="capitalize">{language}</span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>{code.length} chars</span>
            <span>{lineCount} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;