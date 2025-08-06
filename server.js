const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create temp directory for code files
const tempDir = path.join(os.tmpdir(), 'coderunner');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.access(tempDir);
  } catch {
    await fs.mkdir(tempDir, { recursive: true });
  }
}

// Language configurations - simplified for basic functionality
const languageConfigs = {
  javascript: {
    extension: '.js',
    command: 'node',
    timeout: 10000
  },
  python: {
    extension: '.py',
    command: 'python',
    timeout: 10000
  },
  typescript: {
    extension: '.ts',
    command: 'ts-node',
    timeout: 10000
  }
};

// Execute code
async function executeCode(code, language) {
  const config = languageConfigs[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}. Currently supported: ${Object.keys(languageConfigs).join(', ')}`);
  }

  await ensureTempDir();
  
  const timestamp = Date.now();
  const filename = `code_${timestamp}${config.extension}`;
  const filepath = path.join(tempDir, filename);
  
  try {
    // Write code to file
    await fs.writeFile(filepath, code);
    
    const result = await new Promise((resolve, reject) => {
      exec(`${config.command} "${filepath}"`, { 
        cwd: tempDir, 
        timeout: config.timeout,
        maxBuffer: 1024 * 1024 // 1MB buffer
      }, (error, stdout, stderr) => {
        if (error) {
          if (error.message.includes('is not recognized') || error.message.includes('command not found')) {
            const langName = getLanguageDisplayName(language);
            reject(new Error(`${langName} runtime is not installed. Please install ${langName} to run ${langName} code.`));
          } else if (error.code !== 0) {
            reject(new Error(stderr || error.message));
          } else {
            resolve(stdout || '');
          }
        } else {
          resolve(stdout || '');
        }
      });
    });
    
    return result.trim();
    
  } catch (error) {
    throw error;
  } finally {
    // Cleanup: remove temporary files
    try {
      await fs.unlink(filepath);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}

// Helper function to get language display names
function getLanguageDisplayName(language) {
  const displayNames = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    python: 'Python'
  };
  return displayNames[language] || language;
}

// Routes
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code and language are required' 
      });
    }
    
    const startTime = Date.now();
    const output = await executeCode(code, language);
    const executionTime = Date.now() - startTime;
    
    res.json({
      output,
      executionTime,
      language
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
      language: req.body.language
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      supportedLanguages: Object.keys(languageConfigs),
      message: 'CodeRunner API is running. Note: This version uses direct execution (not sandboxed).'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`CodeRunner API server running on port ${PORT}`);
  console.log(`Supported languages: ${Object.keys(languageConfigs).join(', ')}`);
  console.log('Note: This version uses direct execution (not sandboxed)');
});

module.exports = app; 