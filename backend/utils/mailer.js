import nodemailer from 'nodemailer';

// Email transporter'ı ayarlama
const createTransporter = () => {
  // Mailtrap için SMTP ayarları
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });
};

// Maillerin gönderileceği e-posta adresi
export const sendMail = async (to, subject, text, html = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: html || `<p>${text}</p>` // Eğer HTML şeklinde gelmiyorsa HTML'e çevirir
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Mail ${to}'e başarıyla gönderildi:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Mail ${to}'e gönderilemedi:`, error.message);
    return { success: false, error: error.message };
  }
};

// Birden fazla kişiye mail gönderme
export const sendBulkEmails = async (recipients, subject, textTemplate, htmlTemplate = null) => {
  const results = [];
  const batchSize = 10; // Server'ı yormamak için mailleri 10'ar 10'ar göndermek için
  
  console.log(`${recipients.length} kişiye mail gönderiliyor`);

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    // Batch'teki mailleri paralel olarak (aynı anda) göndermeyi dener.
    const batchPromises = batch.map(async (recipient) => {
      const text = typeof textTemplate === 'function' 
        ? textTemplate(recipient) 
        : textTemplate;
      
      // Eğer şablon bir fonksiyonsa (kişiye özel içerik için), alıcı objesini kullanarak içeriği üretir.
      const html = typeof htmlTemplate === 'function' 
        ? htmlTemplate(recipient) 
        : htmlTemplate;

      // Tek kişi için mail fonksiyonu
      const result = await sendMail(recipient.email, subject, text, html);
      return {
        email: recipient.email,
        ...result
      };
    });

    try {
      // Batch'teki tüm mail gönderme işlemlerinin tamamlanmasını bekler.
			// Promise.allSettled, bir mail başarısız olsa bile diğerlerinin devam etmesini sağlar.
      const batchResults = await Promise.allSettled(batchPromises);

      // Başarılı ve başarısız sonuçları ana sonuç dizisine ekler.
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : { 
          email: 'unknown', 
          success: false, 
          error: result.reason?.message || 'Unknown error' 
        }
      ));
      
      console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(recipients.length/batchSize)}`);
      
      // BAtch'ler arasında 1 saniye bekler
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error processing batch:`, error);
    }
  }

  // Gönderme işleminin özetini çıkarır
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Bulk email completed: ${successful} successful, ${failed} failed`);
  
  return {
    total: recipients.length,
    successful,
    failed,
    results
  };
};