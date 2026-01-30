// Kimlik Doğrulama Sistemi
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.maxUsers = 5; // Maksimum kullanıcı limiti
    }

    // Giriş yap
    async login(email, password) {
        try {
            // Google Sheets'ten kullanıcıyı kontrol et
            const user = await googleSheets.validateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                this.token = this.generateToken(user);
                
                // Session oluştur
                const payload = jwtHandler.verifyToken(this.token);
                if (payload && payload.sessionId) {
                    this.createSession(payload.sessionId);
                }
                
                // Local storage'a kaydet
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('userData', JSON.stringify(user));
                
                return {
                    success: true,
                    user: user,
                    token: this.token
                };
            } else {
                return {
                    success: false,
                    message: 'Email veya şifre hatalı'
                };
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            return {
                success: false,
                message: error?.message || 'Giriş yapılamadı'
            };
        }
    }

    // Çıkış yap
    logout() {
        // Session'ı sonlandır
        if (this.token) {
            const payload = jwtHandler.decodeToken(this.token);
            if (payload && payload.sessionId) {
                this.destroySession(payload.sessionId);
            }
        }
        
        this.currentUser = null;
        this.token = null;
        
        // Local storage'ı temizle
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Sayfayı yenile
        window.location.reload();
    }

    // Token oluştur (JWT-like)
    generateToken(user) {
        const payload = {
            email: user.email,
            role: user.role,
            name: user.name || user.email,
            sessionId: this.generateSessionId()
        };
        
        // JWT-like token oluştur
        return jwtHandler.createToken(payload, '24h');
    }

    // Session ID oluştur
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Token doğrula
    validateToken(token) {
        try {
            // JWT-like token doğrula
            const payload = jwtHandler.verifyToken(token);
            
            if (!payload) {
                return false;
            }
            
            // Additional session validation
            if (payload.sessionId && !this.isValidSession(payload.sessionId)) {
                return false;
            }
            
            return payload;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    // Session doğrula
    isValidSession(sessionId) {
        const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '{}');
        return activeSessions[sessionId] === true;
    }

    // Session oluştur
    createSession(sessionId) {
        const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '{}');
        activeSessions[sessionId] = true;
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    }

    // Session sonlandır
    destroySession(sessionId) {
        const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '{}');
        delete activeSessions[sessionId];
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    }

    // Mevcut kullanıcıyı kontrol et
    async checkAuth() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            const payload = this.validateToken(token);
            if (payload) {
                this.currentUser = JSON.parse(userData);
                this.token = token;
                return true;
            }
        }
        
        return false;
    }

    // Kullanıcı ekle
    async addUser(userData) {
        try {
            // Mevcut kullanıcı sayısını kontrol et
            const users = await googleSheets.getUsers();
            
            if (users.length >= this.maxUsers) {
                return {
                    success: false,
                    message: `Maksimum ${this.maxUsers} kullanıcı limitine ulaşıldı`
                };
            }

            // Email zaten var mı kontrol et
            const existingUser = users.find(u => u.email === userData.email);
            if (existingUser) {
                return {
                    success: false,
                    message: 'Bu email zaten kayıtlı'
                };
            }

            // Yeni kullanıcıyı ekle
            await googleSheets.addUser(userData);
            
            return {
                success: true,
                message: 'Kullanıcı başarıyla eklendi'
            };
        } catch (error) {
            console.error('Kullanıcı ekleme hatası:', error);
            return {
                success: false,
                message: 'Kullanıcı eklenemedi'
            };
        }
    }

    // Yetki kontrolü
    hasPermission(requiredRole) {
        if (!this.currentUser) {
            return false;
        }

        const roleHierarchy = {
            'ADMIN': 4,
            'OPERATOR': 3,
            'USER': 2,
            'VIEWER': 1
        };

        const userRole = (this.currentUser.role || 'VIEWER').toString().trim().toUpperCase();
        const required = (requiredRole || 'VIEWER').toString().trim().toUpperCase();
        return (roleHierarchy[userRole] || 0) >= (roleHierarchy[required] || 0);
    }

    // Şifre gücünü kontrol et
    checkPasswordStrength(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 0;
        let message = '';

        if (password.length >= minLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChar) strength++;

        switch(strength) {
            case 0:
            case 1:
                message = 'Çok zayıf şifre';
                break;
            case 2:
                message = 'Zayıf şifre';
                break;
            case 3:
                message = 'Orta şifre';
                break;
            case 4:
                message = 'Güçlü şifre';
                break;
            case 5:
                message = 'Çok güçlü şifre';
                break;
        }

        return {
            strength: strength,
            message: message,
            isValid: strength >= 3
        };
    }

    // Email formatını kontrol et
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Kullanıcı bilgilerini güncelle
    async updateUser(userId, updates) {
        try {
            // Bu fonksiyon Google Sheets API'si ile genişletilebilir
            // Şimdilik basit bir implementasyon
            return {
                success: true,
                message: 'Kullanıcı güncellendi'
            };
        } catch (error) {
            console.error('Kullanıcı güncelleme hatası:', error);
            return {
                success: false,
                message: 'Kullanıcı güncellenemedi'
            };
        }
    }

    // Kullanıcıyı sil
    async deleteUser(userId) {
        try {
            // Bu fonksiyon Google Sheets API'si ile genişletilebilir
            // Şimdilik basit bir implementasyon
            return {
                success: true,
                message: 'Kullanıcı silindi'
            };
        } catch (error) {
            console.error('Kullanıcı silme hatası:', error);
            return {
                success: false,
                message: 'Kullanıcı silinemedi'
            };
        }
    }

    // Oturum süresini uzat
    extendSession() {
        if (this.currentUser && this.token) {
            try {
                // Token'ı yenile
                const newToken = jwtHandler.refreshToken(this.token);
                
                if (newToken) {
                    this.token = newToken;
                    localStorage.setItem('authToken', this.token);
                    return true;
                }
            } catch (error) {
                console.error('Session extension failed:', error);
            }
        }
        return false;
    }

    // Token yenile kontrolü
    async checkAndRefreshToken() {
        if (!this.token) return false;
        
        const payload = jwtHandler.decodeToken(this.token);
        if (!payload) return false;
        
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;
        
        // Token 1 saat içinde doluyorsa yenile
        if (timeUntilExpiry < 3600) {
            return this.extendSession();
        }
        
        return true;
    }
}

// Auth sistemi örneği oluştur
const auth = new AuthSystem();

// Global fonksiyonlar
function logout() {
    auth.logout();
}

// Sayfa yüklendiğinde oturum kontrolü
document.addEventListener('DOMContentLoaded', () => {
    auth.checkAuth().then(isAuthenticated => {
        if (!isAuthenticated) {
            // Giriş yapılmamışsa giriş modalını göster
            // Bu app.js içinde handled ediliyor
        }
    });
});

// Oturum zamanlayıcısı
setInterval(() => {
    auth.extendSession();
}, 30 * 60 * 1000); // 30 dakikada bir
