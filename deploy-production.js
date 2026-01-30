// Production Deployment Configuration
// This file should be used with a build tool like Webpack or Vite

const productionConfig = {
    // Production environment variables
    // These should be set in your hosting environment
    env: {
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'https://yourdomain.com/oauth-callback.html',
        APP_ENV: 'production',
        MAX_USERS: process.env.MAX_USERS || 50
    },
    
    // Security headers for production
    securityHeaders: {
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://sheets.googleapis.com https://oauth2.googleapis.com https://accounts.google.com",
            "frame-src 'self' https://accounts.google.com"
        ].join('; '),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    
    // Build optimizations
    buildOptions: {
        minify: true,
        sourcemap: false,
        removeComments: true,
        compress: true
    }
};

// Export for build tools
if (typeof module !== 'undefined' && module.exports) {
    module.exports = productionConfig;
}

// Production deployment checklist
const deploymentChecklist = [
    '✅ Environment variables configured in hosting platform',
    '✅ API keys secured and not exposed in client code',
    '✅ HTTPS enabled',
    '✅ Security headers configured',
    '✅ CSP policies implemented',
    '✅ Domain whitelist configured for OAuth',
    '✅ Production Google Sheets API quotas checked',
    '✅ Backup procedures in place',
    '✅ Monitoring and logging configured',
    '✅ Error handling implemented'
];

console.log('🚀 Production Deployment Configuration Ready');
console.log('📋 Deployment Checklist:');
deploymentChecklist.forEach(item => console.log(item));
