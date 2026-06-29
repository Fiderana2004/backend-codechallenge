const axios = require("axios");
const pool = require("../config/db");

const executerCode = async (req, res) => {
  try {
    const { id_user, id_defi, code, langage } = req.body;

    // 1. Récupérer le défi
    const defiRes = await pool.query(
      "SELECT * FROM defi WHERE id_defi = $1",
      [id_defi]
    );
    const defi = defiRes.rows[0];

    if (!defi) {
      return res.status(404).json({ success: false, message: "Défi introuvable" });
    }

    // 2. Validation langage — tous les langages supportés par Paiza
    const allowedLangages = [
      "python3",
      "javascript",
      "java",
      "c",
      "cpp",
    ];

    if (!allowedLangages.includes(langage)) {
      return res.status(400).json({
        success: false,
        message: `Langage non supporté : ${langage}. Supportés : ${allowedLangages.join(", ")}`
      });
    }

    // 3. Appel Paiza — création du runner
    let result;
    try {
      result = await axios.post(
        "https://api.paiza.io/runners/create",
        new URLSearchParams({
          source_code: code,
          language:    langage,
          api_key:     "guest"
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          timeout: 10000
        }
      );
    } catch (err) {
      console.log("Erreur Paiza API:", err.message);
      return res.status(500).json({ success: false, message: "Paiza indisponible" });
    }

    if (!result.data || !result.data.id) {
      console.log("Réponse Paiza invalide:", result.data);
      return res.status(500).json({ success: false, message: "Réponse Paiza invalide" });
    }

    const id = result.data.id;

    // 4. Polling — attendre que l'exécution soit terminée
    let outputRes;
    let statusPaiza = "running";
    let tentatives  = 0;

    while (statusPaiza !== "completed" && tentatives < 15) {
      await new Promise(r => setTimeout(r, 2000));
      tentatives++;
      try {
        outputRes  = await axios.get(
          `https://api.paiza.io/runners/get_details?id=${id}&api_key=guest`,
          { timeout: 10000 }
        );
        statusPaiza = outputRes.data.status;
        console.log(`[PAIZA] Tentative ${tentatives} — status: ${statusPaiza}`);
      } catch (err) {
        console.log("Erreur polling Paiza:", err.message);
      }
    }

    // 5. Extraction des résultats
    const stdoutRaw = outputRes?.data?.stdout        || "";
    const stderrRaw = outputRes?.data?.stderr        ||
                      outputRes?.data?.build_stderr  || "";

    const output   = stdoutRaw.toString().trim();
    const expected = (defi.reponse_attendue || "").toString().trim();

    console.log(`[VÉRIFICATION]`);
    console.log(`  Langage     : "${langage}"`);
    console.log(`  Sortie trim : "${output}"`);
    console.log(`  Attendu     : "${expected}"`);
    console.log(`  Stderr      : "${stderrRaw}"`);

    // 6. Comparaison normalisée
    const normalize = (s) => s.toString().trim()
      .replace(/\r\n/g, "\n")
      .replace(/\n+$/, "")
      .replace(/\s+/g, " ");

    let status = "wrong";
    let points = 0;

    if (output !== "" && normalize(output).toLowerCase() === normalize(expected).toLowerCase()) {
      status = "correct";
      points = defi.points;
    }

    // 7. Sauvegarde soumission
    await pool.query(
      `INSERT INTO soumission (id_user, id_defi, code_source, resultat, points_gagnes)
       VALUES ($1, $2, $3, $4, $5)`,
      [id_user, id_defi, code, status, points]
    );

    // 8. Mise à jour points utilisateur
    if (points > 0) {
      await pool.query(
        `UPDATE utilisateur
         SET points = points + $1,
             niveau = CASE
               WHEN points + $1 >= 1000 THEN 'expert'
               WHEN points + $1 >= 300  THEN 'intermediaire'
               ELSE 'debutant'
             END
         WHERE id_user = $2`,
        [points, id_user]
      );
    }

    return res.json({
      success:  true,
      resultat: status,
      points:   points,
      output:   output,
      error:    stderrRaw || null
    });

  } catch (error) {
    console.log("ERREUR BACKEND:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

module.exports = { executerCode };