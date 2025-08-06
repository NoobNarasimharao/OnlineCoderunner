import React from 'react';
import { Loader2, AlertCircle, CheckCircle, Terminal } from 'lucide-react';

const OutputPanel = ({ output, error, isRunning, theme }) => {
  const formatOutput = (text) => {
    if (!text) return '';
    
    // Split by newlines and format each line
    return text.split('\n').map((line, index) => {
      // Handle console.log outputs
      if (line.includes(' => ')) {
        const [input, result] = line.split(' => ');
        return (
          <div key={index} className="mb-1">
            <span className="text-blue-500">{input}</span>
            <span className="text-gray-500 mx-2">→</span>
            <span className="text-green-600">{result}</span>
          </div>
        );
      }
      
      // Handle regular output
      return (
        <div key={index} className="mb-1">
          <span className="text-gray-700 dark:text-gray-300">{line}</span>
        </div>
      );
    });
  };

  const formatError = (errorText) => {
    if (!errorText) return '';
    
    return (
      <div className="flex items-start space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="text-red-700 dark:text-red-300 text-sm">
          <div className="font-medium mb-1">Error</div>
          <div className="font-mono">{errorText}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {isRunning ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <div className="text-gray-600 dark:text-gray-400">
              Running your code...
            </div>
          </div>
        </div>
      ) : output || error ? (
        <div className="h-full overflow-auto">
          {error && formatError(error)}
          {output && (
            <div className={`mt-4 p-4 rounded-lg font-mono text-sm ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                <Terminal className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Output
                </span>
              </div>
              <div className="space-y-1">
                {formatOutput(output)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Terminal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-500 dark:text-gray-400">
              <div className="font-medium mb-1">Ready to run</div>
              <div className="text-sm">Click "Run Code" to execute your program</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPanel; 