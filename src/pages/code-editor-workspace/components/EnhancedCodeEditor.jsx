import React, { useRef, useEffect, useState } from 'react';
        import MonacoEditor from '@monaco-editor/react';
        import { useTheme } from '../../../hooks/useTheme';
        import { formatCode, validateCode } from '../../../utils/formatters';
        import Button from '../../../components/ui/Button';
        import { defineTheme } from '../../../utils/monacoThemes';

        const EnhancedCodeEditor = ({ 
          code, 
          onChange, 
          language, 
          readOnly = false,
          onCursorChange,
          onValidationChange
        }) => {
          const editorRef = useRef(null);
          const { theme } = useTheme();
          const [isFormatting, setIsFormatting] = useState(false);
          const [validationErrors, setValidationErrors] = useState([]);
          const [editorStats, setEditorStats] = useState({
            lines: 1,
            characters: 0,
            words: 0,
            cursor: { line: 1, column: 1 }
          });

          const languageMap = {
            'javascript': 'javascript',
            'typescript': 'typescript',
            'python': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'csharp': 'csharp',
            'go': 'go',
            'rust': 'rust',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'xml': 'xml',
            'sql': 'sql',
            'php': 'php'
          };

          useEffect(() => {
            // Define custom themes for Monaco
            defineTheme();
          }, []);

          const handleEditorDidMount = (editor, monaco) => {
            editorRef.current = editor;

            // Add custom key bindings
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
              handleFormatCode();
            });

            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
              editor.getAction('editor.action.formatDocument').run();
            });

            // Enhanced autocomplete
            monaco.languages.registerCompletionItemProvider(language, {
              provideCompletionItems: (model, position) => {
                const suggestions = getLanguageSpecificSuggestions(language, model, position);
                return { suggestions };
              }
            });

            // Real-time error detection
            editor.onDidChangeModelContent(() => {
              validateCodeRealtime(editor.getValue());
            });

            // Cursor position tracking
            editor.onDidChangeCursorPosition((e) => {
              const { lineNumber, column } = e.position;
              setEditorStats(prev => ({
                ...prev,
                cursor: { line: lineNumber, column }
              }));
              onCursorChange?.({ line: lineNumber, column });
            });

            // Selection change tracking
            editor.onDidChangeCursorSelection(() => {
              updateEditorStats(editor.getValue());
            });
          };

          const validateCodeRealtime = (currentCode) => {
            const validation = validateCode(currentCode, language);
            if (!validation.valid) {
              const errors = [{
                severity: 'error',
                message: validation.error,
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: 1
              }];
              setValidationErrors(errors);
              onValidationChange?.(errors);
            } else {
              setValidationErrors([]);
              onValidationChange?.([]);
            }
          };

          const updateEditorStats = (currentCode) => {
            const lines = currentCode.split('\n').length;
            const characters = currentCode.length;
            const words = currentCode.trim() ? currentCode.trim().split(/\s+/).length : 0;

            setEditorStats(prev => ({
              ...prev,
              lines,
              characters,
              words
            }));
          };

          const getLanguageSpecificSuggestions = (lang, model, position) => {
            const suggestions = [];
            
            switch (lang) {
              case 'javascript':
                suggestions.push(
                  {
                    label: 'console.log',
                    kind: 1,
                    insertText: 'console.log(${1:message});',
                    insertTextRules: 4,
                    documentation: 'Log a message to the console'
                  },
                  {
                    label: 'function',
                    kind: 1,
                    insertText: 'function ${1:name}(${2:params}) {\n\t${3:// body}\n}',
                    insertTextRules: 4,
                    documentation: 'Create a new function'
                  },
                  {
                    label: 'const',
                    kind: 1,
                    insertText: 'const ${1:name} = ${2:value};',
                    insertTextRules: 4,
                    documentation: 'Declare a constant'
                  }
                );
                break;
              
              case 'python':
                suggestions.push(
                  {
                    label: 'print',
                    kind: 1,
                    insertText: 'print(${1:message})',
                    insertTextRules: 4,
                    documentation: 'Print a message'
                  },
                  {
                    label: 'def',
                    kind: 1,
                    insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
                    insertTextRules: 4,
                    documentation: 'Define a function'
                  },
                  {
                    label: 'class',
                    kind: 1,
                    insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, params}):\n\t\t${3:pass}',
                    insertTextRules: 4,
                    documentation: 'Define a class'
                  }
                );
                break;

              case 'java':
                suggestions.push(
                  {
                    label: 'System.out.println',
                    kind: 1,
                    insertText: 'System.out.println(${1:message});',
                    insertTextRules: 4,
                    documentation: 'Print a line to console'
                  },
                  {
                    label: 'public class',
                    kind: 1,
                    insertText: 'public class ${1:ClassName} {\n\t${2:// body}\n}',
                    insertTextRules: 4,
                    documentation: 'Create a public class'
                  }
                );
                break;
            }

            return suggestions;
          };

          const handleFormatCode = async () => {
            if (!editorRef.current || isFormatting) return;

            setIsFormatting(true);
            try {
              const currentCode = editorRef.current.getValue();
              const formatted = await formatCode(currentCode, language);
              
              editorRef.current.setValue(formatted);
              onChange(formatted);
            } catch (error) {
              console.error('Formatting failed:', error);
              // Show error notification or toast
            } finally {
              setIsFormatting(false);
            }
          };

          const editorOptions = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: readOnly,
            cursorStyle: 'line',
            automaticLayout: true,
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
            lineHeight: 1.6,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            renderLineHighlight: 'all',
            contextmenu: true,
            mouseWheelZoom: true,
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            wordBasedSuggestions: 'allDocuments',
            parameterHints: { enabled: true },
            autoIndent: 'full',
            formatOnType: true,
            formatOnPaste: true,
            dragAndDrop: true,
            links: true,
            colorDecorators: true,
            lightbulb: { enabled: 'on' },
            codeActionsOnSave: { source: { organizeImports: true } },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'always',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderWhitespace: 'selection',
            renderControlCharacters: false,
            glyphMargin: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3
          };

          useEffect(() => {
            updateEditorStats(code);
          }, [code]);

          return (
            <div className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden">
              {/* Enhanced Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {language}
                  </span>
                  {validationErrors.length > 0 && (
                    <div className="flex items-center space-x-1 text-error">
                      <span className="w-2 h-2 bg-error rounded-full"></span>
                      <span className="text-xs">{validationErrors.length} error(s)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFormatCode}
                    loading={isFormatting}
                    iconName="Code"
                    className="text-xs"
                  >
                    Format
                  </Button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language={languageMap[language] || 'plaintext'}
                  value={code}
                  onChange={onChange}
                  onMount={handleEditorDidMount}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                  options={editorOptions}
                  loading={
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Loading editor...</p>
                      </div>
                    </div>
                  }
                />
              </div>

              {/* Enhanced Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="capitalize">{language}</span>
                  <span>UTF-8</span>
                  <span>LF</span>
                  {validationErrors.length === 0 && (
                    <span className="text-success">✓ No issues</span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span>Ln {editorStats.cursor.line}, Col {editorStats.cursor.column}</span>
                  <span>{editorStats.characters} chars</span>
                  <span>{editorStats.words} words</span>
                  <span>{editorStats.lines} lines</span>
                </div>
              </div>
            </div>
          );
        };

        export default EnhancedCodeEditor;