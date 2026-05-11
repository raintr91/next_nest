#!/bin/bash

# Dashboard Web Service Runner
# This script starts the Nuxt.js dashboard service

echo "Starting AI Vision Dashboard Web Service..."
echo "=========================================="

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed. Please install pnpm first."
    echo "Run: npm install -g pnpm"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Start the development server
echo "Starting Nuxt development server for https://portal.base.com"
echo "Default Nuxt dev port remains 3004 unless NUXT_PORT overrides it"
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev