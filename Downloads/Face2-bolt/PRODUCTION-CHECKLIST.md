# 📋 Production Deployment Checklist

## Pre-Deployment Requirements

### ✅ Code & Build
- [x] All TypeScript types are correct (`npm run type-check`)
- [x] Production build completes successfully (`npm run build`)
- [x] Credit system implemented and tested
- [x] Schedule demo form with PHP handler ready
- [x] All new features tested in development
- [x] No console errors or warnings
- [x] Build size optimized (< 2MB total)

### 🔧 Configuration Files Ready
- [x] `vercel.json` - Vercel deployment configuration
- [x] `netlify.toml` - Netlify deployment configuration
- [x] `.env.production` - Production environment variables template
- [x] `public/.htaccess` - Apache server configuration
- [x] `public/api/schedule-demo.php` - Email handler for demo form
- [x] GitHub Actions workflow for CI/CD

### 🌐 Hosting Platform Setup
Choose and complete ONE of the following:

#### Option A: Vercel (Recommended - Easiest)
- [ ] GitHub repository connected to Vercel
- [ ] Environment variables configured in Vercel dashboard
- [ ] Custom domain configured (optional)
- [ ] SSL certificate auto-provisioned

#### Option B: Netlify  
- [ ] GitHub repository connected to Netlify
- [ ] Build settings: Command=`npm run build`, Directory=`dist`
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)

#### Option C: Traditional Web Hosting (cPanel/WHM)
- [ ] PHP 7.4+ enabled on server
- [ ] Upload `dist/` contents to public_html
- [ ] Upload `public/api/schedule-demo.php` 
- [ ] Configure mail() function on server
- [ ] SSL certificate installed

### 🔑 Environment Variables Configuration
Configure these on your hosting platform:

#### Firebase (Required)
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`  
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`

#### Stripe (Required for Payments)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Backend: `STRIPE_SECRET_KEY`
- [ ] Backend: `STRIPE_WEBHOOK_SECRET`

#### AI Generation (Required)
- [ ] `VITE_GEMINI_API_KEY`

#### General
- [ ] `NODE_ENV=production`

## Deployment Process

### 🚀 Quick Deploy (Recommended)
```bash
# 1. Run the automated deployment script
./deploy.sh

# 2. Choose deployment option when prompted
# 3. Follow platform-specific instructions
```

### 🔧 Manual Deploy Steps

#### Step 1: Final Build
```bash
npm run build:production
```

#### Step 2A: Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Step 2B: Deploy to Netlify  
```bash
# Install Netlify CLI (if not installed)  
npm i -g netlify-cli

# Deploy to production
netlify deploy --prod --dir=dist
```

#### Step 2C: Manual Upload
1. Upload `dist/` contents to web server
2. Upload `public/api/schedule-demo.php`
3. Configure server environment variables
4. Test all functionality

## Post-Deployment Testing

### 🧪 Core Functionality Tests
- [ ] **Homepage loads correctly**
  - [ ] All sections visible
  - [ ] Navigation works
  - [ ] Responsive on mobile
  
- [ ] **User Authentication**
  - [ ] Registration works
  - [ ] Login works  
  - [ ] Logout works
  - [ ] User profiles load correctly

- [ ] **Credit System**
  - [ ] New users get 3 free credits
  - [ ] Credit display accurate in dashboard
  - [ ] Credit display accurate in generate page
  - [ ] Credits deduct after video generation
  - [ ] Generation blocked when no credits

- [ ] **Video Generation**  
  - [ ] Image upload works
  - [ ] Video generation completes
  - [ ] Download works
  - [ ] Videos play correctly
  - [ ] Error handling works

- [ ] **Payment System**
  - [ ] Stripe checkout loads
  - [ ] Test payments process
  - [ ] Subscription management works
  - [ ] Webhook handling (if applicable)

- [ ] **Demo Form**
  - [ ] Form submits successfully  
  - [ ] Email received at support@medspagen.com
  - [ ] Error handling works
  - [ ] Mobile form usability

### 📱 Cross-Platform Testing
- [ ] **Desktop Browsers**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Mobile Devices**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Responsive breakpoints
  - [ ] Touch interactions

### 🔒 Security & Performance
- [ ] **SSL Certificate**
  - [ ] HTTPS redirect works
  - [ ] Mixed content warnings resolved
  - [ ] Certificate valid and trusted

- [ ] **Performance**
  - [ ] Page load speed < 3 seconds
  - [ ] Images optimized
  - [ ] No console errors
  - [ ] Lighthouse score > 90

### 🎯 Production URLs
Document your live URLs:
- **Production Site**: `https://_______________`
- **API Endpoints**: `https://_______________/api/`  
- **Admin Dashboard**: `https://_______________/dashboard`

## Monitoring & Maintenance

### 📊 Setup Monitoring
- [ ] **Error Tracking**
  - [ ] Sentry or similar error monitoring
  - [ ] Console error monitoring
  - [ ] API error tracking

- [ ] **Analytics**
  - [ ] Google Analytics configured
  - [ ] User behavior tracking
  - [ ] Conversion tracking

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot or similar service
  - [ ] Alert notifications setup
  - [ ] Status page (optional)

### 🔄 Backup & Recovery
- [ ] **Database Backups**
  - [ ] Firebase automatic backups enabled
  - [ ] Regular export schedule
  - [ ] Recovery procedures documented

- [ ] **Code Backups**  
  - [ ] GitHub repository up-to-date
  - [ ] Tags for production releases
  - [ ] Rollback procedures ready

## Emergency Contacts & Procedures

### 🆘 Support Contacts
- **Firebase Support**: Firebase Console → Support
- **Stripe Support**: Stripe Dashboard → Help
- **Hosting Support**: Platform-specific support
- **Domain Provider**: DNS/Domain support

### 🔧 Common Issues & Solutions

#### Site Not Loading
1. Check DNS configuration
2. Verify SSL certificate 
3. Check hosting platform status
4. Review deployment logs

#### API Errors
1. Verify environment variables
2. Check API key quotas
3. Review server logs
4. Test endpoints independently

#### Payment Issues  
1. Check Stripe dashboard
2. Verify webhook endpoints
3. Test with Stripe test mode
4. Review error logs

## 🎉 Go-Live Announcement

### Marketing Checklist
- [ ] **Social Media**
  - [ ] Twitter announcement
  - [ ] LinkedIn post
  - [ ] Facebook update

- [ ] **Email Marketing**
  - [ ] Customer email blast
  - [ ] Partner notifications
  - [ ] Press release (if applicable)

- [ ] **SEO**
  - [ ] Google Search Console setup
  - [ ] Sitemap submitted
  - [ ] Meta descriptions optimized
  - [ ] Schema markup added

---

## 🚀 Production Launch Command

When everything above is complete, execute:

```bash
# Final deployment
./deploy.sh

# Announce go-live
echo "🎉 MedSpaGen is now LIVE in production!"
```

**Congratulations! Your MedSpaGen application is now live in production!** 🎊

---

### 📞 Need Help?

If you encounter any issues during deployment:
1. Check the `DEPLOYMENT.md` guide
2. Review platform-specific documentation  
3. Check community forums and GitHub issues
4. Contact platform support if needed

**Happy deploying!** 🚀