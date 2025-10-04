// Kullanıcının 'admin' rolüne sahip olup olmadığını kontrol eden middleware.

const adminMiddleware = (req, res, next) => {
    // authMiddleware, req.user objesini (User modelinden) doldurur.

    // Kullanıcı bilgisi mevcut değilse
    if (!req.user || !req.user.role) {
        return res.status(500).json({ msg: "Authentication context missing. Check if authMiddleware ran first." });
    }

    // Admin rolüne sahip olunup olunmadığının kontrolü
    if (req.user.role !== 'admin') {
        // Güvenlik uyarısı
        console.warn(`Admin yetkisi reddedildi. Kullanıcı ID: ${req.user.id}, Rol: ${req.user.role}`);
        return res.status(403).json({ msg: "Bu işlem için yönetici yetkisi gereklidir." });
    }

    // Kullanıcının rolü adminse işlemi devam ettir.
    next();
};

export default adminMiddleware;
