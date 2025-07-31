import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FilterPanel from './components/FilterPanel';
import SummaryCards from './components/SummaryCards';
import CodeTable from './components/CodeTable';
import MobileCodeList from './components/MobileCodeList';
import BulkActions from './components/BulkActions';
import Pagination from './components/Pagination';

const CodeHistoryDashboard = () => {
  const navigate = useNavigate();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ column: 'lastModified', direction: 'desc' });
  const [isMobile, setIsMobile] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    language: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    tags: [],
    showPrivateOnly: false
  });

  // Mock data for code history
  const mockCodeItems = [
    {
      id: 1,
      filename: 'hello_world.py',
      language: 'python',
      createdAt: new Date('2025-01-25T10:30:00'),
      lastModified: new Date('2025-01-30T14:20:00'),
      status: 'success',
      isPrivate: false,
      tags: ['tutorial', 'beginner'],
      code: `print("Hello, World!")\nprint("Welcome to Python programming")`
    },
    {
      id: 2,
      filename: 'fibonacci.js',
      language: 'javascript',
      createdAt: new Date('2025-01-28T09:15:00'),
      lastModified: new Date('2025-01-29T16:45:00'),
      status: 'success',
      isPrivate: true,
      tags: ['algorithm', 'practice'],
      code: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}`
    },
    {
      id: 3,
      filename: 'sorting_algorithm.cpp',
      language: 'cpp',
      createdAt: new Date('2025-01-26T11:00:00'),
      lastModified: new Date('2025-01-28T13:30:00'),
      status: 'error',
      isPrivate: false,
      tags: ['algorithm', 'homework'],
      code: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int>& arr) {\n  // Implementation here\n}`
    },
    {
      id: 4,
      filename: 'api_client.java',
      language: 'java',
      createdAt: new Date('2025-01-24T08:45:00'),
      lastModified: new Date('2025-01-27T10:15:00'),
      status: 'success',
      isPrivate: true,
      tags: ['project', 'api'],
      code: `public class ApiClient {\n  private String baseUrl;\n  \n  public ApiClient(String baseUrl) {\n    this.baseUrl = baseUrl;\n  }\n}`
    },
    {
      id: 5,
      filename: 'data_structures.py',
      language: 'python',
      createdAt: new Date('2025-01-23T14:20:00'),
      lastModified: new Date('2025-01-26T09:30:00'),
      status: 'pending',
      isPrivate: false,
      tags: ['tutorial', 'data-structures'],
      code: `class Stack:\n  def __init__(self):\n    self.items = []\n  \n  def push(self, item):\n    self.items.append(item)`
    },
    {
      id: 6,
      filename: 'web_scraper.js',
      language: 'javascript',
      createdAt: new Date('2025-01-22T16:10:00'),
      lastModified: new Date('2025-01-25T11:45:00'),
      status: 'success',
      isPrivate: true,
      tags: ['project', 'scraping'],
      code: `const axios = require('axios');\nconst cheerio = require('cheerio');\n\nasync function scrapeWebsite(url) {\n  // Implementation\n}`
    },
    {
      id: 7,
      filename: 'calculator.csharp',
      language: 'csharp',
      createdAt: new Date('2025-01-21T12:30:00'),
      lastModified: new Date('2025-01-24T15:20:00'),
      status: 'success',
      isPrivate: false,
      tags: ['practice', 'beginner'],
      code: `using System;\n\nclass Calculator {\n  public static double Add(double a, double b) {\n    return a + b;\n  }\n}`
    },
    {
      id: 8,
      filename: 'concurrent_server.go',
      language: 'go',
      createdAt: new Date('2025-01-20T09:00:00'),
      lastModified: new Date('2025-01-23T14:10:00'),
      status: 'error',
      isPrivate: true,
      tags: ['project', 'server'],
      code: `package main\n\nimport (\n  "fmt"\n  "net/http"\n)\n\nfunc main() {\n  http.HandleFunc("/", handler)\n}`
    }
  ];

  const stats = {
    totalProjects: mockCodeItems.length,
    thisMonth: mockCodeItems.filter(item => 
      new Date(item.createdAt).getMonth() === new Date().getMonth()
    ).length,
    successRate: Math.round(
      (mockCodeItems.filter(item => item.status === 'success').length / mockCodeItems.length) * 100
    ),
    storageUsed: '2.4 MB'
  };

  // Filter and sort items
  const filteredItems = mockCodeItems.filter(item => {
    if (filters.search && !item.filename.toLowerCase().includes(filters.search.toLowerCase()) &&
        !item.code.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.language !== 'all' && item.language !== filters.language) {
      return false;
    }
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    if (filters.dateFrom && new Date(item.createdAt) < new Date(filters.dateFrom)) {
      return false;
    }
    if (filters.dateTo && new Date(item.createdAt) > new Date(filters.dateTo)) {
      return false;
    }
    if (filters.tags.length > 0 && !filters.tags.some(tag => item.tags.includes(tag))) {
      return false;
    }
    if (filters.showPrivateOnly && !item.isPrivate) {
      return false;
    }
    return true;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    const { column, direction } = sortConfig;
    let aValue = a[column];
    let bValue = b[column];

    if (column === 'createdAt' || column === 'lastModified') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setCurrentPage(1);
  };

  const handleItemAction = (action, item) => {
    switch (action) {
      case 'preview': console.log('Preview item:', item);
        break;
      case 'edit': navigate('/code-editor-workspace', { state: { codeItem: item } });
        break;
      case 'duplicate': console.log('Duplicate item:', item);
        break;
      case 'share': console.log('Share item:', item);
        break;
      case 'delete':
        console.log('Delete item:', item);
        break;
      case 'create': navigate('/code-editor-workspace');
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    const selectedItemsData = mockCodeItems.filter(item => selectedItems.includes(item.id));
    console.log(`Bulk ${action}:`, selectedItemsData);
    
    if (action === 'delete') {
      setSelectedItems([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[60px]">
        <div className="flex h-[calc(100vh-60px)]">
          {/* Filter Panel - Desktop */}
          <div className="hidden lg:block">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isCollapsed={false}
              onToggleCollapse={() => {}}
            />
          </div>

          {/* Filter Panel - Mobile/Tablet Overlay */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterPanelOpen(false)} />
              <div className="absolute left-0 top-0 h-full">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isCollapsed={false}
                  onToggleCollapse={() => setIsFilterPanelOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Code</h1>
                    <p className="text-muted-foreground">
                      Manage and organize your coding projects and snippets
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsFilterPanelOpen(true)}
                      iconName="Filter"
                      iconPosition="left"
                      className="lg:hidden"
                    >
                      Filters
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => navigate('/code-editor-workspace')}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      New Code
                    </Button>
                  </div>
                </div>

                {/* Summary Cards */}
                <SummaryCards stats={stats} />

                {/* Search Bar - Mobile */}
                <div className="lg:hidden mb-6">
                  <Input
                    type="search"
                    placeholder="Search code..."
                    value={filters.search}
                    onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                  />
                </div>

                {/* Bulk Actions */}
                <BulkActions
                  selectedCount={selectedItems.length}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedItems([])}
                />

                {/* Code Table/List */}
                {isMobile ? (
                  <MobileCodeList
                    codeItems={paginatedItems}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    onItemAction={handleItemAction}
                  />
                ) : (
                  <CodeTable
                    codeItems={paginatedItems}
                    selectedItems={selectedItems}
                    onSelectionChange={setSelectedItems}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onItemAction={handleItemAction}
                  />
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedItems.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeHistoryDashboard;