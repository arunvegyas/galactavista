#!/bin/bash

# Galactavista Development Setup Script

echo "🚀 Setting up Galactavista development environment..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v go &> /dev/null; then
        echo "❌ Go is not installed. Please install Go 1.21+"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker"
        exit 1
    fi
    
    echo "✅ All requirements met!"
}

# Setup backend
setup_backend() {
    echo "🔧 Setting up backend..."
    cd backend
    
    # Install Go dependencies
    go mod download
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << EOF
# Galactavista Backend Environment Configuration

# Server Configuration
PORT=8080
ENVIRONMENT=development

# Database Configuration
DATABASE_URL=postgres://postgres:password@localhost:5432/galactavista?sslmode=disable

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=168h

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=galactavista-uploads

# AI/ML Configuration
AI_MODEL_PATH=/path/to/ai/models
AI_PROCESSING_TIMEOUT=300

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Third-party API Keys
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Monitoring and Logging
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# Security
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15m
EOF
        echo "✅ Created .env file"
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    echo "🎨 Setting up frontend..."
    cd frontend
    
    # Install npm dependencies
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << EOF
# Galactavista Frontend Environment Configuration

# API Configuration
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WS_URL=ws://localhost:8080/ws

# Environment
REACT_APP_ENVIRONMENT=development

# Analytics (optional)
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Third-party Services
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
EOF
        echo "✅ Created .env file"
    fi
    
    cd ..
}

# Setup database with Docker
setup_database() {
    echo "🗄️ Setting up database..."
    
    # Create docker-compose.yml if it doesn't exist
    if [ ! -f docker-compose.yml ]; then
        cat > docker-compose.yml << EOF
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: galactavista
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF
        echo "✅ Created docker-compose.yml"
    fi
    
    # Start database services
    docker-compose up -d postgres redis
    
    echo "⏳ Waiting for database services to be ready..."
    sleep 10
    
    echo "✅ Database services started"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    
    # Backend tests
    cd backend
    go test ./...
    cd ..
    
    # Frontend tests
    cd frontend
    npm test -- --watchAll=false
    cd ..
}

# Start development servers
start_dev() {
    echo "🚀 Starting development servers..."
    
    # Start backend in background
    cd backend
    go run cmd/main.go &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend in background
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Development servers started!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8080"
    echo "📊 API Docs: http://localhost:8080/swagger/index.html"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
}

# Main setup function
main() {
    check_requirements
    setup_backend
    setup_frontend
    setup_database
    
    echo ""
    echo "🎉 Galactavista development environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Update .env files with your actual credentials"
    echo "2. Run './scripts/setup-dev.sh start' to start development servers"
    echo "3. Run './scripts/setup-dev.sh test' to run tests"
    echo ""
}

# Handle command line arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "start")
        start_dev
        ;;
    "test")
        run_tests
        ;;
    "db")
        setup_database
        ;;
    *)
        echo "Usage: $0 {setup|start|test|db}"
        echo "  setup: Complete development environment setup"
        echo "  start: Start development servers"
        echo "  test: Run all tests"
        echo "  db: Setup database only"
        exit 1
        ;;
esac 