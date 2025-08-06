import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

const LanguageSelector = ({ languages, selectedLanguage, onLanguageChange, theme, availableLanguages = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLang = languages.find(lang => lang.id === selectedLanguage);
  const isSelectedAvailable = availableLanguages[selectedLanguage] !== false;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        } ${isOpen ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} ${
          !isSelectedAvailable ? 'opacity-60' : ''
        }`}
      >
        <span className="text-lg">{selectedLang?.icon}</span>
        <span className="font-medium">{selectedLang?.name}</span>
        {!isSelectedAvailable && (
          <AlertCircle className="w-4 h-4 text-yellow-500" title="Language not installed" />
        )}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-64 rounded-lg border shadow-lg z-50 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              Select Language
            </div>
            <div className="max-h-64 overflow-y-auto">
              {languages.map((language) => {
                const isAvailable = availableLanguages[language.id] !== false;
                return (
                  <button
                    key={language.id}
                    onClick={() => {
                      if (isAvailable) {
                        onLanguageChange(language.id);
                        setIsOpen(false);
                      }
                    }}
                    disabled={!isAvailable}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-150 ${
                      language.id === selectedLanguage
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                        : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-lg">{language.icon}</span>
                    <span className="flex-1 font-medium">{language.name}</span>
                    {!isAvailable && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" title="Not installed" />
                    )}
                    {language.id === selectedLanguage && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
            {Object.keys(availableLanguages).length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs text-gray-500 px-2">
                  💡 Languages with ⚠️ are not installed on the server
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 