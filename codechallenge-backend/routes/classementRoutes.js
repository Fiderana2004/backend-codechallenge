const express = require("express");

const router = express.Router();

const pool = require("../config/db");

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(

      `SELECT
        id_user,
        nom,
        points,
        niveau
       FROM utilisateur
       ORDER BY points DESC`
    );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error: err.message
    });
  }
});

module.exports = router;