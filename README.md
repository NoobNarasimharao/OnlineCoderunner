# CodeRunner - Online Code Editor

A beautiful, modern online code editor that supports multiple programming languages. Write, run, and share code instantly without any authentication required.

![CodeRunner Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=CodeRunner+Online+Editor)

## ✨ Features

- **🌙 Dark/Light Theme** - Toggle between beautiful dark and light themes
- **📝 Multiple Languages** - Support for 12+ popular programming languages
- **⚡ Real-time Execution** - Execute code instantly with a powerful backend
- **🎨 Beautiful UI** - Modern, responsive design with smooth animations
- **📱 Responsive** - Works perfectly on desktop, tablet, and mobile
- **🔧 Customizable** - Adjustable font size and tab size
- **💾 Code Management** - Copy, download, and reset code easily
- **🚀 No Authentication** - Start coding immediately, no sign-up required
- **🔒 Secure Sandboxing** - Docker-based isolated execution environments

## 🛠️ Supported Languages

| Language | Icon | Extension | Status |
|----------|------|-----------|--------|
| JavaScript | ⚡ | .js | ✅ |
| Python | 🐍 | .py | ✅ |
| Java | ☕ | .java | ✅ |
| C++ | ⚙️ | .cpp | ✅ |
| C# | 🔷 | .cs | ✅ |
| PHP | 🐘 | .php | ✅ |
| Ruby | 💎 | .rb | ✅ |
| Go | 🐹 | .go | ✅ |
| Rust | 🦀 | .rs | ✅ |
| Swift | 🍎 | .swift | ✅ |
| Kotlin | 📱 | .kt | ✅ |
| TypeScript | 📘 | .ts | ✅ |

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended)

The easiest way to run CodeRunner is using Docker with secure sandboxed execution:

#### Prerequisites
- **Docker Desktop** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

#### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd coderunner_online

# Start everything with Docker
# On Windows:
start-docker.bat

# On Linux/Mac:
./start-docker.sh
```

#### Manual Docker Setup
```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Access the Application
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3001/api/health

### Option 2: Local Development Setup

For development without Docker:

#### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

#### Installation
```bash
# Clone the repository
git clone <repository-url>
cd coderunner_online

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Access the Application
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3001

## 🏗️ Architecture

### Docker Architecture (Production)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Sandboxes     │
│   (Nginx)       │◄──►│   (Node.js)     │◄──►│   (Docker)      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Features
- **🔒 Container Security**: Read-only filesystems, non-root users
- **🛡️ Code Execution**: Module blocking, timeout limits, memory limits
- **🚫 Blocked Operations**: File system access, network access, system calls
- **🧹 Automatic Cleanup**: Temporary files deleted after execution

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

| Language | Memory | Timeout | Container |
|----------|--------|---------|-----------|
| JavaScript | 256MB | 10s | sandbox-node |
| Python | 256MB | 10s | sandbox-python |
| Java | 512MB | 15s | sandbox-java |
| C++ | 512MB | 15s | sandbox-cpp |
| Rust | 512MB | 20s | sandbox-rust |
| Go | 512MB | 15s | sandbox-go |

## 🚀 Deployment

### Production with Docker

1. **Build production images**:
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

2. **Scale sandboxes**:
   ```bash
   docker-compose up -d --scale sandbox-node=3 --scale sandbox-python=2
   ```

3. **Monitor services**:
   ```bash
   docker-compose logs -f
   docker stats
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
```

## 🔍 Monitoring & Logs

### Docker Commands

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f server
docker-compose logs -f sandbox-node

# Check service health
docker-compose ps
curl http://localhost:3001/api/health

# Monitor resource usage
docker stats
```

### Health Checks

- **API Server**: http://localhost:3001/api/health
- **Frontend**: http://localhost:3000
- **Individual Sandboxes**: http://localhost:8080/health

## 🛠️ Development

### Adding a New Language

1. **Create sandbox Dockerfile**:
   ```dockerfile
   FROM language:version-alpine
   
   RUN addgroup -g 1011 -S sandbox && \
       adduser -S sandbox -u 1011
   
   COPY sandbox-executor.lang ./
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

# Test sandbox directly
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello World\")"}'
```

## 🔒 Security

### Container Security
- **Read-only filesystems** for all sandboxes
- **Non-root users** in all containers
- **No new privileges** security option
- **Temporary filesystems** for code execution
- **Resource limits** (CPU, memory, disk)

### Code Execution Security
- **Module blocking** - Dangerous modules are blocked
- **Timeout limits** - 10-20 seconds per execution
- **Memory limits** - 256-512MB per sandbox
- **File size limits** - 1MB max code size
- **Automatic cleanup** - Temporary files are deleted
- **Network isolation** - Sandboxes can't access external networks

### Blocked Operations
- File system access (`fs`, `os`, `path`)
- Network access (`http`, `https`, `socket`)
- Process control (`child_process`, `subprocess`)
- System calls (`eval`, `exec`, `compile`)
- Database access (`sqlite3`, `mysql`)
- Shell access (`bash`, `sh`)

## 🚨 Troubleshooting

### Common Issues

1. **Docker not running**:
   ```bash
   # Start Docker Desktop
   # Then run:
   docker-compose up --build
   ```

2. **Port conflicts**:
   ```bash
   # Check what's using the ports
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   ```

3. **Sandbox not responding**:
   ```bash
   docker-compose restart sandbox-node
   docker-compose logs sandbox-node
   ```

4. **Memory issues**:
   ```bash
   # Increase memory limits in docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 512M
   ```

### Performance Optimization

1. **Use multi-stage builds** for smaller images
2. **Optimize base images** with Alpine Linux
3. **Use volume mounts** for development
4. **Scale sandboxes** based on demand

## 📊 Performance Metrics

### Benchmarks

| Language | Startup Time | Memory Usage | Execution Time |
|----------|-------------|--------------|----------------|
| JavaScript | ~2s | 50MB | <100ms |
| Python | ~3s | 80MB | <200ms |
| Java | ~5s | 200MB | <500ms |
| C++ | ~4s | 100MB | <300ms |
| Rust | ~8s | 150MB | <400ms |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor component
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Vite](https://vitejs.dev/) - Fast build tool
- [Express.js](https://expressjs.com/) - Web framework
- [Docker](https://www.docker.com/) - Containerization platform

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your operating system, Docker version, and error messages

---

**Happy Coding! 🚀**


