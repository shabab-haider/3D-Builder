const express = require("express");
const router = express.Router();
const Design = require("../models/design.model");
const designController = require("../controllers/design.controller");

// Create Design
router.post("/save", designController.saveDesign);

// Get All Designs
router.get("/", designController.getDesigns);

// Delete Design
router.delete("/:id", designController.deleteDesign);

module.exports = router;

