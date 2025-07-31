import React from 'react';
import Button from '../../../components/ui/Button';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="text-sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryTabs;