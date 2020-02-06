const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).json({
    message: "passport server is running"
  });
});

module.exports = router;
