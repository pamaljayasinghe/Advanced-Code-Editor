const express = require("express");
const router = express.Router();
const { saveFile, getFile } = require("../controllers/files");
const auth = require("../middleware/auth");

router.post("/save", auth, saveFile);
router.get("/:id", auth, getFile);

module.exports = router;
