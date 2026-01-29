// Google Sheets API Entegrasyonu
class GoogleSheetsAPI {
    constructor() {
        this.apiKey = 'YOUR_API_KEY_HERE'; // Google Cloud Console'dan alacağınız API anahtarı
        this.spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // Google Sheets ID
        this.baseURL = 'https://sheets.googleapis.com/v4/spreadsheets';
    }

    // API anahtarını ayarla
    setApiKey(apiKey) {
        this.apiKey = 'AIzaSyCcF6wYrhr2i41qaBti9Rgaas1a5XcWnBk';
    }

    // Spreadsheet ID'yi ayarla
    setSpreadsheetId(spreadsheetId) {
        this.spreadsheetId = '1ulhuSPzsICrbNX0jAIqQcFeWcQBXifSAXWwJzfmmyCc';
    }

    // Genel API isteği gönder
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}/${this.spreadsheetId}/${endpoint}?key=${this.apiKey}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Google Sheets API hatası:', error);
            throw error;
        }
    }

    // Veri oku
    async readData(range) {
        try {
            const result = await this.makeRequest(`values/${range}`);
            return result.values || [];
        } catch (error) {
            console.error('Veri okuma hatası:', error);
            throw error;
        }
    }

    // Veri yaz
    async writeData(range, values) {
        const data = {
            values: values
        };

        try {
            const result = await this.makeRequest(`values/${range}?valueInputOption=USER_ENTERED`, 'PUT', data);
            return result;
        } catch (error) {
            console.error('Veri yazma hatası:', error);
            throw error;
        }
    }

    // Veri ekle
    async appendData(range, values) {
        const data = {
            values: values
        };

        try {
            const result = await this.makeRequest(`values/${range}:append?valueInputOption=USER_ENTERED`, 'POST', data);
            return result;
        } catch (error) {
            console.error('Veri ekleme hatası:', error);
            throw error;
        }
    }

    // Dashboard verilerini getir
    async getDashboardData() {
        try {
            // Son günün verilerini al
            const today = new Date().toISOString().split('T')[0];
            const dataRange = `'VeriGiris'!A2:D1000`; // VeriGiris sayfasından verileri al
            
            const values = await this.readData(dataRange);
            
            // Verileri işle
            const dashboardData = {
                dailyProduction: 0,
                efficiency: 0,
                activeUsers: 0,
                totalEntries: values.length
            };

            if (values.length > 0) {
                // Son günün verilerini bul
                const todayData = values.filter(row => row[0] === today);
                
                if (todayData.length > 0) {
                    // Günlük üretim (toplam)
                    dashboardData.dailyProduction = todayData.reduce((sum, row) => sum + parseFloat(row[1] || 0), 0);
                    
                    // Verimlilik hesapla (üretim / yakıt * 100)
                    const totalProduction = dashboardData.dailyProduction;
                    const totalFuel = todayData.reduce((sum, row) => sum + parseFloat(row[2] || 0), 0);
                    dashboardData.efficiency = totalFuel > 0 ? ((totalProduction / totalFuel) * 100).toFixed(2) : 0;
                }
            }

            // Aktif kullanıcı sayısını al
            const users = await this.getUsers();
            dashboardData.activeUsers = users.filter(user => user.active).length;

            return dashboardData;
        } catch (error) {
            console.error('Dashboard verileri alınamadı:', error);
            return {
                dailyProduction: 0,
                efficiency: 0,
                activeUsers: 0,
                totalEntries: 0
            };
        }
    }

    // Veri girişi kaydet
    async saveDataEntry(formData) {
        try {
            const range = `'VeriGiris'!A:D`; // Tarih, Üretim, Yakıt, Saat sütunları
            const values = [[
                formData.date,
                formData.production.toString(),
                formData.fuel.toString(),
                formData.hours.toString()
            ]];

            const result = await this.appendData(range, values);
            return result;
        } catch (error) {
            console.error('Veri girişi kaydedilemedi:', error);
            throw error;
        }
    }

    // Rapor verilerini getir
    async getReportData() {
        try {
            const dataRange = `'VeriGiris'!A2:D1000`;
            const values = await this.readData(dataRange);

            const reportData = {
                totalProduction: 0,
                totalFuel: 0,
                totalHours: 0,
                avgEfficiency: 0,
                entries: values.length
            };

            if (values.length > 0) {
                values.forEach(row => {
                    reportData.totalProduction += parseFloat(row[1] || 0);
                    reportData.totalFuel += parseFloat(row[2] || 0);
                    reportData.totalHours += parseFloat(row[3] || 0);
                });

                // Ortalama verimlilik
                reportData.avgEfficiency = reportData.totalFuel > 0 
                    ? ((reportData.totalProduction / reportData.totalFuel) * 100).toFixed(2)
                    : 0;
            }

            return reportData;
        } catch (error) {
            console.error('Rapor verileri alınamadı:', error);
            return {
                totalProduction: 0,
                totalFuel: 0,
                totalHours: 0,
                avgEfficiency: 0,
                entries: 0
            };
        }
    }

    // Kullanıcıları getir
    async getUsers() {
        try {
            const usersRange = `'Kullanıcılar'!A2:E1000`; // Ad, Email, Şifre, Rol, Durum
            const values = await this.readData(usersRange);

            const users = values.map(row => ({
                name: row[0] || '',
                email: row[1] || '',
                password: row[2] || '', // Güvenlik için şifreler genellikle gösterilmez
                role: row[3] || 'user',
                active: (row[4] || 'true').toLowerCase() === 'true'
            }));

            return users;
        } catch (error) {
            console.error('Kullanıcılar alınamadı:', error);
            return [];
        }
    }

    // Yeni kullanıcı ekle
    async addUser(userData) {
        try {
            const range = `'Kullanıcılar'!A:E`;
            const values = [[
                userData.name,
                userData.email,
                userData.password, // Gerçek uygulamada hash'lenmiş olmalı
                userData.role,
                userData.active ? 'true' : 'false'
            ]];

            const result = await this.appendData(range, values);
            return result;
        } catch (error) {
            console.error('Kullanıcı eklenemedi:', error);
            throw error;
        }
    }

    // Kullanıcı doğrula
    async validateUser(email, password) {
        try {
            const users = await this.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user && user.active) {
                // Şifreyi güvenlik için kaldır
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
            
            return null;
        } catch (error) {
            console.error('Kullanıcı doğrulanamadı:', error);
            return null;
        }
    }

    // Ayarları getir
    async getSettings() {
        try {
            const settingsRange = `'Ayarlar'!A2:B100`;
            const values = await this.readData(settingsRange);

            const settings = {};
            values.forEach(row => {
                if (row[0] && row[1]) {
                    settings[row[0]] = row[1];
                }
            });

            return settings;
        } catch (error) {
            console.error('Ayarlar alınamadı:', error);
            return {};
        }
    }

    // Ayarları güncelle
    async updateSettings(settings) {
        try {
            const range = `'Ayarlar'!A:B`;
            const values = Object.entries(settings).map(([key, value]) => [key, value]);

            const result = await this.writeData(range, values);
            return result;
        } catch (error) {
            console.error('Ayarlar güncellenemedi:', error);
            throw error;
        }
    }
}

// Google Sheets API örneği oluştur
const googleSheets = new GoogleSheetsAPI();

// Sayfa yüklendiğinde yapılandırmayı kontrol et
document.addEventListener('DOMContentLoaded', () => {
    // Local storage'dan ayarları yükle
    const savedApiKey = localStorage.getItem('googleApiKey');
    const savedSpreadsheetId = localStorage.getItem('spreadsheetId');

    if (savedApiKey) {
        googleSheets.setApiKey(savedApiKey);
    }

    if (savedSpreadsheetId) {
        googleSheets.setSpreadsheetId(savedSpreadsheetId);
    }
});
