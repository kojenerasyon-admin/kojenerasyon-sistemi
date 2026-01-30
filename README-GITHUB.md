# ⚡ Kojenerasyon Takip Sistemi

Modern web tabanlı kojenerasyon enerji üretim takip sistemi.

## 🚀 Özellikler

- **Gerçek Zamanlı Takip**: Motor verilerini anlık izleme
- **Google Sheets Entegrasyonu**: Veri depolama ve yönetimi
- **Güvenli Kimlik Doğrulama**: JWT-like token sistemi
- **Admin Paneli**: Sistem yapılandırması ve yönetimi
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Modern Teknolojiler**: Vite, ES6+, CSS3

## 🛠️ Kurulum

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/kullanici/kojenerasyon-sistemi.git
cd kojenerasyon-sistemi
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Yapılandırma
- `setup.html` açarak kurulum sihirbazını çalıştırın
- Google Sheets API anahtarlarını girin
- OAuth 2.0 ayarlarını yapın

### 4. Geliştirme Modunda Çalıştırın
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run preview
```

## 📋 Gereksinimler

- Node.js 18+
- Modern web tarayıcısı
- Google Cloud Console hesabı

## 🔧 Yapılandırma

### Google Sheets API
1. [Google Cloud Console](https://console.cloud.google.com/) açın
2. Yeni proje oluşturun
3. Google Sheets API'yi etkinleştirin
4. API Key ve OAuth 2.0 credentials oluşturun
5. `setup.html` üzerinden yapılandırın

### Environment Variables
```bash
# .env.example dosyasını kopyalayın
cp .env.example .env

# Değerleri düzenleyin
GOOGLE_API_KEY=your_api_key
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

## 📁 Proje Yapısı

```
kojenerasyon-sistemi/
├── css/
│   └── modern.css              # Ana stil dosyası
├── js/
│   ├── config.js               # Yapılandırma yönetimi
│   ├── auth.js                 # Kimlik doğrulama
│   ├── jwt-handler.js          # JWT token sistemi
│   ├── password-security.js    # PBKDF2 şifreleme
│   ├── error-handler.js        # Hata yönetimi
│   ├── google-sheets.js        # Google Sheets API
│   ├── settings.js             # Admin ayarları
│   └── app.js                  # Ana uygulama mantığı
├── index.html                  # Ana sayfa
├── setup.html                  # Kurulum sihirbazı
├── oauth-callback.html         # OAuth callback
├── vite.config.js              # Vite yapılandırması
└── package.json                # Proje bağımlılıkları
```

## 🔐 Güvenlik

- **JWT-like Token**: Güvenli oturum yönetimi
- **PBKDF2 Şifreleme**: Güçlü password hashing
- **Session Management**: Aktif session takibi
- **Input Validation**: Girdi doğrulama
- **Error Handling**: Güvenli hata yönetimi

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# dist/ klasörünü Netlify'e yükleyin
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🧪 Test

```bash
# Testleri çalıştır
npm test

# Test coverage
npm run test:coverage

# Test UI
npm run test:ui
```

## 📊 API Kullanımı

### Google Sheets Entegrasyonu
```javascript
// Veri okuma
const data = await googleSheets.getMotorData('2024-01-30');

// Veri yazma
await googleSheets.updateMotorStatus('gm1', 'AKTIF');
```

### Authentication
```javascript
// Giriş
const result = await auth.login(email, password);

// Token doğrulama
const payload = auth.validateToken(token);
```

## 🤝 Katkı

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişiklikleri commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında dağıtılmaktadır. [LICENSE](LICENSE) dosyasını inceleyin.

## 🆘 Destek

- 📧 Email: destek@kojenerasyon.com
- 🐛 Issues: [GitHub Issues](https://github.com/kullanici/kojenerasyon-sistemi/issues)
- 📖 Dokümantasyon: [Wiki](https://github.com/kullanici/kojenerasyon-sistemi/wiki)

## 🎯 Roadmap

- [ ] Backend API geliştirme
- [ ] PostgreSQL entegrasyonu
- [ ] Real-time WebSocket bağlantısı
- [ ] Mobil uygulama
- [ ] Advanced analytics
- [ ] Multi-language support

---

⚡ **Kojenerasyon Takip Sistemi** - Enerji verimliliği için modern çözüm
