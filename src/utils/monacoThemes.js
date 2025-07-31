import * as monaco from 'monaco-editor';

        export const defineTheme = () => {
          // Define custom dark theme
          monaco.editor.defineTheme('coderunner-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: '569CD6' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'regexp', foreground: 'D16969' },
              { token: 'type', foreground: '4EC9B0' },
              { token: 'class', foreground: '4EC9B0' },
              { token: 'function', foreground: 'DCDCAA' },
              { token: 'variable', foreground: '9CDCFE' },
              { token: 'constant', foreground: '4FC1FF' },
            ],
            colors: {
              'editor.background': '#0D1117',
              'editor.foreground': '#F0F6FC',
              'editor.lineHighlightBackground': '#161B22',
              'editor.selectionBackground': '#264F78',
              'editor.inactiveSelectionBackground': '#264F7840',
              'editorCursor.foreground': '#F0F6FC',
              'editorWhitespace.foreground': '#484F58',
              'editorLineNumber.foreground': '#6E7681',
              'editorLineNumber.activeForeground': '#F0F6FC',
              'editor.selectionHighlightBackground': '#264F7840',
              'editor.wordHighlightBackground': '#264F7840',
              'editor.wordHighlightStrongBackground': '#264F7860',
              'editorBracketMatch.background': '#264F7840',
              'editorBracketMatch.border': '#888888',
            }
          });

          // Define custom light theme
          monaco.editor.defineTheme('coderunner-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '008000' },
              { token: 'keyword', foreground: '0000FF' },
              { token: 'string', foreground: 'A31515' },
              { token: 'number', foreground: '098658' },
              { token: 'regexp', foreground: '811F3F' },
              { token: 'type', foreground: '267F99' },
              { token: 'class', foreground: '267F99' },
              { token: 'function', foreground: '795E26' },
              { token: 'variable', foreground: '001080' },
              { token: 'constant', foreground: '0070C1' },
            ],
            colors: {
              'editor.background': '#FFFFFF',
              'editor.foreground': '#24292F',
              'editor.lineHighlightBackground': '#F6F8FA',
              'editor.selectionBackground': '#0969DA26',
              'editor.inactiveSelectionBackground': '#0969DA1A',
              'editorCursor.foreground': '#24292F',
              'editorWhitespace.foreground': '#D0D7DE',
              'editorLineNumber.foreground': '#656D76',
              'editorLineNumber.activeForeground': '#24292F',
              'editor.selectionHighlightBackground': '#0969DA1A',
              'editor.wordHighlightBackground': '#0969DA1A',
              'editor.wordHighlightStrongBackground': '#0969DA26',
              'editorBracketMatch.background': '#0969DA1A',
              'editorBracketMatch.border': '#888888',
            }
          });
        };