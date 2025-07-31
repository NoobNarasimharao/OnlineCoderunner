import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <Input
        type="search"
        placeholder="Search programming languages..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <Icon name="Search" size={18} />
      </div>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Icon name="X" size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;