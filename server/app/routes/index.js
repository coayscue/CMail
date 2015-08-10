'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/messages', require('./messages.js'));
router.use('/users', require('./users.js'));

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
  res.status(404).end();
});