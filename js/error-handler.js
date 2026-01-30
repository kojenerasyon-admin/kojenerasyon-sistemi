// Advanced Error Handling System
// User-friendly error messages with production safety

class ErrorHandler {
    constructor() {
        this.isProduction = this.detectEnvironment();
        this.errorLog = [];
        this.maxLogSize = 100;
        this.setupGlobalHandlers();
    }

    // Detect if running in production
    detectEnvironment() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // Production indicators
        return (
            hostname !== 'localhost' &&
            hostname !== '127.0.0.1' &&
            !hostname.includes('.dev') &&
            !hostname.includes('.local') &&
            protocol === 'https:'
        );
    }

    // Setup global error handlers
    setupGlobalHandlers() {
        // Catch unhandled JavaScript errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                stack: event.reason?.stack
            });
        });
    }

    // Main error handler
    handleError(error, context = {}) {
        // Sanitize error for production
        const sanitizedError = this.sanitizeError(error);
        
        // Log error
        this.logError(sanitizedError, context);
        
        // Show user-friendly message
        this.showUserMessage(sanitizedError);
        
        // Report to monitoring service in production
        if (this.isProduction) {
            this.reportError(sanitizedError, context);
        }
    }

    // Sanitize error for production
    sanitizeError(error) {
        if (this.isProduction) {
            return {
                type: error.type || 'unknown',
                userMessage: this.getUserFriendlyMessage(error),
                timestamp: new Date().toISOString(),
                severity: this.getErrorSeverity(error),
                // Include minimal technical info for debugging
                errorCode: this.generateErrorCode(),
                // Remove sensitive information
                stack: undefined,
                filename: undefined,
                lineno: undefined,
                colno: undefined
            };
        } else {
            // Development: include full error details
            return {
                type: error.type || 'unknown',
                message: error.message,
                userMessage: this.getUserFriendlyMessage(error),
                timestamp: new Date().toISOString(),
                severity: this.getErrorSeverity(error),
                stack: error.stack,
                filename: error.filename,
                lineno: error.lineno,
                colno: error.colno,
                context: error.context
            };
        }
    }

    // Get user-friendly error message
    getUserFriendlyMessage(error) {
        const errorMappings = {
            'network': 'İnternet bağlantınızda bir sorun var. Lütfen bağlantınızı kontrol edin.',
            'authentication': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
            'authorization': 'Bu işlemi yapmaya yetkiniz yok.',
            'validation': 'Girdiğiniz bilgilerde hata var. Lütfen kontrol edin.',
            'not_found': 'İstediğiniz sayfa veya veri bulunamadı.',
            'server_error': 'Sunucuda bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
            'timeout': 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
            'quota_exceeded': 'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
            'permission_denied': 'Bu işlem için izniniz yok.',
            'configuration': 'Sistem yapılandırmasında hata var. Lütfen yönetici ile iletişime geçin.',
            'google_sheets': 'Google Sheets bağlantısında sorun var. Lütfen API ayarlarını kontrol edin.',
            'javascript': 'Uygulamada bir teknik sorun oluştu. Sayfayı yenilemeyi deneyin.',
            'promise': 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
        };

        // Try to match error type
        if (error.type && errorMappings[error.type]) {
            return errorMappings[error.type];
        }

        // Try to match error message patterns
        const message = error.message?.toLowerCase() || '';
        
        if (message.includes('network') || message.includes('fetch')) {
            return errorMappings.network;
        }
        
        if (message.includes('auth') || message.includes('unauthorized')) {
            return errorMappings.authentication;
        }
        
        if (message.includes('permission') || message.includes('forbidden')) {
            return errorMappings.authorization;
        }
        
        if (message.includes('validation') || message.includes('invalid')) {
            return errorMappings.validation;
        }
        
        if (message.includes('not found') || message.includes('404')) {
            return errorMappings.not_found;
        }
        
        if (message.includes('server') || message.includes('500')) {
            return errorMappings.server_error;
        }
        
        if (message.includes('timeout') || message.includes('time out')) {
            return errorMappings.timeout;
        }
        
        if (message.includes('quota') || message.includes('limit')) {
            return errorMappings.quota_exceeded;
        }
        
        if (message.includes('google') || message.includes('sheets')) {
            return errorMappings.google_sheets;
        }

        // Default message
        return 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }

    // Get error severity
    getErrorSeverity(error) {
        const highSeverityErrors = ['server_error', 'authentication', 'authorization', 'configuration'];
        const mediumSeverityErrors = ['network', 'timeout', 'quota_exceeded'];
        
        if (highSeverityErrors.includes(error.type)) {
            return 'high';
        }
        
        if (mediumSeverityErrors.includes(error.type)) {
            return 'medium';
        }
        
        return 'low';
    }

    // Generate unique error code for tracking
    generateErrorCode() {
        return 'ERR-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
    }

    // Log error to console (development only)
    logError(error, context) {
        // Add to internal log
        this.errorLog.push({
            ...error,
            context,
            id: this.generateErrorCode()
        });

        // Limit log size
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(-this.maxLogSize);
        }

        // Console logging (development only)
        if (!this.isProduction) {
            console.group(`🚨 Error [${error.type}]`);
            console.error('Message:', error.message);
            console.error('User Message:', error.userMessage);
            console.error('Severity:', error.severity);
            console.error('Timestamp:', error.timestamp);
            if (error.stack) console.error('Stack:', error.stack);
            if (context) console.error('Context:', context);
            console.groupEnd();
        }
    }

    // Show user-friendly message
    showUserMessage(error) {
        // Remove existing alerts
        this.clearExistingAlerts();

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${this.getAlertClass(error.severity)}`;
        alert.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">${this.getAlertIcon(error.severity)}</div>
                <div class="alert-message">
                    <strong>${this.getAlertTitle(error.severity)}</strong>
                    <p>${error.userMessage}</p>
                    ${error.errorCode ? `<small class="alert-code">Hata Kodu: ${error.errorCode}</small>` : ''}
                </div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(alert);

        // Auto-remove after timeout
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, this.getAlertTimeout(error.severity));
    }

    // Clear existing alerts
    clearExistingAlerts() {
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
    }

    // Get alert class based on severity
    getAlertClass(severity) {
        const classes = {
            'high': 'error',
            'medium': 'warning',
            'low': 'info'
        };
        return classes[severity] || 'info';
    }

    // Get alert icon based on severity
    getAlertIcon(severity) {
        const icons = {
            'high': '❌',
            'medium': '⚠️',
            'low': 'ℹ️'
        };
        return icons[severity] || 'ℹ️';
    }

    // Get alert title based on severity
    getAlertTitle(severity) {
        const titles = {
            'high': 'Hata',
            'medium': 'Uyarı',
            'low': 'Bilgi'
        };
        return titles[severity] || 'Bilgi';
    }

    // Get alert timeout based on severity
    getAlertTimeout(severity) {
        const timeouts = {
            'high': 10000,  // 10 seconds
            'medium': 7000, // 7 seconds
            'low': 5000    // 5 seconds
        };
        return timeouts[severity] || 5000;
    }

    // Report error to monitoring service (production)
    reportError(error, context) {
        // In production, send to error monitoring service
        // This is a placeholder for services like Sentry, Bugsnag, etc.
        
        try {
            // Example: Send to your error tracking endpoint
            fetch('/api/errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error,
                    context,
                    userAgent: navigator.userAgent,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                })
            }).catch(() => {
                // Silently fail if error reporting fails
            });
        } catch (e) {
            // Silently ignore error reporting failures
        }
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            bySeverity: {},
            recent: this.errorLog.slice(-10)
        };

        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
        });

        return stats;
    }

    // Clear error log
    clearErrorLog() {
        this.errorLog = [];
    }

    // Handle specific API errors
    handleApiError(response, error) {
        const apiError = {
            type: this.getApiErrorType(response?.status),
            message: error?.message || response?.statusText,
            status: response?.status,
            url: response?.url
        };

        this.handleError(apiError, { apiCall: true });
    }

    // Get API error type from status code
    getApiErrorType(status) {
        if (!status) return 'network';
        
        const statusMap = {
            400: 'validation',
            401: 'authentication',
            403: 'authorization',
            404: 'not_found',
            429: 'quota_exceeded',
            500: 'server_error',
            502: 'server_error',
            503: 'server_error',
            504: 'timeout'
        };

        return statusMap[status] || 'server_error';
    }
}

// Global error handler instance
const errorHandler = new ErrorHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = errorHandler;
} else {
    window.errorHandler = errorHandler;
}

// Global error handling functions
window.handleError = (error, context) => errorHandler.handleError(error, context);
window.handleApiError = (response, error) => errorHandler.handleApiError(response, error);
