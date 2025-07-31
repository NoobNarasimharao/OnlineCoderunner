import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CodeTable = ({ 
  codeItems, 
  selectedItems, 
  onSelectionChange, 
  onSort, 
  sortConfig,
  onItemAction 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

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

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(codeItems.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleSort = (column) => {
    const direction = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSort({ column, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedItems.length === codeItems.length && codeItems.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('filename')}
                  iconName={getSortIcon('filename')}
                  iconPosition="right"
                  className="text-sm font-medium text-foreground hover:bg-transparent p-0"
                >
                  Filename
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('language')}
                  iconName={getSortIcon('language')}
                  iconPosition="right"
                  className="text-sm font-medium text-foreground hover:bg-transparent p-0"
                >
                  Language
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('createdAt')}
                  iconName={getSortIcon('createdAt')}
                  iconPosition="right"
                  className="text-sm font-medium text-foreground hover:bg-transparent p-0"
                >
                  Created
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('lastModified')}
                  iconName={getSortIcon('lastModified')}
                  iconPosition="right"
                  className="text-sm font-medium text-foreground hover:bg-transparent p-0"
                >
                  Modified
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  iconName={getSortIcon('status')}
                  iconPosition="right"
                  className="text-sm font-medium text-foreground hover:bg-transparent p-0"
                >
                  Status
                </Button>
              </th>
              <th className="text-center px-4 py-3">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {codeItems.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Icon 
                        name={getLanguageIcon(item.language)} 
                        size={20} 
                        className="text-muted-foreground" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-48">
                        {item.filename}
                      </p>
                      {item.isPrivate && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Icon name="Lock" size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Private</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {item.language}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(item.createdAt)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(item.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(item.lastModified)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(item.lastModified)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(item.status)} 
                      size={16} 
                      className={getStatusColor(item.status)} 
                    />
                    <span className={`text-sm capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    {hoveredRow === item.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onItemAction('preview', item)}
                          className="h-8 w-8"
                        >
                          <Icon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onItemAction('edit', item)}
                          className="h-8 w-8"
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onItemAction('duplicate', item)}
                          className="h-8 w-8"
                        >
                          <Icon name="Copy" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onItemAction('share', item)}
                          className="h-8 w-8"
                        >
                          <Icon name="Share" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onItemAction('delete', item)}
                          className="h-8 w-8 text-error hover:text-error"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Icon name="MoreHorizontal" size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default CodeTable;