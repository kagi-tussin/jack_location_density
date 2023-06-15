const express = require("express");
const router = express.Router();
const etlController = require("../controllers/etlController");

// Endpoint to initiate the ETL pipeline
router.post("/etl", etlController.initiateETL);

module.exports = router;
