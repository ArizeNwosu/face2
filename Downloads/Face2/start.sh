#!/bin/bash

# Clinical Photo Anonymizer - Startup Script

echo "🏥 Clinical Photo Anonymizer"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Create required directories
echo "📁 Setting up directories..."
mkdir -p uploads/originals outputs logs
echo "✅ Directories ready"

echo ""
echo "🚀 Starting Clinical Photo Anonymizer server..."
echo "   Access the app at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

# Load environment variables
if [ -f .env ]; then
  echo "🔑 Loading environment variables from .env..."
  source .env
fi

# Start the server
npm start > server.log 2>&1