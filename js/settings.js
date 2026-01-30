// Settings Management System
class SettingsManager {
    constructor() {
        this.isAdmin = false;
        this.init();
    }

    init() {
        // Check if user is admin and show settings menu
        this.checkAdminAccess();
        
        // Load settings when settings section is shown
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    checkAdminAccess() {
        // Check current user role
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        this.isAdmin = userData.role === 'admin' || userData.email === 'admin@kojenerasyon.com';
        
        // Show/hide settings menu based on admin status
        const settingsMenuItem = document.getElementById('settings-menu-item');
        if (settingsMenuItem) {
            settingsMenuItem.style.display = this.isAdmin ? 'block' : 'none';
        }
    }

    setupEventListeners() {
        // Add event listeners for settings forms
        const googleApiForm = document.getElementById('google-api-form');
        const appConfigForm = document.getElementById('app-config-form');
        
        if (googleApiForm) {
            googleApiForm.addEventListener('input', () => this.updateConfigStatus());
        }
        
        if (appConfigForm) {
            appConfigForm.addEventListener('input', () => this.updateConfigStatus());
        }
    }

    loadSettingsToForm() {
        // Load current configuration into form fields
        document.getElementById('settings-google-api-key').value = config.get('GOOGLE_API_KEY') || '';
        document.getElementById('settings-spreadsheet-id').value = config.get('GOOGLE_SPREADSHEET_ID') || '';
        document.getElementById('settings-client-id').value = config.get('GOOGLE_CLIENT_ID') || '';
        document.getElementById('settings-client-secret').value = config.get('GOOGLE_CLIENT_SECRET') || '';
        document.getElementById('settings-redirect-uri').value = config.get('GOOGLE_REDIRECT_URI') || 'http://localhost:3000/oauth-callback.html';
        document.getElementById('settings-app-env').value = config.get('APP_ENV') || 'development';
        document.getElementById('settings-max-users').value = config.get('MAX_USERS') || 5;
        
        // Update status display
        this.updateConfigStatus();
    }

    updateConfigStatus() {
        const hasApiKey = document.getElementById('settings-google-api-key').value.length > 0;
        const hasClientId = document.getElementById('settings-client-id').value.length > 0;
        const hasClientSecret = document.getElementById('settings-client-secret').value.length > 0;
        const hasSpreadsheetId = document.getElementById('settings-spreadsheet-id').value.length > 0;
        
        // Update status indicators
        document.getElementById('status-google-api').textContent = hasApiKey ? '✅ Yapılandırıldı' : '❌ Yapılandırılmamış';
        document.getElementById('status-oauth').textContent = (hasClientId && hasClientSecret) ? '✅ Yapılandırıldı' : '❌ Yapılandırılmamış';
        document.getElementById('status-spreadsheet').textContent = hasSpreadsheetId ? '✅ Yapılandırıldı' : '❌ Yapılandırılmamış';
        
        const overallStatus = hasApiKey && hasClientId && hasClientSecret && hasSpreadsheetId;
        document.getElementById('status-overall').textContent = overallStatus ? '✅ Tamamlandı' : '❌ Eksik';
        document.getElementById('status-overall').style.color = overallStatus ? '#27ae60' : '#e74c3c';
    }

    saveConfiguration() {
        if (!this.isAdmin) {
            showAlert('Bu işlemi yapmaya yetkiniz yok!', 'error');
            return;
        }

        const configData = {
            GOOGLE_API_KEY: document.getElementById('settings-google-api-key').value,
            GOOGLE_SPREADSHEET_ID: document.getElementById('settings-spreadsheet-id').value,
            GOOGLE_CLIENT_ID: document.getElementById('settings-client-id').value,
            GOOGLE_CLIENT_SECRET: document.getElementById('settings-client-secret').value,
            GOOGLE_REDIRECT_URI: document.getElementById('settings-redirect-uri').value,
            APP_ENV: document.getElementById('settings-app-env').value,
            MAX_USERS: document.getElementById('settings-max-users').value
        };

        try {
            const validation = config.initializeFromUser(configData);
            
            if (validation.isValid) {
                showAlert('Yapılandırma başarıyla kaydedildi!', 'success');
                this.updateConfigStatus();
            } else {
                showAlert('Yapılandırma eksik: ' + validation.missing.join(', '), 'error');
            }
        } catch (error) {
            showAlert('Yapılandırma kaydedilemedi: ' + error.message, 'error');
        }
    }

    async testConfiguration() {
        if (!this.isAdmin) {
            showAlert('Bu işlemi yapmaya yetkiniz yok!', 'error');
            return;
        }

        showAlert('Yapılandırma test ediliyor...', 'info');
        
        try {
            // Test Google Sheets API connection
            const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.get('GOOGLE_SPREADSHEET_ID')}?key=${config.get('GOOGLE_API_KEY')}`;
            
            const response = await fetch(testUrl);
            
            if (response.ok) {
                const data = await response.json();
                showAlert('✅ Google Sheets API bağlantısı başarılı! Spreadsheet: ' + data.properties.title, 'success');
            } else {
                throw new Error('API bağlantısı başarısız: ' + response.statusText);
            }
        } catch (error) {
            showAlert('❌ Yapılandırma testi başarısız: ' + error.message, 'error');
        }
    }

    resetConfiguration() {
        if (!this.isAdmin) {
            showAlert('Bu işlemi yapmaya yetkiniz yok!', 'error');
            return;
        }

        if (confirm('Tüm yapılandırma ayarlarını sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                // Clear all configuration from localStorage
                localStorage.removeItem('GOOGLE_API_KEY');
                localStorage.removeItem('GOOGLE_SPREADSHEET_ID');
                localStorage.removeItem('GOOGLE_CLIENT_ID');
                localStorage.removeItem('GOOGLE_CLIENT_SECRET');
                localStorage.removeItem('GOOGLE_REDIRECT_URI');
                localStorage.removeItem('APP_ENV');
                localStorage.removeItem('MAX_USERS');
                
                // Reload config
                config.config = config.loadConfig();
                
                // Clear form fields
                this.loadSettingsToForm();
                
                showAlert('Yapılandırma başarıyla sıfırlandı!', 'success');
            } catch (error) {
                showAlert('Yapılandırma sıfırlanamadı: ' + error.message, 'error');
            }
        }
    }
}

// Global settings manager instance
const settingsManager = new SettingsManager();

// Global functions for HTML onclick handlers
function saveConfiguration() {
    settingsManager.saveConfiguration();
}

function testConfiguration() {
    settingsManager.testConfiguration();
}

function resetConfiguration() {
    settingsManager.resetConfiguration();
}

// Update showSection function to handle settings
const originalShowSection = window.showSection;
window.showSection = function(sectionName) {
    // Call original function if it exists
    if (originalShowSection) {
        originalShowSection(sectionName);
    }
    
    // Load settings when settings section is shown
    if (sectionName === 'settings') {
        settingsManager.loadSettingsToForm();
    }
    
    // Update section title and description for settings
    if (sectionName === 'settings') {
        const titleElement = document.getElementById('section-title');
        const descriptionElement = document.getElementById('section-description');
        
        if (titleElement) titleElement.textContent = 'Sistem Ayarları';
        if (descriptionElement) descriptionElement.textContent = 'API anahtarları ve sistem yapılandırması';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = settingsManager;
}
