import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTier, setUserTier] = useState('free');
  
  const languageDropdownRef = useRef(null);
  const accountDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'Code' },
    { id: 'python', name: 'Python', icon: 'Code' },
    { id: 'java', name: 'Java', icon: 'Code' },
    { id: 'cpp', name: 'C++', icon: 'Code' },
    { id: 'csharp', name: 'C#', icon: 'Code' },
    { id: 'go', name: 'Go', icon: 'Code' },
    { id: 'rust', name: 'Rust', icon: 'Code' },
    { id: 'typescript', name: 'TypeScript', icon: 'Code' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLanguageSelect = (languageId) => {
    if (location.pathname === '/code-editor-workspace') {
      // Switch language in current editor
      console.log('Switching to language:', languageId);
    } else {
      // Navigate to editor with selected language
      navigate('/code-editor-workspace', { state: { language: languageId } });
    }
    setIsLanguageDropdownOpen(false);
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setUserTier('free');
    } else {
      navigate('/user-authentication');
    }
    setIsAccountDropdownOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-[60px]">
      <div className="flex items-center justify-between h-full px-5">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => handleNavigation('/language-selection-hub')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Code" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">CodeRunner</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative" ref={languageDropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              iconName="ChevronDown"
              iconPosition="right"
              className="text-sm font-medium"
            >
              Languages
            </Button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-56 bg-popover border border-border rounded-lg shadow-soft-lg z-10">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Popular Languages
                  </div>
                  {languages.map((language) => (
                    <button
                      key={language.id}
                      onClick={() => handleLanguageSelect(language.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name={language.icon} size={16} />
                      <span>{language.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={() => handleNavigation('/language-selection-hub')}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name="Grid3X3" size={16} />
                      <span>View All Languages</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* My Code */}
          <Button
            variant={isActivePath('/code-history-dashboard') ? 'secondary' : 'ghost'}
            onClick={() => handleNavigation('/code-history-dashboard')}
            iconName="History"
            iconPosition="left"
            className="text-sm font-medium"
          >
            My Code
          </Button>

          {/* Code Editor */}
          <Button
            variant={isActivePath('/code-editor-workspace') ? 'secondary' : 'ghost'}
            onClick={() => handleNavigation('/code-editor-workspace')}
            iconName="Code2"
            iconPosition="left"
            className="text-sm font-medium"
          >
            Editor
          </Button>
        </nav>

        {/* Account Menu */}
        <div className="flex items-center space-x-4">
          {/* Desktop Account Dropdown */}
          <div className="hidden md:block relative" ref={accountDropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
              iconName="User"
              iconPosition="left"
              className="text-sm font-medium"
            >
              {isAuthenticated ? 'Account' : 'Sign In'}
            </Button>
            
            {isAccountDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 w-64 bg-popover border border-border rounded-lg shadow-soft-lg z-10">
                <div className="p-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 border-b border-border">
                        <div className="text-sm font-medium text-popover-foreground">Welcome back!</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Current plan: <span className="capitalize font-medium text-primary">{userTier}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNavigation('/account-settings')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Account Settings</span>
                      </button>
                      {userTier === 'free' && (
                        <button
                          onClick={() => console.log('Upgrade clicked')}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-accent hover:bg-muted rounded-md transition-colors duration-200"
                        >
                          <Icon name="Zap" size={16} />
                          <span>Upgrade to Pro</span>
                        </button>
                      )}
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={handleAuth}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAuth}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        <Icon name="LogIn" size={16} />
                        <span>Sign In</span>
                      </button>
                      <button
                        onClick={() => handleNavigation('/user-authentication')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        <Icon name="UserPlus" size={16} />
                        <span>Create Account</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
            />
            
            {isMobileMenuOpen && (
              <div className="absolute top-full mt-1 right-5 left-5 bg-popover border border-border rounded-lg shadow-soft-lg z-10">
                <div className="p-4 space-y-4">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation('/code-editor-workspace')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActivePath('/code-editor-workspace') 
                          ? 'bg-secondary text-secondary-foreground' :'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name="Code2" size={16} />
                      <span>Code Editor</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/language-selection-hub')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActivePath('/language-selection-hub') 
                          ? 'bg-secondary text-secondary-foreground' :'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name="Grid3X3" size={16} />
                      <span>Languages</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavigation('/code-history-dashboard')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActivePath('/code-history-dashboard') 
                          ? 'bg-secondary text-secondary-foreground' :'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name="History" size={16} />
                      <span>My Code</span>
                    </button>
                  </div>

                  {/* Mobile Account Section */}
                  <div className="border-t border-border pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          Plan: <span className="capitalize font-medium text-primary">{userTier}</span>
                        </div>
                        <button
                          onClick={() => handleNavigation('/account-settings')}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-200"
                        >
                          <Icon name="Settings" size={16} />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={handleAuth}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error hover:bg-muted rounded-md transition-colors duration-200"
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleAuth}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-primary hover:bg-muted rounded-md transition-colors duration-200"
                      >
                        <Icon name="LogIn" size={16} />
                        <span>Sign In</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;