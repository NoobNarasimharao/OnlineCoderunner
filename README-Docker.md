# CodeRunner - Docker Setup

A secure, containerized code execution environment with isolated sandboxes for multiple programming languages.

## 🐳 Docker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Sandboxes     │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (Docker)      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start with Docker

### Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **Git**

### 1. Clone and Setup

```bash
git clone <repository-url>
cd coderunner_online
```

### 2. Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3001/api/health
- **Individual Sandbox Health**: http://localhost:8080/health (for each sandbox)

## 🏗️ Architecture Overview

### Services

| Service | Purpose | Port | Base Image |
|---------|---------|------|------------|
| `client` | React frontend served by Nginx | 3000 | nginx:alpine |
| `server` | Node.js API server | 3001 | node:18-alpine |
| `sandbox-node` | JavaScript/Node.js execution | 8080 | node:18-alpine |
| `sandbox-python` | Python execution | 8080 | python:3.11-alpine |
| `sandbox-java` | Java execution | 8080 | openjdk:17-jdk-alpine |
| `sandbox-cpp` | C++ execution | 8080 | gcc:12-alpine |
| `sandbox-php` | PHP execution | 8080 | php:8.2-alpine |
| `sandbox-ruby` | Ruby execution | 8080 | ruby:3.2-alpine |
| `sandbox-go` | Go execution | 8080 | golang:1.21-alpine |
| `sandbox-rust` | Rust execution | 8080 | rust:1.75-alpine |
| `sandbox-typescript` | TypeScript execution | 8080 | node:18-alpine |

### Security Features

#### 🔒 Container Security
- **Read-only filesystems** for all sandboxes
- **Non-root users** in all containers
- **No new privileges** security option
- **Temporary filesystems** for code execution
- **Resource limits** (CPU, memory, disk)

#### 🛡️ Code Execution Security
- **Module blocking** - Dangerous modules are blocked
- **Timeout limits** - 10-20 seconds per execution
- **Memory limits** - 256MB per sandbox
- **File size limits** - 1MB max code size
- **Automatic cleanup** - Temporary files are deleted
- **Network isolation** - Sandboxes can't access external networks

#### 🚫 Blocked Operations
- File system access (`fs`, `os`, `path`)
- Network access (`http`, `https`, `socket`)
- Process control (`child_process`, `subprocess`)
- System calls (`eval`, `exec`, `compile`)
- Database access (`sqlite3`, `mysql`)
- Shell access (`bash`, `sh`)

## 🔧 Configuration

### Environment Variables

```bash
# Frontend
REACT_APP_API_URL=http://localhost:3001

# Backend
NODE_ENV=production
PORT=3001

# Sandboxes
PYTHONUNBUFFERED=1
JAVA_OPTS=-Xmx512m
NODE_OPTIONS=--max-old-space-size=256
```

### Resource Limits

```yaml
# Memory limits per sandbox
sandbox-node: 256MB
sandbox-python: 256MB
sandbox-java: 512MB
sandbox-cpp: 512MB
sandbox-rust: 512MB
sandbox-go: 512MB
sandbox-php: 256MB
sandbox-ruby: 256MB
sandbox-typescript: 256MB

# Timeout limits
javascript: 10s
python: 10s
java: 15s
cpp: 15s
rust: 20s
go: 15s
php: 10s
ruby: 10s
typescript: 10s
```

## 🚀 Deployment

### Production Deployment

1. **Build production images**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
   ```

2. **Use external volumes**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Scale sandboxes**:
   ```bash
   docker-compose up -d --scale sandbox-node=3 --scale sandbox-python=2
   ```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coderunner
spec:
  replicas: 3
  selector:
    matchLabels:
      app: coderunner
  template:
    metadata:
      labels:
        app: coderunner
    spec:
      containers:
      - name: client
        image: coderunner-client:latest
        ports:
        - containerPort: 3000
      - name: server
        image: coderunner-server:latest
        ports:
        - containerPort: 3001
      - name: sandbox-node
        image: coderunner-sandbox-node:latest
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
```

## 🔍 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs server
docker-compose logs sandbox-node

# Follow logs
docker-compose logs -f sandbox-python
```

### Health Checks

```bash
# Check all services
docker-compose ps

# Check sandbox health
curl http://localhost:3001/api/health

# Check individual sandbox
curl http://localhost:8080/health
```

### Metrics

```bash
# Container resource usage
docker stats

# Network connectivity
docker network inspect coderunner_coderunner-network
```

## 🛠️ Development

### Adding a New Language

1. **Create sandbox Dockerfile**:
   ```dockerfile
   FROM language:version-alpine
   
   # Add security user
   RUN addgroup -g 1011 -S sandbox && \
       adduser -S sandbox -u 1011
   
   # Copy executor
   COPY sandbox-executor.lang ./
   
   # Set permissions
   RUN chown -R sandbox:sandbox /sandbox
   USER sandbox
   
   EXPOSE 8080
   CMD ["./sandbox-executor"]
   ```

2. **Add to docker-compose.yml**:
   ```yaml
   sandbox-newlang:
     build:
       context: .
       dockerfile: Dockerfile.sandbox-newlang
     networks:
       - coderunner-network
     security_opt:
       - no-new-privileges:true
     read_only: true
     tmpfs:
       - /tmp:noexec,nosuid,size=100m
   ```

3. **Update server.js**:
   ```javascript
   const sandboxConfigs = {
     newlang: {
       service: 'sandbox-newlang',
       port: 8080,
       timeout: 10000
     }
   };
   ```

### Debugging

```bash
# Enter a sandbox container
docker-compose exec sandbox-node sh

# Check sandbox logs
docker-compose logs sandbox-python

# Test sandbox directly
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello World\")"}'
```

## 🔒 Security Best Practices

### 1. Network Security
- All containers use internal Docker network
- No direct external network access for sandboxes
- API server acts as proxy to sandboxes

### 2. File System Security
- Read-only filesystems for sandboxes
- Temporary filesystems for execution
- Automatic cleanup after execution

### 3. Process Security
- Non-root users in all containers
- Resource limits prevent DoS attacks
- Timeout limits prevent infinite loops

### 4. Code Execution Security
- Module blocking prevents dangerous operations
- Input validation and sanitization
- Output filtering and size limits

## 🚨 Troubleshooting

### Common Issues

1. **Sandbox not responding**:
   ```bash
   docker-compose restart sandbox-node
   ```

2. **Memory issues**:
   ```bash
   # Increase memory limits in docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 512M
   ```

3. **Network connectivity**:
   ```bash
   # Check network
   docker network ls
   docker network inspect coderunner_coderunner-network
   ```

4. **Permission issues**:
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER .
   ```

### Performance Optimization

1. **Use multi-stage builds**:
   ```dockerfile
   FROM node:18-alpine AS builder
   # Build stage
   
   FROM nginx:alpine
   # Production stage
   ```

2. **Optimize image sizes**:
   ```dockerfile
   RUN apk add --no-cache package && \
       rm -rf /var/cache/apk/*
   ```

3. **Use volume mounts for development**:
   ```yaml
   volumes:
     - ./src:/app/src
     - ./public:/app/public
   ```

## 📊 Performance Metrics

### Benchmarks

| Language | Startup Time | Memory Usage | Execution Time |
|----------|-------------|--------------|----------------|
| JavaScript | ~2s | 50MB | <100ms |
| Python | ~3s | 80MB | <200ms |
| Java | ~5s | 200MB | <500ms |
| C++ | ~4s | 100MB | <300ms |
| Rust | ~8s | 150MB | <400ms |

### Scaling

```bash
# Scale specific sandboxes
docker-compose up -d --scale sandbox-node=5 --scale sandbox-python=3

# Load balancing
# The API server will automatically distribute requests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test with Docker
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Happy Coding in Docker! 🐳** 