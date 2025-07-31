import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const MobileCodeList = ({ 
  codeItems, 
  selectedItems, 
  onSelectionChange, 
  onItemAction 
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: 'FileText',
      python: 'FileText',
      java: 'FileText',
      cpp: 'FileText',
      csharp: 'FileText',
      go: 'FileText',
      rust: 'FileText',
      typescript: 'FileText'
    };
    return icons[language] || 'FileText';
  };

  const getStatusIcon = (status) => {
    const icons = {
      success: 'CheckCircle',
      error: 'XCircle',
      pending: 'Clock'
    };
    return icons[status] || 'Clock';
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'text-success',
      error: 'text-error',
      pending: 'text-warning'
    };
    return colors[status] || 'text-muted-foreground';
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {codeItems.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        const isSelected = selectedItems.includes(item.id);

        return (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon 
                      name={getLanguageIcon(item.language)} 
                      size={20} 
                      className="text-muted-foreground flex-shrink-0" 
                    />
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {item.filename}
                    </h3>
                    {item.isPrivate && (
                      <Icon name="Lock" size={14} className="text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {item.language}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getStatusIcon(item.status)} 
                        size={12} 
                        className={getStatusColor(item.status)} 
                      />
                      <span className={`capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(item.createdAt)} at {formatTime(item.createdAt)}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(item.id)}
                  className="flex-shrink-0"
                >
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                  />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-border p-4 bg-muted/20">
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Last modified: {formatDate(item.lastModified)} at {formatTime(item.lastModified)}
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemAction('preview', item)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemAction('edit', item)}
                      iconName="Edit"
                      iconPosition="left"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemAction('duplicate', item)}
                      iconName="Copy"
                      iconPosition="left"
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemAction('share', item)}
                      iconName="Share"
                      iconPosition="left"
                    >
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onItemAction('delete', item)}
                      iconName="Trash2"
                      iconPosition="left"
                      className="text-error hover:text-error"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty State */}
      {codeItems.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileCode" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No code found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or create your first code snippet.
          </p>
          <Button
            variant="default"
            onClick={() => onItemAction('create')}
            iconName="Plus"
            iconPosition="left"
          >
            Create New Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default MobileCodeList;