const pool = require("../config/db");

const getAllDefis = async () => {
  const result = await pool.query(
    "SELECT * FROM defi ORDER BY id_defi DESC"
  );
  return result.rows;
};

const getDefiById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM defi WHERE id_defi = $1",
    [id]
  );
  return result.rows[0];
};

const createDefi = async ({ titre, description, difficulte, points, reponse_attendue, langage }) => {
  const result = await pool.query(
    `INSERT INTO defi (titre, description, difficulte, points, reponse_attendue, langage)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [titre, description, difficulte, points, reponse_attendue, langage]
  );
  return result.rows[0];
};

const updateDefi = async (id, { titre, description, difficulte, points, reponse_attendue, langage }) => {
  const result = await pool.query(
    `UPDATE defi SET titre=$1, description=$2, difficulte=$3, points=$4,
     reponse_attendue=$5, langage=$6 WHERE id_defi=$7 RETURNING *`,
    [titre, description, difficulte, points, reponse_attendue, langage, id]
  );
  return result.rows[0];
};

const deleteDefi = async (id) => {
  await pool.query("DELETE FROM soumission WHERE id_defi = $1", [id]);
  const result = await pool.query(
    "DELETE FROM defi WHERE id_defi = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = { getAllDefis, getDefiById, createDefi, updateDefi, deleteDefi };