#!/bin/bash

# Vercel Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: preview, uat, production

set -e

ENVIRONMENT=${1:-preview}
VERCEL_TOKEN=${VERCEL_TOKEN:-}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment to ${ENVIRONMENT}...${NC}"

# Check if Vercel token is provided
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ VERCEL_TOKEN environment variable is required${NC}"
    echo "Export your token: export VERCEL_TOKEN=your_token_here"
    exit 1
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm install -g vercel@latest
fi

# Clean up previous deployment artifacts
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
rm -rf .vercel
rm -f vercel.json

# Create environment-specific vercel.json
echo -e "${YELLOW}⚙️ Configuring deployment...${NC}"

case $ENVIRONMENT in
    "production")
        PROJECT_NAME="aarti-production"
        PROD_FLAG="--prod"
        ;;
    "uat")
        PROJECT_NAME="aarti-uat"
        PROD_FLAG="--prod"
        ;;
    *)
        PROJECT_NAME="aarti-preview"
        PROD_FLAG=""
        ;;
esac

cat > vercel.json << EOF
{
  "version": 2,
  "name": "${PROJECT_NAME}",
  "public": true,
  "github": {
    "enabled": true,
    "silent": false
  },
  "env": {
    "NODE_ENV": "production",
    "ENVIRONMENT": "${ENVIRONMENT}"
  }
}
EOF

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
DEPLOYMENT_URL=$(vercel deploy $PROD_FLAG --token=$VERCEL_TOKEN --yes)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${BLUE}🌐 URL: ${DEPLOYMENT_URL}${NC}"
    
    # Copy URL to clipboard if available
    if command -v pbcopy &> /dev/null; then
        echo $DEPLOYMENT_URL | pbcopy
        echo -e "${GREEN}📋 URL copied to clipboard${NC}"
    elif command -v xclip &> /dev/null; then
        echo $DEPLOYMENT_URL | xclip -selection clipboard
        echo -e "${GREEN}📋 URL copied to clipboard${NC}"
    fi
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
