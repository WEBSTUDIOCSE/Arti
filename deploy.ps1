# Vercel Deployment Script for Windows PowerShell
# Usage: .\deploy.ps1 [environment]
# Environments: preview, uat, production

param(
    [Parameter(Position=0)]
    [ValidateSet("preview", "uat", "production")]
    [string]$Environment = "preview"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "🚀 Starting deployment to $Environment..." -ForegroundColor $Blue

# Check if Vercel token is provided
if (-not $env:VERCEL_TOKEN) {
    Write-Host "❌ VERCEL_TOKEN environment variable is required" -ForegroundColor $Red
    Write-Host "Set your token: `$env:VERCEL_TOKEN = 'your_token_here'"
    exit 1
}

# Check if Vercel CLI is installed
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor $Yellow
    npm install -g vercel@latest
}

# Clean up previous deployment artifacts
Write-Host "🧹 Cleaning up..." -ForegroundColor $Yellow
if (Test-Path ".vercel") { Remove-Item -Recurse -Force ".vercel" }
if (Test-Path "vercel.json") { Remove-Item -Force "vercel.json" }

# Create environment-specific vercel.json
Write-Host "⚙️ Configuring deployment..." -ForegroundColor $Yellow

switch ($Environment) {
    "production" {
        $ProjectName = "aarti-production"
        $ProdFlag = "--prod"
    }
    "uat" {
        $ProjectName = "aarti-uat"
        $ProdFlag = "--prod"
    }
    default {
        $ProjectName = "aarti-preview"
        $ProdFlag = ""
    }
}

$vercelConfig = @{
    version = 2
    name = $ProjectName
    public = $true
    github = @{
        enabled = $true
        silent = $false
    }
    env = @{
        NODE_ENV = "production"
        ENVIRONMENT = $Environment
    }
} | ConvertTo-Json -Depth 3

$vercelConfig | Out-File -FilePath "vercel.json" -Encoding utf8

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor $Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor $Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor $Yellow

if ($ProdFlag) {
    $DeploymentUrl = & vercel deploy $ProdFlag --token=$env:VERCEL_TOKEN --yes
} else {
    $DeploymentUrl = & vercel deploy --token=$env:VERCEL_TOKEN --yes
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor $Green
    Write-Host "🌐 URL: $DeploymentUrl" -ForegroundColor $Blue
    
    # Copy URL to clipboard
    try {
        $DeploymentUrl | Set-Clipboard
        Write-Host "📋 URL copied to clipboard" -ForegroundColor $Green
    } catch {
        # Clipboard not available, continue
    }
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor $Red
    exit 1
}
