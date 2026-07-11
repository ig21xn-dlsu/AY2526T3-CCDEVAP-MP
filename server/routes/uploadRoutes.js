const express = require("express");
const upload = require("../middleware/multerConfig");



const router = express.Router();

router.post(
  "/",
  upload.single("listingImage"),
  (req, res) => {

    const imagePath =
      `/uploads/listing-images/${req.file.filename}`;

    res.json({
      imageUrl: imagePath
    });

  }
);

module.exports = router;
