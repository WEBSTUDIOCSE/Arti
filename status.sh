#!/bin/bash

# Vercel Deployment Status Check
# Usage: ./status.sh [deployment-url]

set -e

DEPLOYMENT_URL=${1:-}
VERCEL_TOKEN=${VERCEL_TOKEN:-}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${RED}❌ Deployment URL is required${NC}"
    echo "Usage: ./status.sh https://your-deployment-url.vercel.app"
    exit 1
fi

echo -e "${BLUE}🔍 Checking deployment status...${NC}"
echo -e "${YELLOW}URL: ${DEPLOYMENT_URL}${NC}"

# Check if the deployment is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" || echo "000")

case $HTTP_STATUS in
    200)
        echo -e "${GREEN}✅ Deployment is live and accessible${NC}"
        echo -e "${GREEN}🌐 Status: HTTP $HTTP_STATUS${NC}"
        ;;
    404)
        echo -e "${YELLOW}⚠️ Deployment not found${NC}"
        echo -e "${YELLOW}🌐 Status: HTTP $HTTP_STATUS${NC}"
        ;;
    500|502|503)
        echo -e "${RED}❌ Deployment has server errors${NC}"
        echo -e "${RED}🌐 Status: HTTP $HTTP_STATUS${NC}"
        ;;
    000)
        echo -e "${RED}❌ Cannot connect to deployment${NC}"
        echo -e "${RED}🌐 Status: Connection failed${NC}"
        ;;
    *)
        echo -e "${YELLOW}⚠️ Unexpected status${NC}"
        echo -e "${YELLOW}🌐 Status: HTTP $HTTP_STATUS${NC}"
        ;;
esac

# Check response time
echo -e "${BLUE}⏱️ Checking response time...${NC}"
RESPONSE_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$DEPLOYMENT_URL" || echo "N/A")
echo -e "${BLUE}🕐 Response time: ${RESPONSE_TIME}s${NC}"

# If Vercel token is available, get more details
if [ ! -z "$VERCEL_TOKEN" ]; then
    echo -e "${BLUE}📊 Fetching deployment details...${NC}"
    
    # Extract deployment ID from URL
    DEPLOYMENT_ID=$(echo "$DEPLOYMENT_URL" | sed 's/https:\/\///' | sed 's/\.vercel\.app.*//')
    
    if command -v vercel &> /dev/null; then
        echo -e "${YELLOW}📋 Deployment info:${NC}"
        vercel ls --token=$VERCEL_TOKEN 2>/dev/null | head -10 || echo "Could not fetch deployment list"
    fi
fi

echo -e "${GREEN}✨ Status check complete${NC}"
