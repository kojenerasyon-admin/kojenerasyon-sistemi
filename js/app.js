// Ana Uygulama Mantığı
class KojenerasyonApp {
    constructor() {
        this.currentPage = 'overview';
        this.userData = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Check configuration first
            const configValidation = config.validate();
            if (!configValidation.isValid) {
                console.error('Configuration incomplete. Missing:', configValidation.missing);
                alert('Yapılandırma eksik! Lütfen setup-config.html sayfasını açarak gerekli ayarları yapın.');
                window.location.href = 'setup-config.html';
                return;
            }
            
            this.checkAuthentication();
            this.loadDashboardData();
        });
    }



    showSection(sectionName) {
        // Tüm section'ları gizle
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
        
        // Tüm menu item'ları pasif yap
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => item.classList.remove('active'));
        
        // İstenen section'ı göster
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // İlgili menu item'ı aktif yap
        const targetMenuItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }
        
        // Başlık ve açıklamayı güncelle
        const titleElement = document.getElementById('section-title');
        const descriptionElement = document.getElementById('section-description');
        
        if (sectionName === 'overview') {
            titleElement.textContent = 'Kontrol Paneli';
            descriptionElement.textContent = 'Sistem genel bakış';
        }
        
        this.currentPage = sectionName;
    }

    updateMenuItems(activeSection) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => item.classList.remove('active'));

        // Sadece overview var, direkt aktif yap
        if (activeSection === 'overview') {
            const items = document.querySelectorAll('.menu-item');
            if (items[0]) {
                items[0].classList.add('active');
            }
        }
    }


    async loadDashboardData() {
        try {
            // Google Sheets'ten motor verilerini çek
            const sheetData = await googleSheets.getMotorData();
            
            const motorData = {
                gm1: {
                    hours: sheetData.gm1.totalHours || '0.0',
                    power: sheetData.gm1.totalPower || '0.00',
                    hourlyAvg: sheetData.gm1.hourlyAvg || '0.00',
                    dailyHours: sheetData.gm1.dailyHours || '0.0',
                    dailyProduction: sheetData.gm1.dailyProduction || '0.00'
                },
                gm2: {
                    hours: sheetData.gm2.totalHours || '0.0',
                    power: sheetData.gm2.totalPower || '0.00',
                    hourlyAvg: sheetData.gm2.hourlyAvg || '0.00',
                    dailyHours: sheetData.gm2.dailyHours || '0.0',
                    dailyProduction: sheetData.gm2.dailyProduction || '0.00'
                },
                gm3: {
                    hours: sheetData.gm3.totalHours || '0.0',
                    power: sheetData.gm3.totalPower || '0.00',
                    hourlyAvg: sheetData.gm3.hourlyAvg || '0.00',
                    dailyHours: sheetData.gm3.dailyHours || '0.0',
                    dailyProduction: sheetData.gm3.dailyProduction || '0.00'
                }
            };
            
            this.updateMotorCards(motorData);
            
            // Google Sheets'ten buhar verilerini çek
            const steamData = await googleSheets.getSteamData();
            
            if (steamData) {
                this.updateSteamCards(steamData);
            } else {
                // Mock buhar verisi
                const mockSteamData = {
                    monthlyTotal: (Math.random() * 2000 + 1000).toFixed(2),
                    latestDate: new Date(Date.now() - 86400000).toLocaleDateString('tr-TR'),
                    latestValue: (Math.random() * 100 + 50).toFixed(2),
                    updateTime: new Date().toLocaleString('tr-TR')
                };
                this.updateSteamCards(mockSteamData);
            }
            
            // Admin ise düzenleme butonlarını göster
            this.checkAdminStatus();
            
        } catch (error) {
            console.error('Dashboard verileri yüklenemedi:', error);
            this.showError('Dashboard verileri yüklenemedi');
            // Hata durumunda mock verileri kullan
            this.loadMockData();
        }
    }

    async loadMockData() {
        const mockData = {
            gm1: {
                hours: (Math.random() * 1000 + 500).toFixed(1),
                power: (Math.random() * 50 + 10).toFixed(2),
                hourlyAvg: (Math.random() * 10 + 2).toFixed(2),
                dailyHours: (Math.random() * 24).toFixed(1),
                dailyProduction: (Math.random() * 100 + 20).toFixed(2)
            },
            gm2: {
                hours: (Math.random() * 1000 + 500).toFixed(1),
                power: (Math.random() * 50 + 10).toFixed(2),
                hourlyAvg: (Math.random() * 10 + 2).toFixed(2),
                dailyHours: (Math.random() * 24).toFixed(1),
                dailyProduction: (Math.random() * 100 + 20).toFixed(2)
            },
            gm3: {
                hours: (Math.random() * 1000 + 500).toFixed(1),
                power: (Math.random() * 50 + 10).toFixed(2),
                hourlyAvg: (Math.random() * 10 + 2).toFixed(2),
                dailyHours: (Math.random() * 24).toFixed(1),
                dailyProduction: (Math.random() * 100 + 20).toFixed(2)
            }
        };
        
        this.updateMotorCards(mockData);
    }

    checkAdminStatus() {
        // Kullanıcının admin olup olmadığını kontrol et
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const isAdmin = userData.role === 'ADMIN' || userData.role === 'admin';
        
        if (isAdmin) {
            // Admin ise düzenleme butonlarını göster
            document.querySelectorAll('.status-edit-btn').forEach(btn => {
                btn.style.display = 'flex';
            });
        } else {
            // Admin değilse butonları gizle
            document.querySelectorAll('.status-edit-btn').forEach(btn => {
                btn.style.display = 'none';
            });
        }
        
        return isAdmin;
    }


    updateMotorCards(motorData) {
        // Motor listesi - DRY principle
        const motors = ['gm1', 'gm2', 'gm3'];
        
        // Her motor için aynı işlemi loop ile yap
        motors.forEach(motor => {
            const data = motorData[motor];
            if (!data) return;
            
            // Motor verilerini güncelle
            const fields = ['hours', 'power', 'hourly-avg', 'daily-hours', 'daily-production'];
            fields.forEach(field => {
                const element = document.getElementById(`${motor}-${field}`);
                if (element) {
                    element.textContent = data[field.replace(/-/g, '')] || '0.00';
                }
            });
        });
    }

    updateSteamCards(steamData) {
        // Buhar üretim kartını güncelle
        document.getElementById('monthly-steam-production').textContent = steamData.monthlyTotal;
        document.getElementById('latest-steam-production').textContent = steamData.latestValue;
        document.getElementById('steam-update').textContent = steamData.updateTime;
    }



    checkAuthentication() {
        const token = localStorage.getItem('authToken');
        const storedUserDataRaw = localStorage.getItem('userData');
        const storedUserData = storedUserDataRaw ? JSON.parse(storedUserDataRaw) : null;

        // Sadece token var diye otomatik giriş yapma.
        // Kullanıcı verisi yoksa/bozuksa login ekranına dön.
        if (token && storedUserData && storedUserData.email) {
            this.isAuthenticated = true;
            this.userData = storedUserData;
            this.updateUserInfo();
            this.showDashboard();
            return;
        }

        // Geçersiz oturumu temizle
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.isAuthenticated = false;
        this.userData = null;
        this.showLogin();
    }

    updateUserInfo() {
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (this.userData) {
            if (userNameElement) userNameElement.textContent = this.userData.name;
            if (userRoleElement) userRoleElement.textContent = this.userData.role;
            if (userAvatarElement) userAvatarElement.textContent = this.userData.name.charAt(0).toUpperCase();
        }
    }

    showLogin() {
        document.getElementById('login-container').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        this.loadDashboardData();
        this.checkAdminStatus();
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            if (email && password) {
                console.log('Giriş denemesi:', email);
                
                // Google Sheets'ten kullanıcı doğrula
                const user = await googleSheets.validateUser(email, password);
                
                if (user) {
                    console.log('Giriş başarılı:', user);
                    this.isAuthenticated = true;
                    this.userData = user;
                    localStorage.setItem('authToken', 'token-' + Date.now());
                    localStorage.setItem('userData', JSON.stringify(user));
                    
                    this.showDashboard();
                    this.updateUserInfo();
                    this.showSuccess('Giriş başarılı');
                    this.checkAdminStatus();
                } else {
                    console.log('Giriş başarısız: Kullanıcı bulunamadı veya şifre hatalı');
                    // Güvenlik: başarısız girişte state'i ve localStorage'ı temizle
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    this.isAuthenticated = false;
                    this.userData = null;
                    this.showError('Email veya şifre hatalı');
                }
            } else {
                this.showError('Lütfen email ve şifre girin');
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            // Güvenlik: hata durumunda state'i ve localStorage'ı temizle
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            this.isAuthenticated = false;
            this.userData = null;
            this.showError('Giriş yapılamadı. Lütfen bağlantınızı kontrol edin.');
        }
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showInfo(message) {
        this.showAlert(message, 'info');
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container');
        if (!alertContainer) return;

        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <div class="alert-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</div>
            <div>${message}</div>
        `;
        
        alertContainer.appendChild(alert);

        setTimeout(() => alert.classList.add('show'), 100);
        
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }
}

// Global fonksiyonlar
function showSection(sectionName) {
    app.showSection(sectionName);
}


function toggleMotorStatus(motorId) {
    console.log('Durum değiştirme:', motorId);
    
    // Kullanıcının admin olup olmadığını kontrol et
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isAdmin = userData.role === 'ADMIN' || userData.role === 'admin';
    
    console.log('Kullanıcı rolü:', userData.role);
    console.log('Admin mi:', isAdmin);
    
    if (!isAdmin) {
        app.showError('Bu işlemi yapmaya yetkiniz yok! Sadece adminler değiştirebilir.');
        return;
    }
    
    const statusElement = document.getElementById(`${motorId}-status`);
    if (!statusElement) {
        console.error('Status element bulunamadı:', motorId);
        return;
    }
    
    const currentStatus = statusElement.textContent.trim();
    const newStatus = currentStatus === 'AKTİF' ? 'PASİF' : 'AKTİF';
    
    statusElement.textContent = newStatus;
    statusElement.className = `motor-status clickable ${newStatus === 'AKTİF' ? 'active' : 'inactive'}`;
    
    console.log(`${motorId} durumu: ${newStatus}`);
    
    // Başarı mesajı
    app.showSuccess(`${motorId.toUpperCase()} durumu "${newStatus}" olarak güncellendi`);
}




function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    location.reload();
}

// Uygulamayı başlat
const app = new KojenerasyonApp();
