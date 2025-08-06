#!/bin/bash

# CodeRunner Docker Startup Script
# This script sets up and starts the complete CodeRunner environment

set -e

echo "🐳 Starting CodeRunner Docker Environment..."
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose down --remove-orphans

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check API server
echo "Checking API server..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ API server is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ API server failed to start"
        docker-compose logs server
        exit 1
    fi
    sleep 2
done

# Check frontend
echo "Checking frontend..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend is healthy"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Frontend failed to start"
        docker-compose logs client
        exit 1
    fi
    sleep 2
done

# Check sandboxes
echo "Checking sandboxes..."
sandboxes=("sandbox-node" "sandbox-python" "sandbox-java" "sandbox-cpp" "sandbox-php" "sandbox-ruby" "sandbox-go" "sandbox-rust" "sandbox-typescript")

for sandbox in "${sandboxes[@]}"; do
    echo "Checking $sandbox..."
    if docker-compose ps $sandbox | grep -q "Up"; then
        echo "✅ $sandbox is running"
    else
        echo "⚠️  $sandbox is not running (this is normal if not all languages are needed)"
    fi
done

echo ""
echo "🎉 CodeRunner is ready!"
echo "=============================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/api/health"
echo ""
echo "📝 Available commands:"
echo "  docker-compose logs -f          # Follow all logs"
echo "  docker-compose logs -f server   # Follow server logs"
echo "  docker-compose logs -f client   # Follow client logs"
echo "  docker-compose down             # Stop all services"
echo "  docker-compose restart server   # Restart server"
echo ""
echo "🔒 Security features enabled:"
echo "  - Isolated sandboxes for each language"
echo "  - Resource limits and timeouts"
echo "  - Read-only filesystems"
echo "  - Non-root users"
echo "  - Network isolation"
echo ""
echo "Happy coding! 🚀" 