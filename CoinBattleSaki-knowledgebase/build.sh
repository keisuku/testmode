#!/bin/bash
# CoinBattleSaki Knowledge Base - Build Script
# Usage: ./build.sh [--python]

set -e

cd "$(dirname "$0")"

if [ "$1" = "--python" ]; then
    echo "🐍 Building with Python..."
    python3 tools/build_py.py
else
    echo "📦 Building with Node.js..."
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    node tools/build_node.js
fi

echo ""
echo "🎉 Done! Open site/index.html in your browser."
