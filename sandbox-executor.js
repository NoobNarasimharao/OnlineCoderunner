const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

// Security configuration
const SECURITY_CONFIG = {
  maxExecutionTime: 10000, // 10 seconds
  maxMemoryUsage: 256 * 1024 * 1024, // 256MB
  maxFileSize: 1024 * 1024, // 1MB
  allowedModules: ['console', 'Buffer', 'process', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'],
  blockedModules: ['fs', 'path', 'http', 'https', 'net', 'child_process', 'os', 'crypto', 'util', 'vm', 'eval']
};

// Create temp directory
const tempDir = path.join('/tmp', 'sandbox-' + crypto.randomBytes(8).toString('hex'));

// Security: Block dangerous operations
const originalRequire = require;
require = function(moduleName) {
  if (SECURITY_CONFIG.blockedModules.includes(moduleName)) {
    throw new Error(`Module '${moduleName}' is not allowed in sandbox`);
  }
  return originalRequire(moduleName);
};

// Security: Override dangerous globals
global.process = {
  ...process,
  exit: () => { throw new Error('process.exit() is not allowed'); },
  kill: () => { throw new Error('process.kill() is not allowed'); },
  chdir: () => { throw new Error('process.chdir() is not allowed'); },
  cwd: () => tempDir
};

// Security: Block eval and Function constructor
global.eval = () => { throw new Error('eval() is not allowed'); };
global.Function = () => { throw new Error('Function constructor is not allowed'); };

// Create HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'healthy' }));
    return;
  }

  if (req.url === '/execute' && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > SECURITY_CONFIG.maxFileSize) {
          res.writeHead(413);
          res.end(JSON.stringify({ error: 'Code too large' }));
          return;
        }
      });

      req.on('end', async () => {
        try {
          const { code } = JSON.parse(body);
          
          if (!code || typeof code !== 'string') {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid code' }));
            return;
          }

          // Create temp directory
          await fs.mkdir(tempDir, { recursive: true });
          
          // Write code to file
          const filename = `code_${Date.now()}.js`;
          const filepath = path.join(tempDir, filename);
          await fs.writeFile(filepath, code);

          // Execute code with timeout and memory limits
          const startTime = Date.now();
          let output = '';
          let error = null;

          const child = spawn('node', [filepath], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=256' }
          });

          // Set timeout
          const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            error = 'Execution timeout';
          }, SECURITY_CONFIG.maxExecutionTime);

          // Capture output
          child.stdout.on('data', (data) => {
            output += data.toString();
          });

          child.stderr.on('data', (data) => {
            error = data.toString();
          });

          child.on('close', async (code) => {
            clearTimeout(timeout);
            const executionTime = Date.now() - startTime;

            // Cleanup
            try {
              await fs.unlink(filepath);
              await fs.rmdir(tempDir);
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }

            res.writeHead(200);
            res.end(JSON.stringify({
              output: output.trim(),
              error: error ? error.trim() : null,
              executionTime,
              exitCode: code
            }));
          });

          child.on('error', async (err) => {
            clearTimeout(timeout);
            error = err.message;
            
            // Cleanup
            try {
              await fs.unlink(filepath);
              await fs.rmdir(tempDir);
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }

            res.writeHead(200);
            res.end(JSON.stringify({
              output: '',
              error: error.trim(),
              executionTime: Date.now() - startTime,
              exitCode: -1
            }));
          });

        } catch (parseError) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });

    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js sandbox executor running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Sandbox executor shutting down');
    process.exit(0);
  });
}); 