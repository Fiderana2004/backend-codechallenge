const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  const adminToken = process.env.ADMIN_TOKEN || 'admin123';
  
  // 🐛 LOGS DE DÉBOGAGE
  console.log('=== AUTHENTIFICATION ===');
  console.log('Token reçu:', token);
  console.log('Token attendu:', adminToken);
  console.log('Token reçu (longueur):', token ? token.length : 0);
  console.log('Token attendu (longueur):', adminToken.length);
  console.log('Comparaison:', token === adminToken);
  
  if (!token || token !== adminToken) {
    console.log('❌ Échec - Accès refusé');
    return res.status(403).json({ error: "Accès non autorisé" });
  }
  
  console.log('✅ Succès - Accès autorisé');
  next();
};

module.exports = { adminAuth };
