import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('export')}
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('duplicate')}
            iconName="Copy"
            iconPosition="left"
          >
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('share')}
            iconName="Share"
            iconPosition="left"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('delete')}
            iconName="Trash2"
            iconPosition="left"
            className="text-error hover:text-error"
          >
            Delete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;