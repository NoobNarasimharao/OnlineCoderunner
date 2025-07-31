import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import LanguageCard from './components/LanguageCard';
import TemplateCard from './components/TemplateCard';
import UsageStats from './components/UsageStats';
import Breadcrumb from './components/Breadcrumb';
import Icon from '../../components/AppIcon';

const LanguageSelectionHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [userTier, setUserTier] = useState('free');

  // Mock data for programming languages
  const languages = [
    {
      id: 'python',
      name: 'Python',
      description: 'High-level programming language with elegant syntax, perfect for beginners and data science.',
      logo: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'fast',
      features: ['Easy Syntax', 'Data Science', 'Web Development'],
      categories: ['beginner', 'data-science', 'web'],
      tier: 'free',
      defaultTemplate: `print("Hello, World!")\n\n# Your Python code here\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")`
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Dynamic programming language for web development, both frontend and backend applications.',
      logo: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'fast',
      features: ['Web Development', 'Node.js', 'React'],
      categories: ['beginner', 'web'],
      tier: 'free',
      defaultTemplate: `console.log("Hello, World!");\n\n// Your JavaScript code here\nconst name = prompt("Enter your name:");\nconsole.log(\`Hello, \${name}!\`);`
    },
    {
      id: 'java',
      name: 'Java',
      description: 'Object-oriented programming language known for portability and enterprise applications.',
      logo: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'medium',
      features: ['OOP', 'Enterprise', 'Android'],
      categories: ['beginner', 'systems'],
      tier: 'free',
      defaultTemplate: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Your Java code here\n    }\n}`
    },
    {
      id: 'cpp',
      name: 'C++',
      description: 'Powerful systems programming language with manual memory management and high performance.',
      logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'medium',
      features: ['Performance', 'Systems', 'Gaming'],
      categories: ['systems'],
      tier: 'free',
      defaultTemplate: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    \n    // Your C++ code here\n    \n    return 0;\n}`
    },
    {
      id: 'c',
      name: 'C',
      description: 'Low-level programming language that forms the foundation of many modern languages.',
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'fast',
      features: ['Low-level', 'Systems', 'Embedded'],
      categories: ['systems'],
      tier: 'free',
      defaultTemplate: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    // Your C code here\n    \n    return 0;\n}`
    },
    {
      id: 'rust',
      name: 'Rust',
      description: 'Modern systems programming language focused on safety, speed, and concurrency.',
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'medium',
      features: ['Memory Safety', 'Performance', 'Concurrency'],
      categories: ['systems'],
      tier: 'premium',
      defaultTemplate: `fn main() {\n    println!("Hello, World!");\n    \n    // Your Rust code here\n}`
    },
    {
      id: 'go',
      name: 'Go',
      description: 'Simple and efficient programming language designed for modern software development.',
      logo: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'fast',
      features: ['Concurrency', 'Cloud', 'Microservices'],
      categories: ['systems', 'web'],
      tier: 'premium',
      defaultTemplate: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n    \n    // Your Go code here\n}`
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript for large applications.',
      logo: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=64&h=64&fit=crop&crop=center',
      compilationSpeed: 'fast',
      features: ['Type Safety', 'JavaScript', 'Large Apps'],
      categories: ['web'],
      tier: 'premium',
      defaultTemplate: `console.log("Hello, World!");\n\n// Your TypeScript code here\ninterface User {\n    name: string;\n    age: number;\n}\n\nconst user: User = {\n    name: "John",\n    age: 30\n};`
    }
  ];

  // Mock data for categories
  const categories = [
    { id: 'all', name: 'All Languages' },
    { id: 'beginner', name: 'Beginner Friendly' },
    { id: 'web', name: 'Web Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'systems', name: 'Systems Programming' }
  ];

  // Mock data for templates
  const templates = [
    {
      id: 'hello-world',
      name: 'Hello World',
      language: 'Python',
      difficulty: 'Beginner',
      tier: 'free',
      preview: `print("Hello, World!")\nprint("Welcome to programming!")`,
      code: `print("Hello, World!")\nprint("Welcome to programming!")\n\n# This is your first program\n# Try modifying the messages above`
    },
    {
      id: 'calculator',
      name: 'Basic Calculator',
      language: 'JavaScript',
      difficulty: 'Beginner',
      tier: 'free',
      preview: `function add(a, b) {\n    return a + b;\n}\n\nconsole.log(add(5, 3));`,
      code: `function add(a, b) {\n    return a + b;\n}\n\nfunction subtract(a, b) {\n    return a - b;\n}\n\nfunction multiply(a, b) {\n    return a * b;\n}\n\nfunction divide(a, b) {\n    return b !== 0 ? a / b : "Cannot divide by zero";\n}\n\n// Test the calculator\nconsole.log("5 + 3 =", add(5, 3));\nconsole.log("5 - 3 =", subtract(5, 3));\nconsole.log("5 * 3 =", multiply(5, 3));\nconsole.log("5 / 3 =", divide(5, 3));`
    },
    {
      id: 'data-structures',
      name: 'Array Operations',
      language: 'Java',
      difficulty: 'Intermediate',
      tier: 'free',
      preview: `int[] numbers = {1, 2, 3, 4, 5};\nfor (int num : numbers) {\n    System.out.println(num);\n}`,
      code: `public class ArrayOperations {\n    public static void main(String[] args) {\n        int[] numbers = {1, 2, 3, 4, 5};\n        \n        // Print all elements\n        System.out.println("Array elements:");\n        for (int num : numbers) {\n            System.out.println(num);\n        }\n        \n        // Find sum\n        int sum = 0;\n        for (int num : numbers) {\n            sum += num;\n        }\n        System.out.println("Sum: " + sum);\n    }\n}`
    },
    {
      id: 'async-patterns',
      name: 'Async Patterns',
      language: 'TypeScript',
      difficulty: 'Advanced',
      tier: 'premium',
      preview: `async function fetchData(): Promise<string> {\n    return "Hello from async!";\n}\n\nfetchData().then(console.log);`,
      code: `async function fetchData(): Promise<string> {\n    // Simulate API call\n    return new Promise((resolve) => {\n        setTimeout(() => {\n            resolve("Hello from async!");\n        }, 1000);\n    });\n}\n\n// Using async/await\nasync function main() {\n    try {\n        const data = await fetchData();\n        console.log(data);\n    } catch (error) {\n        console.error("Error:", error);\n    }\n}\n\nmain();`
    }
  ];

  // Mock usage statistics
  const usageStats = {
    popular: [
      { name: 'Python', percentage: 85 },
      { name: 'JavaScript', percentage: 78 },
      { name: 'Java', percentage: 65 },
      { name: 'C++', percentage: 45 },
      { name: 'TypeScript', percentage: 32 }
    ]
  };

  // Mock recent selections (empty for new users)
  const [recentSelections] = useState([
    { language: 'Python', timeAgo: '2 hours ago' },
    { language: 'JavaScript', timeAgo: '1 day ago' },
    { language: 'Java', timeAgo: '3 days ago' }
  ]);

  // Filter languages based on search and category
  const filteredLanguages = languages.filter(language => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || language.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  // Filter templates based on user tier
  const availableTemplates = templates.filter(template => 
    template.tier === 'free' || userTier === 'premium'
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  useEffect(() => {
    // Check user authentication and tier
    const checkUserTier = () => {
      // Mock authentication check
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const tier = localStorage.getItem('userTier') || 'free';
      setUserTier(tier);
    };

    checkUserTier();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[60px]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Programming Language
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select from our collection of popular programming languages and start coding instantly with pre-configured environments and templates.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />

          {/* Category Tabs */}
          <CategoryTabs 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Usage Statistics */}
          <UsageStats 
            stats={usageStats}
            recentSelections={recentSelections}
          />

          {/* Languages Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Programming Languages
              </h2>
              <div className="text-sm text-muted-foreground">
                {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
              </div>
            </div>

            {filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredLanguages.map((language) => (
                  <LanguageCard 
                    key={language.id}
                    language={language}
                    userTier={userTier}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No languages found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Featured Templates */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Featured Templates
              </h2>
              <div className="text-sm text-muted-foreground">
                Quick start with common patterns
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableTemplates.map((template) => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  userTier={userTier}
                />
              ))}
            </div>
          </div>

          {/* Upgrade Banner for Free Users */}
          {userTier === 'free' && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 text-center">
              <Icon name="Zap" size={32} className="mx-auto text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Unlock More Languages & Features
              </h3>
              <p className="text-muted-foreground mb-4">
                Get access to premium languages like Rust, Go, TypeScript and advanced templates with faster compilation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.open('/user-authentication', '_blank')}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  Upgrade to Pro
                </button>
                <button
                  onClick={() => window.open('/code-editor-workspace', '_blank')}
                  className="border border-border text-foreground px-6 py-2 rounded-md font-medium hover:bg-muted transition-colors duration-200"
                >
                  Continue with Free
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LanguageSelectionHub;