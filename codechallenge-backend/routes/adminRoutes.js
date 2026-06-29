const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/adminAuth");

router.get("/stats",              adminAuth, adminController.getStats);
router.get("/stats/top-users",    adminAuth, adminController.getTopUsers);
router.get("/stats/defis",        adminAuth, adminController.getDefiStats);
router.get("/stats/activity",     adminAuth, adminController.getActivity);
router.get("/soumissions",        adminAuth, adminController.getSoumissions);
router.get("/users",              adminAuth, adminController.getAllUsers);
router.delete("/users/:id",       adminAuth, adminController.deleteUser);

module.exports = router;