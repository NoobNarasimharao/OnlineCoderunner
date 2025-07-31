import { useEffect, useRef } from 'react';
        import LZString from 'lz-string';

        export const useAutosave = (code, language, filename = 'untitled', delay = 2000) => {
          const timeoutRef = useRef(null);
          const lastSavedRef = useRef('');

          useEffect(() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Only save if code has actually changed
            if (code !== lastSavedRef.current && code.trim()) {
              timeoutRef.current = setTimeout(() => {
                try {
                  const saveData = {
                    code,
                    language,
                    filename,
                    timestamp: Date.now(),
                    compressed: true
                  };

                  // Compress the code to save space
                  const compressedCode = LZString.compress(code);
                  const compressedData = { ...saveData, code: compressedCode };

                  localStorage.setItem('coderunner-autosave', JSON.stringify(compressedData));
                  lastSavedRef.current = code;
                } catch (error) {
                  console.warn('Autosave failed:', error);
                  // Fallback: try without compression
                  try {
                    const fallbackData = {
                      code,
                      language,
                      filename,
                      timestamp: Date.now(),
                      compressed: false
                    };
                    localStorage.setItem('coderunner-autosave', JSON.stringify(fallbackData));
                    lastSavedRef.current = code;
                  } catch (fallbackError) {
                    console.error('Autosave failed completely:', fallbackError);
                  }
                }
              }, delay);
            }

            return () => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            };
          }, [code, language, filename, delay]);

          const loadAutosave = () => {
            try {
              const saved = localStorage.getItem('coderunner-autosave');
              if (saved) {
                const data = JSON.parse(saved);
                if (data.compressed) {
                  data.code = LZString.decompress(data.code);
                }
                return data;
              }
            } catch (error) {
              console.error('Failed to load autosave:', error);
            }
            return null;
          };

          const clearAutosave = () => {
            localStorage.removeItem('coderunner-autosave');
            lastSavedRef.current = '';
          };

          return { loadAutosave, clearAutosave };
        };