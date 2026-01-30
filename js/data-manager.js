// Veri Yönetim Sistemi
class DataManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 dakika cache
    }

    // Cache anahtarı oluştur
    getCacheKey(prefix, params = {}) {
        const paramString = JSON.stringify(params);
        return `${prefix}_${btoa(paramString)}`;
    }

    // Cache'e veri kaydet
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Cache'den veri al
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    // Cache'i temizle
    clearCache() {
        this.cache.clear();
    }


    // Dashboard verilerini getir
    async getDashboardData() {
        const cacheKey = this.getCacheKey('dashboard');
        
        // Cache'den kontrol et
        let data = this.getCache(cacheKey);
        if (data) {
            return data;
        }

        try {
            data = await googleSheets.getDashboardData();
            
            // Cache'e kaydet
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Dashboard verileri alınamadı:', error);
            throw error;
        }
    }

    // Rapor verilerini getir
    async getReportData(period = 'daily', startDate = null, endDate = null) {
        const cacheKey = this.getCacheKey('report', { period, startDate, endDate });
        
        // Cache'den kontrol et
        let data = this.getCache(cacheKey);
        if (data) {
            return data;
        }

        try {
            const rawData = await googleSheets.getReportData();
            
            // Veriyi filtrele ve işle
            data = this.processReportData(rawData, period, startDate, endDate);
            
            // Cache'e kaydet
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Rapor verileri alınamadı:', error);
            throw error;
        }
    }

    // Rapor verilerini işle
    processReportData(rawData, period, startDate, endDate) {
        const processedData = {
            period: period,
            summary: {
                totalProduction: rawData.totalProduction,
                totalFuel: rawData.totalFuel,
                totalHours: rawData.totalHours,
                avgEfficiency: rawData.avgEfficiency,
                entries: rawData.entries
            },
            details: []
        };

        // Tarih aralığına göre filtreleme
        if (startDate && endDate) {
            // Bu kısım Google Sheets veri yapısına göre genişletilebilir
        }

        return processedData;
    }

    // Kullanıcı verilerini getir
    async getUsers() {
        const cacheKey = this.getCacheKey('users');
        
        // Cache'den kontrol et
        let data = this.getCache(cacheKey);
        if (data) {
            return data;
        }

        try {
            data = await googleSheets.getUsers();
            
            // Cache'e kaydet
            this.setCache(cacheKey, data);
            
            return data;
        } catch (error) {
            console.error('Kullanıcı verileri alınamadı:', error);
            throw error;
        }
    }

    // İstatistikleri hesapla
    calculateStatistics(data) {
        const stats = {
            basic: {
                total: data ? data.length : 0,
                trend: 'stable'
            }
        };

        return stats;
    }
}

// Veri yönetici örneği oluştur
const dataManager = new DataManager();
