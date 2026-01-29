// Grafik ve Raporlama Sistemi
class ChartsManager {
    constructor() {
        this.chartColors = {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8'
        };
    }

    // Canvas oluştur
    createCanvas(containerId, width = 400, height = 300) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container bulunamadı: ${containerId}`);
            return null;
        }

        // Mevcut canvas'ı temizle
        container.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        container.appendChild(canvas);
        return canvas;
    }

    // Basit çizgi grafik çiz
    drawLineChart(canvasId, data, labels, title = '') {
        const canvas = this.createCanvas(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Arka plan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Başlık
        if (title) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 20);
        }

        // Veri aralığını hesapla
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;

        // Eksenler
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Veri noktaları ve çizgiler
        const xStep = (width - 2 * padding) / (data.length - 1);
        const yScale = (height - 2 * padding) / range;

        // Çizgiyi çiz
        ctx.strokeStyle = this.chartColors.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) * yScale);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Veri noktaları
        data.forEach((value, index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) * yScale);

            ctx.fillStyle = this.chartColors.primary;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Değer etiketleri
            ctx.fillStyle = '#333';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toFixed(1), x, y - 10);

            // X ekseni etiketleri
            if (labels && labels[index]) {
                ctx.fillText(labels[index], x, height - padding + 20);
            }
        });
    }

    // Basit bar grafik çiz
    drawBarChart(canvasId, data, labels, title = '') {
        const canvas = this.createCanvas(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;

        // Arka plan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Başlık
        if (title) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 20);
        }

        // Veri aralığını hesapla
        const maxValue = Math.max(...data);

        // Eksenler
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Barlar
        const barWidth = (width - 2 * padding) / data.length * 0.6;
        const barSpacing = (width - 2 * padding) / data.length;
        const yScale = (height - 2 * padding) / maxValue;

        data.forEach((value, index) => {
            const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
            const barHeight = value * yScale;
            const y = height - padding - barHeight;

            // Gradient dolgu
            const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
            gradient.addColorStop(0, this.chartColors.primary);
            gradient.addColorStop(1, this.chartColors.secondary);

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Değer etiketleri
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value.toFixed(1), x + barWidth / 2, y - 5);

            // X ekseni etiketleri
            if (labels && labels[index]) {
                ctx.save();
                ctx.translate(x + barWidth / 2, height - padding + 15);
                ctx.rotate(-Math.PI / 6);
                ctx.fillText(labels[index], 0, 0);
                ctx.restore();
            }
        });
    }

    // Pasta grafik çiz
    drawPieChart(canvasId, data, labels, title = '') {
        const canvas = this.createCanvas(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Arka plan
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Başlık
        if (title) {
            ctx.fillStyle = '#333';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(title, centerX, 30);
        }

        // Veri toplamı
        const total = data.reduce((sum, value) => sum + value, 0);

        // Renkler
        const colors = [
            this.chartColors.primary,
            this.chartColors.secondary,
            this.chartColors.success,
            this.chartColors.warning,
            this.chartColors.danger,
            this.chartColors.info
        ];

        let currentAngle = -Math.PI / 2;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Dilimi çiz
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Etiket
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            
            const percentage = ((value / total) * 100).toFixed(1);
            const labelText = labels[index] ? `${labels[index]} (${percentage}%)` : `${percentage}%`;
            ctx.fillText(labelText, labelX, labelY);

            currentAngle += sliceAngle;
        });
    }

    // Dashboard grafiklerini oluştur
    async createDashboardCharts() {
        try {
            const data = await dataManager.getReportData('daily');
            
            // Son 7 günün üretim grafiği
            const last7Days = this.getLast7DaysData(data);
            this.drawLineChart('production-chart', last7Days.values, last7Days.labels, 'Son 7 Gün Üretim');

            // Verimlilik bar grafiği
            const efficiencyData = this.getEfficiencyData(data);
            this.drawBarChart('efficiency-chart', efficiencyData.values, efficiencyData.labels, 'Günlük Verimlilik');

        } catch (error) {
            console.error('Dashboard grafikleri oluşturulamadı:', error);
        }
    }

    // Son 7 gün verisi
    getLast7DaysData(data) {
        const labels = [];
        const values = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('tr-TR', { weekday: 'short' }));
            values.push(Math.random() * 1000 + 500); // Örnek veri
        }

        return { labels, values };
    }

    // Verimlilik verisi
    getEfficiencyData(data) {
        const labels = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
        const values = labels.map(() => Math.random() * 30 + 70); // 70-100 arası örnek verimlilik

        return { labels, values };
    }

    // Rapor grafiği oluştur
    createReportChart(canvasId, reportData, chartType = 'line') {
        switch (chartType.toLowerCase()) {
            case 'line':
                this.drawLineChart(canvasId, reportData.values, reportData.labels, reportData.title);
                break;
            case 'bar':
                this.drawBarChart(canvasId, reportData.values, reportData.labels, reportData.title);
                break;
            case 'pie':
                this.drawPieChart(canvasId, reportData.values, reportData.labels, reportData.title);
                break;
            default:
                console.error('Desteklenmeyen grafik türü:', chartType);
        }
    }

    // Grafik resmini indir
    downloadChart(canvasId, filename = 'chart.png') {
        const canvas = document.querySelector(`#${canvasId} canvas`);
        if (!canvas) {
            console.error('Grafik bulunamadı');
            return;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL();
        link.click();
    }

    // Grafikleri temizle
    clearChart(canvasId) {
        const container = document.getElementById(canvasId);
        if (container) {
            container.innerHTML = '';
        }
    }

    // Responsive grafik boyutu ayarla
    resizeCharts() {
        // Mobil cihazlar için grafik boyutlarını ayarla
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            document.querySelectorAll('canvas').forEach(canvas => {
                canvas.width = Math.min(300, window.innerWidth - 40);
                canvas.height = 200;
            });
        }
    }
}

// Grafik yönetici örneği oluştur
const charts = new ChartsManager();

// Pencere boyutu değiştiğinde grafikleri yeniden boyutlandır
window.addEventListener('resize', () => {
    charts.resizeCharts();
});

// Sayfa yüklendiğinde grafikleri oluştur
document.addEventListener('DOMContentLoaded', () => {
    // Dashboard sayfasında grafikleri oluştur
    setTimeout(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            charts.createDashboardCharts();
        }
    }, 1000);
});
