# Limon & Portakal

Evcil hayvanlarımız için hazırladığım quiz uygulaması. Kullanıcı quizleri doğru çözdükçe puan kazanır ve kazandığı puanlarla marketten alışveriş yapabilir. Admin yeni quizler yayınladıkça tüm kullancılara mail gönderilir. Kullanıcı giriş yaptığında kendisine bir JWT (JSON Web Token) verilir; bu token kimlik doğrulamasını (authentication) sağlar.

## Kurulum

### Gereksinimler
* Node.js (v18 veya üzeri)
* npm

### Adımlar
1. Repoyu klonlayın
git clone https://github.com/tugceozcan0/limon-portakal.git
cd limon-portakal

2. Bağımlılıkların Kurulumu
#### Backend Kurulumu
cd backend
npm install

##### .env dosyasını hazırla
PORT=5000
DB_NAME=limon_portakal
DB_USER=root
DB_PASS=your_password
JWT_SECRET=secretkey

ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_email_password

##### Mail gönderimini test etmek için Mailtrap bilgilerini ekleyin

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_user_code
MAILTRAP_PASS=your_given_password

##### Sunucuyu başlat:
npm run dev

#### Frontend Kurulumu
cd frontend
npm install
npm run dev

##### Tarayıcıda aç
http://localhost:5173

## Proje Yapısı
Uygulama frontend (React) ve backend (Node.js + Express + MySQL) olmak üzere iki ana bölümden oluşur.

## Özellikler
### Quiz Sistemi
* Her doğru cevap için puan kazanma
* Gerçek zamanlı puan takibi
* Aylık eklenen yeni quizler

### Sanal Market
* Puanlarla alınabilecek ürünler
* Çeşitli ürün kategorileri 
* Sepet yönetimi

### Bildirim Sistemi
* Admin yeni quizler ekledikçe tüm kullanıcılara mail gönderimi (Nodemailer)

### Kullanıcı Yönetimi
* Güvenli kayıt ve giriş yönetimi (JWT ve bcrypt)
* Puan ve sepet takibi

### Modern Tasarım
* Mobil uyumlu responsive tasarım
* Kullanıcı dostu navigasyon

## Teknolojiler
* Frontend Framework: React 18+
* Routing: React Router DOM
* Mail: Nodemailer
* Styling: Tailwind CSS
* Icons: Lucide React
* State Management: React Context API
* Build Tool: Vite
* Database Management: MySQL
* ORM: Sequelize

## Kullanım
1. Navbar'daki "Kaydol" butonundan kaydolun ve sonrasında giriş yapın
2. Quiz bölümüne gidin ve mevcut soruları yanıtlayın, puan kazanın.
3. Market kısmından beğendiğiniz ürünleri sepete ekleyin.
4. Sepetinizdeki ürünleri arttırıp azaltabilir, sepetten çıkarabilirsiniz.
5. Puanlarınızla ödeme yapın.
6. Yeni quizler yayınlanınca size mail olarak gelecek, beklemede kalın.


## API Rotaları
| HTTP Yöntemi | Rota                        | Açıklama                                               | Erişim Seviyesi |
| :----------: | :--------------------------:| :-----------------------------------------------------:| :--------------:|
| `POST`       | `/api/auth/register`        | Yeni kullanıcı kaydı oluşturur.                        | Herkese Açık    |
| `POST`       | `/api/auth/login`           | Kullanıcı girişi yapar ve oturum token'ı döndürür.     | Herkese Açık    |
| `GET`        | `/api/quiz`                 | Kullanıcının henüz çözmediği quizleri listeler.        | Giriş Gerekli   |
| `POST`       | `/api/quiz/submit`          | Quiz cevaplarını kaydeder ve puan hesaplaması yapar.   | Giriş Gerekli   |
| `POST`       | `/api/quiz/create`          | Yeni bir quiz sorusu oluşturur.                        | Admin           |
| `GET`        | `/api/products`             | Sanal marketteki tüm ürünleri listeler.                | Herkese Açık    |
| `GET`        | `/api/products/user-points` | Kullanıcının mevcut puan bakiyesini getirir.           | Giriş Gerekli   |
| `POST`       | `/api/products/buy`         | Sepetteki ürünü/ürünleri puan karşılığında satın alır. | Giriş Gerekli   |

## Ekran Görüntüleri
## 📸 Ekran Görüntüleri

> **Not:** Proje ekran görüntüleri için lütfen `/frontend/public/images/screenshots/` klasörünü kontrol edin veya uygulamayı yerel olarak çalıştırın.

### Özellikler
- Ana sayfa tasarımı
- Quiz çözme ekranı  
- Sanal market ve sepet sistemi
- Responsive mobil tasarım

## Katkıda Bulunma 
1. Repoyu fork edin
2. Branch'inizi oluşturun (git checkout -b feature/yeni-ozellik)
3. Değişikliklerinizi commit edin (git commit -m 'Yeni özellik eklendi')
4. Branch'inizi push edin (git push origin feature/yeni-ozellik)
5. Pull request açın

## İletişim 
Geliştirici: Tuğçe Özcan
* Github: @tugceozcan0
* Email: tugceozcan0932@gmail.com
