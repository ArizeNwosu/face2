#!/bin/bash

# Set up Vercel environment variables from .env.production
echo "Setting up Vercel environment variables..."

# Firebase Configuration
echo "AIzaSyALILARKIqkQn9UsJ2fPfuR5ugO5CxK7ZI" | vercel env add VITE_FIREBASE_API_KEY production
echo "medspagen.firebaseapp.com" | vercel env add VITE_FIREBASE_AUTH_DOMAIN production  
echo "medspagen" | vercel env add VITE_FIREBASE_PROJECT_ID production
echo "medspagen.firebasestorage.app" | vercel env add VITE_FIREBASE_STORAGE_BUCKET production
echo "1049567757938" | vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
echo "1:1049567757938:web:48defb6209935417df64eb" | vercel env add VITE_FIREBASE_APP_ID production

# Stripe Configuration
echo "pk_live_l45yVG06Y29ewgQq75DsojDh" | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production

# Google Gemini AI Configuration  
echo "AIzaSyDMPMMs2yPXsOhNl74bkrXEhAq99sjTm7g" | vercel env add VITE_GEMINI_API_KEY production

# Production Environment
echo "production" | vercel env add NODE_ENV production

echo "All environment variables set!"