#!/usr/bin/env python3
"""
Dashboard Web Service Runner
This script starts the Nuxt.js dashboard service
"""

import os
import sys
import subprocess
import platform

def check_pnpm():
    """Check if pnpm is installed"""
    try:
        subprocess.run(['pnpm', '--version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_dependencies():
    """Install npm dependencies"""
    print("Installing dependencies...")
    try:
        subprocess.run(['pnpm', 'install'], check=True)
        return True
    except subprocess.CalledProcessError:
        print("Error: Failed to install dependencies")
        return False

def start_dev_server():
    """Start the Nuxt development server"""
    print("Starting Nuxt development server for https://portal.base.com")
    print("Default Nuxt dev port remains 3004 unless NUXT_PORT overrides it")
    print("Press Ctrl+C to stop the server")
    print("")

    try:
        subprocess.run(['pnpm', 'dev'], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"Error: Failed to start development server: {e}")
        sys.exit(1)

def main():
    print("Starting AI Vision Dashboard Web Service...")
    print("=" * 50)

    # Check pnpm installation
    if not check_pnpm():
        print("Error: pnpm is not installed. Please install pnpm first.")
        print("Run: npm install -g pnpm")
        sys.exit(1)

    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Check and install dependencies
    if not os.path.exists('node_modules'):
        if not install_dependencies():
            sys.exit(1)

    # Start development server
    start_dev_server()

if __name__ == "__main__":
    main()