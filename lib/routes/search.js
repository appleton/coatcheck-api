const express = require('express');
const router  = new express.Router();

router.get('/search', function(req, res) {
  res.status(200).json({ status: 'ok', code: 200 });
});

module.exports = router;
