#!/bin/bash

# MedSpaGen Production Deployment Script
# This script automates the deployment process

echo "🚀 Starting MedSpaGen deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Pre-deployment checklist:"

# Run type checking
echo "🔍 Running TypeScript type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript type check failed. Please fix errors before deploying."
    exit 1
fi
echo "✅ TypeScript type check passed"

# Build the application
echo "🔨 Building application for production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the build output for errors."
    exit 1
fi
echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

echo "📦 Build artifacts ready in dist/ directory"
echo "📊 Build size:"
du -sh dist/

echo ""
echo "🎯 Deployment options:"
echo "1. Vercel (Recommended)"
echo "2. Netlify"  
echo "3. Manual upload"
echo "4. Skip deployment (build only)"

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            echo "✅ Deployed to Vercel successfully!"
        else
            echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
            echo "   Then run: vercel --prod"
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
            echo "✅ Deployed to Netlify successfully!"
        else
            echo "⚠️  Netlify CLI not found. Install with: npm i -g netlify-cli"
            echo "   Then run: netlify deploy --prod --dir=dist"
        fi
        ;;
    3)
        echo "📁 Manual upload instructions:"
        echo "   1. Upload contents of dist/ folder to your web server"
        echo "   2. Upload public/api/schedule-demo.php for form handling"
        echo "   3. Configure environment variables on your server"
        echo "   4. Test the application"
        ;;
    4)
        echo "🏗️  Build completed. Skipping deployment."
        ;;
    *)
        echo "❌ Invalid option. Deployment skipped."
        ;;
esac

echo ""
echo "📝 Post-deployment checklist:"
echo "   □ Test user registration and login"
echo "   □ Test video generation with credit system"
echo "   □ Test payment processing"
echo "   □ Test demo form submission"
echo "   □ Verify all pages load correctly"
echo "   □ Check mobile responsiveness"
echo "   □ Confirm SSL certificate is active"

echo ""
echo "✨ Deployment process completed!"
echo "🌐 Your app should be available at your production URL"