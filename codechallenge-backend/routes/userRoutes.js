const express = require("express");

const router = express.Router();

const upload =
require("../middlewares/upload");

const {
  uploadPhoto
} = require("../controllers/userController");

// upload image profil
router.post(
  "/upload/:id",
  upload.single("photo"),
  uploadPhoto
);

module.exports = router;