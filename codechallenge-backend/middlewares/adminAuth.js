const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  const adminToken = process.env.ADMIN_TOKEN || 'admin123'; // Valeur par défaut
  if (!token || token !== adminToken) {
    return res.status(403).json({ error: "Accès non autorisé" });
  }
  next();
};

module.exports = { adminAuth };
