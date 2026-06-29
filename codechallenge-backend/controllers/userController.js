const pool = require("../config/db");

const uploadPhoto = async (
  req,
  res
) => {

  try {

    const id = req.params.id;

    if (!req.file) {

      return res.json({
        success: false,
        message: "Aucune image"
      });
    }

    const image =
      req.file.filename;

    await pool.query(

      `UPDATE utilisateur
       SET photo = $1
       WHERE id_user = $2`,

      [image, id]
    );

    res.json({

      success: true,

      image:
        "http://192.168.43.103:3000/uploads/" +
        image
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Erreur upload"
    });
  }
};

module.exports = {
  uploadPhoto
};