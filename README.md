# Kojenerasyon Takip Sistemi

Mobil uyumlu, web tabanlı kojenerasyon takip sistemi. Google Sheets entegrasyonlu, maksimum 5 kullanıcı kapasiteli.

## Özellikler

- ✅ Mobil uyumlu responsive tasarım
- ✅ Google Sheets veri entegrasyonu
- ✅ 5 kullanıcı limitli yönetim
- ✅ Gerçek zamanlı veri takibi
- ✅ Raporlama ve analiz
- ✅ Grafiksel gösterimler
- ✅ Kullanıcı kimlik doğrulama

## Kurulum Adımları

### 1. Google Cloud Console Ayarları

1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. Yeni proje oluşturun
3. "Google Sheets API" aratın ve etkinleştirin
4. "Kimlik Bilgileri" → "Kimlik Bilgisi Oluştur" → "API Anahtarı"
5. API anahtarını kopyalayın

### 2. Google Sheets Hazırlama

1. Yeni Google Sheets oluştur
2. 4 sayfa oluşturun:
   - `Kullanıcılar` (A:E sütunları)
   - `VeriGiris` (A:D sütunları) 
   - `Raporlar` (A:D sütunları)
   - `Ayarlar` (A:B sütunları)

3. Sayfa URL'sinden Spreadsheet ID'yi kopyalayın:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 3. GitHub'a Yükleme

1. GitHub hesabınızla giriş yapın
2. Yeni repository oluşturun: `kojenerasyon-sistemi`
3. Dosyaları yükleyin:
   ```bash
   git init
   git add .
   git commit -m "İlk yükleme"
   git branch -M main
   git remote add origin https://github.com/kullaniciadi/kojenerasyon-sistemi.git
   git push -u origin main
   ```

### 4. GitHub Pages Ayarları

1. Repository'de "Settings" → "Pages"
2. Source: "Deploy from a branch"
3. Branch: "main" ve "/ (root)"
4. "Save" deyin
5. 5-10 dakika sonra site yayınlanır

### 5. API Anahtarını Yapılandırma

Site yayınlandıktan sonra:
1. `js/google-sheets.js` dosyasını açın
2. `YOUR_API_KEY_HERE` yerine API anahtarınızı yazın
3. `YOUR_SPREADSHEET_ID_HERE` yerine Spreadsheet ID'nizi yazın

## Kullanım

### Kullanıcı Ekleme

`Kullanıcılar` sayfasına şu formatta ekleyin:
- A Sütunu: Ad Soyad
- B Sütunu: Email  
- C Sütunu: Şifre
- D Sütunu: Rol (user/admin)
- E Sütunu: Durum (true/false)

### Veri Girişi

`VeriGiris` sayfasına şu formatta kaydedin:
- A Sütunu: Tarih (YYYY-MM-DD)
- B Sütunu: Üretim (kWh)
- C Sütunu: Yakıt Tüketimi (LT)
- D Sütunu: Çalışma Saati

## Dosya Yapısı

```
kojenerasyon-sistemi/
├── index.html                 # Ana sayfa
├── css/
│   ├── main.css              # Ana stiller
│   └── mobile.css            # Mobil stiller
├── js/
│   ├── app.js                # Ana uygulama
│   ├── google-sheets.js      # Sheets entegrasyonu
│   ├── auth.js               # Kullanıcı yönetimi
│   ├── data-manager.js       # Veri yönetimi
│   └── charts.js             # Grafikler
└── README.md                 # Bu dosya
```

## Önemli Notlar

- API anahtarınızı asla herkese açık paylaşmayın
- Google Sheets'i herkese açık yapın (Düzenleme izni ile)
- Maksimum 5 kullanıcı limiti vardır
- Mobil cihazlarda tam uyumlu çalışır

## Destek

Sorularınız için GitHub Issues kullanabilirsiniz.

## Lisans

MIT License
