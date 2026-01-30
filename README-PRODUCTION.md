# 🚀 Production Deployment Guide

## 📋 Overview

This guide covers the secure deployment of the Kojenerasyon Takip Sistemi to production environments.

## 🔐 Security Configuration

### 1. Environment Variables Setup

All sensitive data has been moved out of the source code and should be configured as environment variables:

```bash
# Google Sheets API Configuration
GOOGLE_API_KEY=your_production_google_api_key
GOOGLE_SPREADSHEET_ID=your_production_spreadsheet_id

# Google OAuth 2.0 Configuration  
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/oauth-callback.html

# Application Configuration
APP_ENV=production
MAX_USERS=50
```

### 2. Important Security Notes

⚠️ **CRITICAL**: Never commit actual API keys to version control!

- All API keys have been removed from source code
- Use `.env.example` as a template
- Configure environment variables in your hosting platform
- Regularly rotate API keys

## 🏗️ Deployment Steps

### Step 1: Initial Configuration

1. Visit `setup-config.html` to configure your application
2. Enter your production API keys and settings
3. Test the configuration in development first

### Step 2: Google Cloud Console Setup

1. **Create Production Project**
   - Separate from development project
   - Enable Google Sheets API
   - Set up production OAuth 2.0 credentials

2. **Configure OAuth 2.0**
   - Add production domain to authorized JavaScript origins
   - Set production redirect URI
   - Configure domain verification

3. **API Security**
   - Restrict API key to your production domain
   - Set appropriate quotas and limits
   - Enable API monitoring

### Step 3: Hosting Platform Configuration

#### For Vercel/Netlify:
```bash
# Set environment variables in platform dashboard
vercel env add GOOGLE_API_KEY production
vercel env add GOOGLE_CLIENT_ID production
# ... etc
```

#### For Docker/Traditional Hosting:
```bash
# Create .env file (never commit)
cp .env.example .env
# Edit .env with production values
```

### Step 4: Domain and SSL

1. **Domain Setup**
   - Configure DNS records
   - Enable HTTPS (SSL/TLS)
   - Set up domain verification with Google

2. **Security Headers**
   - CSP policies configured
   - HTTPS enforcement
   - Security headers enabled

## 🔧 Production Build

### Using Webpack/Vite

The `deploy-production.js` file contains production configuration:

```javascript
// Import production config
const productionConfig = require('./deploy-production.js');

// Configure build tool with production settings
```

### Build Commands

```bash
# Minify and optimize for production
npm run build

# Deploy to hosting platform
npm run deploy
```

## 📊 Monitoring and Maintenance

### 1. API Usage Monitoring

- Monitor Google Sheets API quotas
- Set up alerts for usage spikes
- Track error rates

### 2. Security Monitoring

- Regular security audits
- API key rotation schedule
- Access log monitoring

### 3. Backup Strategy

- Regular Google Sheets backups
- Configuration backups
- User data export procedures

## 🚨 Emergency Procedures

### If API Keys Are Compromised

1. Immediately revoke compromised keys in Google Cloud Console
2. Generate new API keys
3. Update environment variables
4. Rotate all OAuth credentials
5. Review access logs

### Service Outage Response

1. Check Google Sheets API status
2. Verify environment variables
3. Review error logs
4. Implement fallback procedures

## 📱 Mobile and Performance

### Optimization Checklist

- [ ] Images optimized and compressed
- [ ] CSS/JS minified
- [ ] Caching headers configured
- [ ] CDN configured for static assets
- [ ] Mobile responsiveness tested

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build for production
        run: npm run build
      - name: Deploy to production
        run: npm run deploy
        env:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
          # ... other secrets
```

## 📞 Support

For production deployment issues:

1. Check environment variables configuration
2. Verify Google Cloud Console settings
3. Review browser console for errors
4. Check network requests in browser dev tools

## 🎯 Success Metrics

Monitor these metrics post-deployment:

- Page load time < 3 seconds
- API response time < 1 second  
- Error rate < 1%
- Mobile usability score > 90
- Security scan passing

---

**⚠️ Remember**: Never expose API keys in client-side code. Always use environment variables for sensitive configuration.
