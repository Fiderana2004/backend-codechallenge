const express = require("express");
const router = express.Router();
const defiController = require("../controllers/defiController");
const { adminAuth } = require("../middlewares/adminAuth");

// Public — utilisé par l'app Flutter
router.get("/", defiController.getAllDefis);
router.get("/:id", defiController.getDefiById);

// Admin seulement
router.post("/", adminAuth, defiController.createDefi);
router.put("/:id", adminAuth, defiController.updateDefi);
router.delete("/:id", adminAuth, defiController.deleteDefi);

module.exports = router;