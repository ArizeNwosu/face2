# MedSpaGen Production Deployment Guide

## 🚀 Quick Start - Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Domain name (optional, but recommended)

### 1. Push to GitHub Repository
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial deployment commit with credit system"

# Push to GitHub
git remote add origin https://github.com/yourusername/medspagen.git
git branch -M main  
git push -u origin main
```

### 2. Deploy to Vercel
1. Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see section below)
5. Click "Deploy"

### 3. Configure Environment Variables on Vercel
In your Vercel project dashboard, go to Settings → Environment Variables and add:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyALILARKIqkQn9UsJ2fPfuR5ugO5CxK7ZI
VITE_FIREBASE_AUTH_DOMAIN=medspagen.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=medspagen
VITE_FIREBASE_STORAGE_BUCKET=medspagen.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1049567757938
VITE_FIREBASE_APP_ID=1:1049567757938:web:48defb6209935417df64eb

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_l45yVG06Y29ewgQq75DsojDh

# Google Gemini Configuration  
VITE_GEMINI_API_KEY=AIzaSyDMPMMs2yPXsOhNl74bkrXEhAq99sjTm7g

# Production Environment
NODE_ENV=production
```

## 🌐 Alternative Hosting Options

### Option 1: Netlify
1. Connect your GitHub repository to Netlify
2. Build settings: `npm run build`, publish directory: `dist`
3. Add environment variables in Site Settings → Environment Variables
4. Deploy automatically on git push

### Option 2: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
npm run build
firebase deploy --only hosting
```

### Option 3: Traditional Web Hosting (cPanel/WHM)
1. Run `npm run build` locally
2. Upload contents of `dist/` folder to public_html
3. Upload `public/api/schedule-demo.php` to handle form submissions
4. Ensure PHP is enabled on your server

## 📧 PHP Email Configuration (For Demo Form)

### For cPanel/Traditional Hosting
The `public/api/schedule-demo.php` file is ready to use. Just ensure:
1. PHP mail() function is enabled
2. Upload the file to your server
3. Test the demo form submission

### For Vercel (Serverless)
Use Vercel's serverless functions or integrate with a service like:
- SendGrid
- Mailgun  
- Resend
- EmailJS

## 🔧 Environment Variables Explanation

### Firebase (Required)
- `VITE_FIREBASE_*`: Frontend Firebase configuration
- Used for user authentication and database

### Stripe (Required for Payments)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Frontend Stripe key
- `STRIPE_SECRET_KEY`: Backend Stripe key (server-side only)
- `STRIPE_WEBHOOK_SECRET`: Webhook verification

### Gemini AI (Required for Video Generation)
- `VITE_GEMINI_API_KEY`: Google Gemini API for AI video generation

## ⚡ Performance Optimizations

### 1. Code Splitting (Optional)
Update `vite.config.ts` to reduce bundle size:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js']
        }
      }
    }
  }
});
```

### 2. CDN Integration
Enable Vercel's Edge Network or Cloudflare for global content delivery.

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use platform-specific environment variable management
- Rotate API keys regularly

### 2. Firebase Security Rules
Ensure proper Firestore security rules:
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /videos/{videoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Stripe Webhook Security
Implement webhook signature verification in production.

## 📊 Monitoring and Analytics

### 1. Error Tracking
Consider integrating:
- Sentry for error monitoring
- LogRocket for user session replay
- Google Analytics for user behavior

### 2. Performance Monitoring
- Vercel Analytics (built-in)
- Google PageSpeed Insights
- Web Vitals monitoring

## 🧪 Testing Production Build

### Local Testing
```bash
# Build and preview locally
npm run build
npm run preview

# Test on different devices
# Open http://localhost:4173
```

### Production Testing Checklist
- [ ] User registration works
- [ ] User login works  
- [ ] Video generation works
- [ ] Credit system functions properly
- [ ] Payment processing works
- [ ] Email forms work
- [ ] All pages load correctly
- [ ] Mobile responsiveness
- [ ] SSL certificate active
- [ ] Domain configured properly

## 🌍 Custom Domain Setup

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### DNS Configuration
Point your domain to:
- **Vercel**: Add CNAME to `cname.vercel-dns.com`
- **Netlify**: Add CNAME to `your-site-name.netlify.app`
- **Firebase**: Follow Firebase Hosting domain setup

## 🔄 Continuous Deployment

### Automatic Deployments
- **Vercel**: Deploys automatically on git push to main branch
- **Netlify**: Deploys on git push with build command
- **GitHub Actions**: Custom CI/CD pipeline (optional)

### Branch Deployments
- Create preview deployments for development branches
- Test features before merging to main
- Environment-specific configurations

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check all dependencies are installed
   - Verify environment variables are set
   - Review build logs for specific errors

2. **API Routes Not Working**
   - Verify serverless function configuration
   - Check environment variables on hosting platform
   - Test API endpoints independently

3. **Firebase Connection Issues**
   - Verify all Firebase environment variables
   - Check Firebase project settings
   - Ensure Firestore security rules allow access

4. **Stripe Payment Issues**
   - Verify publishable key vs secret key usage
   - Check webhook endpoint configuration
   - Test with Stripe's test mode first

## 📞 Support Contacts

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Firebase project setup complete
- [ ] Stripe account configured  
- [ ] Domain name ready (optional)
- [ ] SSL certificate will be auto-generated
- [ ] Email configuration tested

### Post-deployment Tasks
- [ ] Test all user flows
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Configure backup procedures
- [ ] Document production URLs
- [ ] Update team on new environment

## 🎯 Production URLs
After deployment, your app will be available at:
- **Vercel**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://your-domain.com`
- **API Endpoints**: `https://your-domain.com/api/*`

---

## Quick Deploy Commands

```bash
# 1. Commit all changes
git add .
git commit -m "Production deployment ready"
git push origin main

# 2. Deploy to Vercel (after connecting repo)
npx vercel --prod

# 3. Deploy to Netlify  
npx netlify-cli deploy --prod --dir=dist

# 4. Deploy to Firebase
npm run build && firebase deploy
```

Your MedSpaGen application is now ready for production! 🚀