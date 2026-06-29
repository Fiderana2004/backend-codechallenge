const pool = require("../config/db");

const getGlobalStats = async () => {
  const [users, defis, soumissions, successRate] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM utilisateur"),
    pool.query("SELECT COUNT(*) FROM defi"),
    pool.query("SELECT COUNT(*) FROM soumission"),
    pool.query(
      `SELECT ROUND(
         COUNT(*) FILTER (WHERE resultat = 'correct') * 100.0 / NULLIF(COUNT(*), 0)
       , 1) AS taux
       FROM soumission`
    ),
  ]);
  return {
    total_users: parseInt(users.rows[0].count),
    total_defis: parseInt(defis.rows[0].count),
    total_soumissions: parseInt(soumissions.rows[0].count),
    taux_succes: parseFloat(successRate.rows[0].taux) || 0,
  };
};

const getTopUsers = async (limit = 10) => {
  const result = await pool.query(
    `SELECT id_user, nom, email, points, niveau,
       (SELECT COUNT(*) FROM soumission WHERE id_user = u.id_user) AS nb_soumissions,
       (SELECT COUNT(*) FROM soumission WHERE id_user = u.id_user AND resultat = 'correct') AS nb_corrects
     FROM utilisateur u
     ORDER BY points DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const getDefiStats = async () => {
  const result = await pool.query(
    `SELECT d.id_defi, d.titre, d.difficulte, d.langage, d.points,
       COUNT(s.id_soumission) AS nb_tentatives,
       COUNT(s.id_soumission) FILTER (WHERE s.resultat = 'correct') AS nb_succes,
       ROUND(
         COUNT(s.id_soumission) FILTER (WHERE s.resultat = 'correct') * 100.0
         / NULLIF(COUNT(s.id_soumission), 0)
       , 1) AS taux_reussite
     FROM defi d
     LEFT JOIN soumission s ON d.id_defi = s.id_defi
     GROUP BY d.id_defi
     ORDER BY nb_tentatives DESC`
  );
  return result.rows;
};

const getRecentSoumissions = async (limit = 20) => {
  const result = await pool.query(
    `SELECT s.id_soumission, s.resultat, s.points_gagnes, s.date_soumission,
       u.nom AS user_nom, u.email,
       d.titre AS defi_titre, d.difficulte, d.langage
     FROM soumission s
     JOIN utilisateur u ON s.id_user = u.id_user
     JOIN defi d ON s.id_defi = d.id_defi
     ORDER BY s.date_soumission DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const getActivityByDay = async (days = 30) => {
  const result = await pool.query(
    `SELECT DATE(date_soumission) AS jour,
       COUNT(*) AS nb_soumissions,
       COUNT(*) FILTER (WHERE resultat = 'correct') AS nb_succes
     FROM soumission
     WHERE date_soumission >= NOW() - INTERVAL '${days} days'
     GROUP BY DATE(date_soumission)
     ORDER BY jour ASC`
  );
  return result.rows;
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT u.id_user, u.nom, u.email, u.points, u.niveau,
       COUNT(s.id_soumission) AS nb_soumissions
     FROM utilisateur u
     LEFT JOIN soumission s ON u.id_user = s.id_user
     GROUP BY u.id_user
     ORDER BY u.points DESC`
  );
  return result.rows;
};

const deleteUser = async (id) => {
  await pool.query("DELETE FROM soumission WHERE id_user = $1", [id]);
  const result = await pool.query(
    "DELETE FROM utilisateur WHERE id_user = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getGlobalStats,
  getTopUsers,
  getDefiStats,
  getRecentSoumissions,
  getActivityByDay,
  getAllUsers,
  deleteUser,
};