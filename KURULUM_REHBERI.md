# ADIM ADIM KURULUM REHBERİ

## 📋 GEREKLİLİKLER
- Google Hesabı
- GitHub Hesabı  
- Bilgisayar (Windows/Mac/Linux)

---

## 🚪 ADIM 1: GOOGLE CLOUD CONSOLE

### 1.1 Proje Oluşturma
1. [https://console.cloud.google.com/](https://console.cloud.google.com/) adresine gidin
2. Google hesabınızla giriş yapın
3. Sol üstten proje seçimi → "YENİ PROJE"
4. Proje adı: `KojenerasyonSistemi`
5. "OLUŞTUR" tıklayın

### 1.2 API Etkinleştirme
1. Sol menü → "API'ler ve Hizmetler" → "Kitaplık"
2. Arama kutusuna "Google Sheets API" yazın
3. "Google Sheets API" tıklayın
4. "ETKİNLEŞTİR" butonuna tıklayın

### 1.3 API Anahtarı Oluşturma
1. Sol menü → "API'ler ve Hizmetler" → "Kimlik Bilgileri"
2. "+ KİMLİK BİLGİSİ OLUŞTUR" → "API anahtarı"
3. "KISITLAMALAR" butonuna tıklayın
4. "API anahtarları" altında kısıtlamaları seçin:
   - "API'leri kısıtla" → "Google Sheets API" seçin
5. "UYGULAMA KISITLAMALARI" → "HTTP web sunucuları" → 
   - Web sunucusu adresi ekle: `*`
6. "BİTTİ" tıklayın
7. Oluşturulan API anahtarını kopyalayın (Not defterine kaydedin)

---

## 📊 ADIM 2: GOOGLE SHEETS HAZIRLAMA

### 2.1 Yeni Sheets Oluşturma
1. [https://sheets.google.com](https://sheets.google.com) gidin
2. "+ Boş" tıklayın
3. Dosya adı: "KojenerasyonVeri"

### 2.2 Sayfaları Oluşturma
4 sayfa oluşturun (alttaki + butonu):

#### Sayfa 1: `Kullanıcılar`
```
A1: Ad Soyad    | B1: Email       | C1: Şifre | D1: Rol | E1: Durum
A2: Admin User  | B2: admin@site.com | C2: 123456 | D2: admin | E2: true
```

#### Sayfa 2: `VeriGiris`  
```
A1: Tarih | B1: Üretim (kWh) | C1: Yakıt (LT) | D1: Çalışma Saati
```

#### Sayfa 3: `Raporlar`
```
A1: Tarih | B1: Toplam Üretim | C1: Verimlilik | D1: Notlar
```

#### Sayfa 4: `Ayarlar`
```
A1: MaxUsers | B1: 5
A2: SystemName | B2: Kojenerasyon Takip
```

### 2.3 Paylaşım Ayarları
1. Sağ üst "Paylaş" butonuna tıklayın
2. "Genel erişim" → "Bağlantısı olan herkes"
3. Rol: "Görüntüleyici" → "Düzenleyici" olarak değiştirin
4. "Kopyala" butonuyla linki kopyalayın

### 2.4 Spreadsheet ID'yi Alma
Linkten ID'yi kopyalayın:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                      ↑
                              BU KISIM ID'DİR
```

---

## 🐙 ADIM 3: GITHUB'A YÜKLEME

### 3.1 GitHub Repository Oluşturma
1. [https://github.com](https://github.com) gidin
2. Sağ üst "+" → "New repository"
3. Repository name: `kojenerasyon-sistemi`
4. Description: `Kojenerasyon Takip Sistemi`
5. Public seçin
6. "Create repository" tıklayın

### 3.2 Git Kurulum (Yoksa)
1. [https://git-scm.com/download/win](https://git-scm.com/download/win) indirin
2. Kurulumu varsayılan ayarlarla yapın
3. Başlat → Git Bash açın

### 3.3 Dosyaları Yükleme
1. Projeyi kaydettiğiniz klasöre gidin
2. Klasörde sağ tık → "Git Bash Here"
3. Sırayla komutları çalıştırın:

```bash
# Git'i başlat
git init

# Tüm dosyaları ekle
git add .

# İlk yükleme
git commit -m "İlk yükleme"

# GitHub bağlantısı
git remote add origin https://github.com/KULLANICIADI/kojenerasyon-sistemi.git

# Ana dal ayarla
git branch -M main

# GitHub'a gönder
git push -u origin main
```

---

## 🌐 ADIM 4: GITHUB PAGES YAYINLAMA

### 4.1 Pages Ayarları
1. GitHub repository'nize gidin
2. "Settings" sekmesine tıklayın
3. Sol menüden "Pages" seçin
4. "Source" bölümünde:
   - Branch: "main"
   - Folder: "/ (root)"
5. "Save" tıklayın

### 4.2 Site Adresi
5-10 dakika sonra siteniz yayınlanır:
```
https://KULLANICIADI.github.io/kojenerasyon-sistemi/
```

---

## ⚙️ ADIM 5: SON AYARLAR

### 5.1 API Bilgilerini Girme
1. GitHub'da `js/google-sheets.js` dosyasını açın
2. 3. satırdaki `YOUR_API_KEY_HERE` yerine API anahtarınızı yazın
3. 4. satırdaki `YOUR_SPREADSHEET_ID_HERE` yerine Sheets ID'nizi yazın

### 5.2 Test Etme
1. Sitenize gidin
2. Admin kullanıcı ile giriş:
   - Email: `admin@site.com`
   - Şifre: `123456`
3. Veri girişi yapın
4. Dashboard'u kontrol edin

---

## 📱 MOBİL KULLANIM

- Telefon tarayıcısından site adresine gidin
- Responsive tasarım otomatik çalışır
- Dokunmatik ekran için optimize edilmiş

---

## 🔧 SORUN GİDERME

### API Hatası
- API anahtarını kontrol edin
- Google Sheets paylaşımını kontrol edin
- API kotasını kontrol edin

### Giriş Yapamıyorum  
- Kullanıcı bilgilerini kontrol edin
- Sheets'te kullanıcı var mı kontrol edin
- Şifre doğru mu kontrol edin

### Veri Kaydedilmiyor
- Sheets düzenleme izni var mı kontrol edin
- API anahtarı doğru mu kontrol edin
- İnternet bağlantısını kontrol edin

---

## 📞 DESTEK

Sorularınız için:
- GitHub Issues kullanabilirsiniz
- Email: destek@kojenerasyon.com

**🎉 KURULUM TAMAMLANDI!**
