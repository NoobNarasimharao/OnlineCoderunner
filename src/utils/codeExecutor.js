import LZString from 'lz-string';

        class CodeExecutionCache {
          constructor() {
            this.cache = new Map();
            this.maxSize = 50; // Maximum number of cached results
          }

          generateKey(code, language, input = '') {
            const combined = `${language}:${code}:${input}`;
            return LZString.compressToEncodedURIComponent(combined);
          }

          get(code, language, input) {
            const key = this.generateKey(code, language, input);
            const cached = this.cache.get(key);
            
            if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
              return cached.result;
            }
            
            this.cache.delete(key);
            return null;
          }

          set(code, language, input, result) {
            if (this.cache.size >= this.maxSize) {
              const firstKey = this.cache.keys().next().value;
              this.cache.delete(firstKey);
            }

            const key = this.generateKey(code, language, input);
            this.cache.set(key, {
              result,
              timestamp: Date.now()
            });
          }

          clear() {
            this.cache.clear();
          }
        }

        const executionCache = new CodeExecutionCache();

        export class CodeExecutor {
          constructor() {
            this.queue = [];
            this.isProcessing = false;
            this.currentExecution = null;
          }

          async executeCode(code, language, input = '', options = {}) {
            // Check cache first
            const cached = executionCache.get(code, language, input);
            if (cached && !options.skipCache) {
              return { ...cached, fromCache: true };
            }

            return new Promise((resolve) => {
              const execution = {
                code,
                language,
                input,
                options,
                resolve,
                id: Date.now() + Math.random()
              };

              this.queue.push(execution);
              this.processQueue();
            });
          }

          async processQueue() {
            if (this.isProcessing || this.queue.length === 0) return;

            this.isProcessing = true;
            const execution = this.queue.shift();
            this.currentExecution = execution;

            try {
              const result = await this.simulateExecution(
                execution.code,
                execution.language,
                execution.input,
                execution.options
              );

              // Cache the result
              executionCache.set(execution.code, execution.language, execution.input, result);
              
              execution.resolve({ ...result, fromCache: false });
            } catch (error) {
              execution.resolve({
                success: false,
                output: [],
                errors: [{ type: 'ExecutionError', message: error.message }],
                executionTime: 0
              });
            }

            this.currentExecution = null;
            this.isProcessing = false;

            // Process next item in queue
            setTimeout(() => this.processQueue(), 100);
          }

          async simulateExecution(code, language, input, options) {
            const startTime = Date.now();
            
            // Simulate compilation/execution delay
            const baseDelay = options.quickRun ? 500 : 1000;
            const randomDelay = Math.random() * 500;
            await new Promise(resolve => setTimeout(resolve, baseDelay + randomDelay));

            // Enhanced mock execution with more realistic behavior
            const result = this.generateMockResult(code, language, input);
            const executionTime = Date.now() - startTime;

            return {
              ...result,
              executionTime,
              memoryUsage: Math.round(Math.random() * 1024 + 512), // MB
              language,
              timestamp: Date.now()
            };
          }

          generateMockResult(code, language, input) {
            const output = [];
            const errors = [];
            let success = true;

            // Language-specific execution simulation
            switch (language) {
              case 'javascript':
                if (code.includes('console.log')) {
                  const logs = code.match(/console\.log\(['"`]([^'"`]*?)['"`]\)/g) || [];
                  logs.forEach(log => {
                    const message = log.match(/['"`]([^'"`]*?)['"`]/)?.[1] || 'Hello, World!';
                    output.push({ content: message, type: 'log', timestamp: Date.now() });
                  });
                }
                if (code.includes('error') || code.includes('throw')) {
                  errors.push({
                    type: 'ReferenceError',
                    message: 'error is not defined',
                    line: this.findLineNumber(code, 'error'),
                    suggestion: 'Check your variable names and ensure they are defined before use'
                  });
                  success = false;
                }
                break;

              case 'python':
                if (code.includes('print')) {
                  const prints = code.match(/print\(['"`]([^'"`]*?)['"`]\)/g) || [];
                  prints.forEach(print => {
                    const message = print.match(/['"`]([^'"`]*?)['"`]/)?.[1] || 'Hello, World!';
                    output.push({ content: message, type: 'log', timestamp: Date.now() });
                  });
                }
                if (code.includes('import') && !code.includes('import sys')) {
                  output.push({ content: 'Modules imported successfully', type: 'info', timestamp: Date.now() });
                }
                if (code.includes('def ') && code.includes('return')) {
                  output.push({ content: 'Function defined and executed', type: 'info', timestamp: Date.now() });
                }
                break;

              case 'java':
                if (code.includes('System.out.println')) {
                  const prints = code.match(/System\.out\.println\(['"`]([^'"`]*?)['"`]\)/g) || [];
                  prints.forEach(print => {
                    const message = print.match(/['"`]([^'"`]*?)['"`]/)?.[1] || 'Hello, World!';
                    output.push({ content: message, type: 'log', timestamp: Date.now() });
                  });
                }
                if (code.includes('public class')) {
                  output.push({ content: 'Compilation successful', type: 'info', timestamp: Date.now() });
                }
                break;

              case 'cpp': case'c':
                if (code.includes('cout') || code.includes('printf')) {
                  output.push({ content: 'Hello, World!', type: 'log', timestamp: Date.now() });
                }
                if (code.includes('#include')) {
                  output.push({ content: 'Headers included successfully', type: 'info', timestamp: Date.now() });
                }
                break;

              default:
                output.push({ content: 'Code executed successfully', type: 'log', timestamp: Date.now() });
            }

            // Handle input simulation
            if (input && (code.includes('input') || code.includes('scanf') || code.includes('Scanner'))) {
              output.push({ content: `Input received: ${input}`, type: 'input', timestamp: Date.now() });
            }

            // Add execution completion message
            if (success && output.length === 0) {
              output.push({ content: 'Program executed successfully (no output)', type: 'info', timestamp: Date.now() });
            }

            return { success, output, errors };
          }

          findLineNumber(code, searchText) {
            const lines = code.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(searchText)) {
                return i + 1;
              }
            }
            return 1;
          }

          cancelExecution() {
            if (this.currentExecution) {
              this.currentExecution.resolve({
                success: false,
                output: [{ content: 'Execution cancelled by user', type: 'warning', timestamp: Date.now() }],
                errors: [],
                executionTime: 0,
                cancelled: true
              });
              this.currentExecution = null;
            }
            this.queue.length = 0;
            this.isProcessing = false;
          }

          getQueueLength() {
            return this.queue.length;
          }

          clearCache() {
            executionCache.clear();
          }
        }

        export const codeExecutor = new CodeExecutor();