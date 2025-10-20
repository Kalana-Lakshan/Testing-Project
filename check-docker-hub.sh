#!/bin/bash
# Docker Hub availability checker
# Run this to check if Docker Hub is back online

echo "Checking Docker Hub availability..."
echo ""

# Try to pull a small test image
if docker pull hello-world 2>&1 | grep -q "Downloaded"; then
    echo "✅ Docker Hub is ONLINE!"
    echo ""
    echo "You can now build your containers:"
    echo "  docker-compose up -d --build"
    exit 0
else
    echo "❌ Docker Hub is still OFFLINE"
    echo ""
    echo "Current error:"
    docker pull hello-world 2>&1 | grep -i "error\|failed" | head -3
    echo ""
    echo "Please wait and try again later."
    echo "Check status: https://status.docker.com/"
    exit 1
fi
