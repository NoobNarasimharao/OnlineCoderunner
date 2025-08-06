import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';

        const ThemeContext = createContext();

        export const ThemeProvider = ({ children }) => {
          const [theme, setTheme] = useState(() => {
            const savedTheme = localStorage.getItem('coderunner-theme');
            return savedTheme || 'light';
          });

          useEffect(() => {
            localStorage.setItem('coderunner-theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
          }, [theme]);

          const toggleTheme = () => {
            setTheme(prev => prev === 'light' ? 'dark' : 'light');
          };

          return (
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
              {children}
            </ThemeContext.Provider>
          );
        };

        export const useTheme = () => {
          const context = useContext(ThemeContext);
          if (!context) {
            throw new Error('useTheme must be used within a ThemeProvider');
          }
          return context;
        };