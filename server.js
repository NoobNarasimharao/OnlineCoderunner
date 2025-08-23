const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Language configurations for sandbox services
const languageConfigs = {
  javascript: { url: 'http://sandbox-node:8080/execute', timeout: 10000 },
  python: { url: 'http://sandbox-python:8080/execute', timeout: 10000 },
  java: { url: 'http://sandbox-java:8080/execute', timeout: 15000 },
  cpp: { url: 'http://sandbox-cpp:8080/execute', timeout: 15000 },
  php: { url: 'http://sandbox-php:8080/execute', timeout: 10000 },
  ruby: { url: 'http://sandbox-ruby:8080/execute', timeout: 10000 },
  go: { url: 'http://sandbox-go:8080/execute', timeout: 15000 },
  rust: { url: 'http://sandbox-rust:8080/execute', timeout: 20000 },
  typescript: { url: 'http://sandbox-typescript:8080/execute', timeout: 10000 },
};

// Execute code via sandbox service
async function executeCode(code, language) {
  const config = languageConfigs[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}.`);
  }

  try {
    const response = await axios.post(config.url, { code }, {
      timeout: config.timeout,
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Execution timed out');
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const errorMessage = data.error || `Sandbox service returned status ${status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(`Could not connect to the ${language} sandbox service.`);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
}

// Routes
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required',
      });
    }

    const startTime = Date.now();
    const result = await executeCode(code, language);
    const executionTime = Date.now() - startTime;

    res.json({
      ...result,
      executionTime,
      language,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      language: req.body.language,
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
      message: 'CodeRunner API is running with secure, sandboxed execution.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`CodeRunner API server running on port ${PORT}`);
  console.log(`Mode: Sandboxed Execution`);
  console.log(`Supported languages: ${Object.keys(languageConfigs).join(', ')}`);
});

module.exports = app;
