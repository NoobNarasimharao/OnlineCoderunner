import React, { useState, useRef, useEffect } from 'react';
import { Play, Download, Copy, RotateCcw, Settings, Moon, Sun, Code, Terminal, FileText } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import CodeEditor from '../components/CodeEditor';
import OutputPanel from '../components/OutputPanel';
import LanguageSelector from '../components/LanguageSelector';

const CodeRunner = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [availableLanguages, setAvailableLanguages] = useState({});

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '⚡', extension: '.js' },
    { id: 'python', name: 'Python', icon: '🐍', extension: '.py' },
    { id: 'typescript', name: 'TypeScript', icon: '📘', extension: '.ts' },
  ];

  // Check available languages on component mount
  useEffect(() => {
    const checkAvailableLanguages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const data = await response.json();
        if (data.availableLanguages) {
          setAvailableLanguages(data.availableLanguages);
        }
      } catch (error) {
        console.warn('Could not check available languages:', error);
      }
    };
    
    checkAvailableLanguages();
  }, []);

  const defaultCode = {
    javascript: `// Welcome to CodeRunner!
console.log("Hello, World!");

// Try some JavaScript features
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Async function example
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data fetched!"), 1000);
  });
}

fetchData().then(result => console.log(result));`,
    python: `# Welcome to CodeRunner!
print("Hello, World!")

# Try some Python features
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled numbers:", doubled)

# Function example
def greet(name):
    return f"Hello, {name}!"

print(greet("Python"))`,
    java: `// Welcome to CodeRunner!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Try some Java features
        int[] numbers = {1, 2, 3, 4, 5};
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Number: " + numbers[i]);
        }
    }
}`,
    cpp: `// Welcome to CodeRunner!
#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Try some C++ features
    vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        cout << "Number: " << num << endl;
    }
    
    return 0;
}`,
    csharp: `// Welcome to CodeRunner!
using System;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        // Try some C# features
        var numbers = new[] { 1, 2, 3, 4, 5 };
        var doubled = numbers.Select(n => n * 2);
        
        foreach (var num in doubled) {
            Console.WriteLine("Doubled: " + num);
        }
    }
}`,
    php: `<?php
// Welcome to CodeRunner!
echo "Hello, World!\\n";

// Try some PHP features
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);

echo "Doubled numbers: " . implode(", ", $doubled) . "\\n";

// Function example
function greet($name) {
    return "Hello, $name!";
}

echo greet("PHP") . "\\n";
?>`,
    ruby: `# Welcome to CodeRunner!
puts "Hello, World!"

# Try some Ruby features
numbers = [1, 2, 3, 4, 5]
doubled = numbers.map { |n| n * 2 }
puts "Doubled numbers: #{doubled}"

# Function example
def greet(name)
  "Hello, #{name}!"
end

puts greet("Ruby")`,
    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // Try some Go features
    numbers := []int{1, 2, 3, 4, 5}
    for i, num := range numbers {
        fmt.Printf("Number %d: %d\\n", i+1, num)
    }
}`,
    rust: `// Welcome to CodeRunner!
fn main() {
    println!("Hello, World!");
    
    // Try some Rust features
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers.iter().map(|n| n * 2).collect();
    
    for num in doubled {
        println!("Doubled: {}", num);
    }
}`,
    swift: `// Welcome to CodeRunner!
print("Hello, World!")

// Try some Swift features
let numbers = [1, 2, 3, 4, 5]
let doubled = numbers.map { $0 * 2 }

for (index, number) in doubled.enumerated() {
    print("Number \\(index + 1): \\(number)")
}`,
    kotlin: `// Welcome to CodeRunner!
fun main() {
    println("Hello, World!")
    
    // Try some Kotlin features
    val numbers = listOf(1, 2, 3, 4, 5)
    val doubled = numbers.map { it * 2 }
    
    doubled.forEachIndexed { index, number ->
        println("Number \${index + 1}: \$number")
    }
}`,
    typescript: `// Welcome to CodeRunner!
console.log("Hello, World!");

// Try some TypeScript features
interface User {
    name: string;
    age: number;
}

const users: User[] = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

users.forEach(user => {
    console.log(\`\${user.name} is \${user.age} years old\`);
});

// Async function with types
async function fetchUserData(): Promise<User[]> {
    return new Promise(resolve => {
        setTimeout(() => resolve(users), 1000);
    });
}

fetchUserData().then(data => console.log("Fetched users:", data));`
  };

  useEffect(() => {
    if (!code) {
      setCode(defaultCode[selectedLanguage] || defaultCode.javascript);
    }
  }, [selectedLanguage]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      // Call the real backend API
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to execute code');
      }

      setOutput(result.output || '');
      setExecutionTime(result.executionTime || Date.now() - startTime);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${languages.find(l => l.id === selectedLanguage)?.extension || '.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetCode = () => {
    setCode(defaultCode[selectedLanguage] || defaultCode.javascript);
    setOutput('');
    setError(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-gray-200 bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Code className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodeRunner
                </h1>
              </div>
              <span className="text-sm text-gray-500">Online Code Editor</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                languages={languages}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                theme={theme}
                availableLanguages={availableLanguages}
              />
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`border-b transition-colors duration-300 ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-gray-200 bg-white/80 backdrop-blur-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium">Font Size:</label>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm">{fontSize}px</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium">Tab Size:</label>
                <select
                  value={tabSize}
                  onChange={(e) => setTabSize(parseInt(e.target.value))}
                  className={`px-3 py-1 rounded border text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={8}>8 spaces</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor Panel */}
          <div className={`rounded-xl border transition-colors duration-300 ${
            theme === 'dark' 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-white shadow-lg'
          }`}>
            <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">
                  {languages.find(l => l.id === selectedLanguage)?.name} Code
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleDownloadCode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Download Code"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetCode}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Reset Code"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 h-[calc(100%-80px)]">
              <CodeEditor
                code={code}
                onChange={setCode}
                language={selectedLanguage}
                theme={theme}
                fontSize={fontSize}
                tabSize={tabSize}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className={`rounded-xl border transition-colors duration-300 ${
            theme === 'dark' 
              ? 'border-gray-700 bg-gray-800' 
              : 'border-gray-200 bg-white shadow-lg'
          }`}>
            <div className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-green-600" />
                <span className="font-medium">Output</span>
                {executionTime && (
                  <span className="text-sm text-gray-500">
                    ({executionTime}ms)
                  </span>
                )}
              </div>
              
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isRunning
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
            
            <div className="p-4 h-[calc(100%-80px)]">
              <OutputPanel
                output={output}
                error={error}
                isRunning={isRunning}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRunner; 