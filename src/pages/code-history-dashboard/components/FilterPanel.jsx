import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      language: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      tags: [],
      showPrivateOnly: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleTagToggle = (tag) => {
    const updatedTags = localFilters.tags.includes(tag)
      ? localFilters.tags.filter(t => t !== tag)
      : [...localFilters.tags, tag];
    handleFilterChange('tags', updatedTags);
  };

  const availableTags = ['project', 'tutorial', 'experiment', 'interview', 'homework', 'practice'];

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-0 overflow-hidden' : 'w-80'
    } lg:w-80`}>
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="lg:hidden"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            label="Search Code"
            type="search"
            placeholder="Search by filename or content..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Language Filter */}
        <div className="mb-6">
          <Select
            label="Programming Language"
            options={languageOptions}
            value={localFilters.language}
            onChange={(value) => handleFilterChange('language', value)}
          />
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <Select
            label="Execution Status"
            options={statusOptions}
            value={localFilters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Date Range</label>
          <div className="space-y-3">
            <Input
              type="date"
              placeholder="From date"
              value={localFilters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
            <Input
              type="date"
              placeholder="To date"
              value={localFilters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Tags</label>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <Checkbox
                key={tag}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                checked={localFilters.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              />
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-6">
          <Checkbox
            label="Private Code Only"
            description="Show only private code snippets"
            checked={localFilters.showPrivateOnly}
            onChange={(e) => handleFilterChange('showPrivateOnly', e.target.checked)}
          />
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={handleClearFilters}
          iconName="RotateCcw"
          iconPosition="left"
          fullWidth
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;