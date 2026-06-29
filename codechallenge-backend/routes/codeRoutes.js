const express = require("express");

const router = express.Router();

const {
    executerCode
} = require("../controllers/codeController");

router.post("/execute", executerCode);

module.exports = router;