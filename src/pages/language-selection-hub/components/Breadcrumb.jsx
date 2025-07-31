import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Breadcrumb = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <button
        onClick={() => navigate('/')}
        className="hover:text-foreground transition-colors duration-200"
      >
        Home
      </button>
      <Icon name="ChevronRight" size={16} />
      <span className="text-foreground font-medium">Languages</span>
    </nav>
  );
};

export default Breadcrumb;