#!/bin/bash

# MedSpaGen Multi-Platform Deployment Script
echo "🚀 Starting multi-platform deployment..."

# Build the application first
echo "🔨 Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Deploy to multiple platforms
echo "📦 Deploying to multiple platforms..."

# 1. Deploy to Vercel (already configured)
echo "1️⃣ Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod --yes
    VERCEL_STATUS=$?
    if [ $VERCEL_STATUS -eq 0 ]; then
        echo "✅ Vercel deployment successful"
    else
        echo "⚠️ Vercel deployment failed"
    fi
else
    echo "⚠️ Vercel CLI not found"
fi

echo ""

# 2. Deploy to Netlify (if authenticated)
echo "2️⃣ Deploying to Netlify..."
if command -v netlify &> /dev/null; then
    netlify deploy --prod --dir=dist &
    NETLIFY_PID=$!
    sleep 5
    if kill -0 $NETLIFY_PID 2>/dev/null; then
        echo "⚠️ Netlify deployment in progress (requires authentication)"
        echo "   Please complete authentication in the browser"
        wait $NETLIFY_PID
        NETLIFY_STATUS=$?
        if [ $NETLIFY_STATUS -eq 0 ]; then
            echo "✅ Netlify deployment successful"
        else
            echo "⚠️ Netlify deployment failed or requires setup"
        fi
    else
        echo "⚠️ Netlify deployment requires authentication"
    fi
else
    echo "⚠️ Netlify CLI not found"
fi

echo ""

# 3. Push to GitHub (triggers GitHub Pages if configured)
echo "3️⃣ Pushing to GitHub (triggers GitHub Pages)..."
git add .
git commit -m "Update deployment configurations for multi-platform hosting

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>" --allow-empty
git push origin master
if [ $? -eq 0 ]; then
    echo "✅ GitHub push successful (GitHub Pages will deploy automatically)"
else
    echo "⚠️ GitHub push failed"
fi

echo ""
echo "🎉 Multi-platform deployment completed!"
echo ""
echo "🌐 Your MedSpaGen app should be available on:"
echo "   • Vercel: Check terminal output above"
echo "   • Netlify: Check terminal output above" 
echo "   • GitHub Pages: https://yourusername.github.io/Face2-bolt/"
echo ""
echo "📝 Next steps:"
echo "   1. Configure environment variables on each platform"
echo "   2. Set up custom domains if desired"
echo "   3. Test all deployments"