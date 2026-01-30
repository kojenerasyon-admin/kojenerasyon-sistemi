// Environment Configuration Manager
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        // For client-side applications, we'll use a config object
        // In production, these should be loaded from environment variables via a backend
        return {
            // Google Sheets API Configuration
            GOOGLE_API_KEY: localStorage.getItem('GOOGLE_API_KEY') || '',
            GOOGLE_SPREADSHEET_ID: localStorage.getItem('GOOGLE_SPREADSHEET_ID') || '',
            
            // Google OAuth 2.0 Configuration
            GOOGLE_CLIENT_ID: localStorage.getItem('GOOGLE_CLIENT_ID') || '',
            GOOGLE_CLIENT_SECRET: localStorage.getItem('GOOGLE_CLIENT_SECRET') || '',
            GOOGLE_REDIRECT_URI: localStorage.getItem('GOOGLE_REDIRECT_URI') || 'http://localhost:3000/oauth-callback.html',
            
            // Application Configuration
            APP_ENV: localStorage.getItem('APP_ENV') || 'development',
            MAX_USERS: parseInt(localStorage.getItem('MAX_USERS')) || 5
        };
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        localStorage.setItem(key, value);
    }

    // Initialize configuration from user input (for development)
    initializeFromUser(configData) {
        Object.keys(configData).forEach(key => {
            this.set(key, configData[key]);
        });
        
        // Re-load config after initialization
        this.config = this.loadConfig();
        
        return this.validate();
    }

    // Initialize configuration with fallback values
    initialize() {
        // Check if configuration exists in localStorage
        const hasConfig = localStorage.getItem('GOOGLE_API_KEY') || 
                         localStorage.getItem('GOOGLE_CLIENT_ID');
        
        if (!hasConfig) {
            console.warn('Configuration not found. Please run setup-config.html first.');
            return false;
        }
        
        // Validate existing configuration
        const validation = this.validate();
        if (!validation.isValid) {
            console.warn('Configuration incomplete. Missing:', validation.missing);
            return false;
        }
        
        console.log('Configuration loaded successfully.');
        return true;
    }

    // Validate required configuration
    validate() {
        const required = ['GOOGLE_API_KEY', 'GOOGLE_SPREADSHEET_ID', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
        const missing = required.filter(key => !this.get(key));
        
        return {
            isValid: missing.length === 0,
            missing: missing
        };
    }
}

// Global configuration instance
const config = new ConfigManager();

// Auto-initialize configuration
document.addEventListener('DOMContentLoaded', function() {
    config.initialize();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.config = config;
}
