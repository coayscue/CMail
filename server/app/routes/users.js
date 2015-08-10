'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require("lodash");

var mongoose = require('mongoose');
var User = mongoose.model('User');

// sign up
router.post('/', function(req, res, next) {
  var user = new User(req.body)
    //user.salt = User.generateSalt()
  user.save()
    .then(function(newUser) {
      //create the user account on godaddy


      //logs in as soon as we sign up
      // req.logIn will establish our session.
      req.logIn(newUser, function(loginErr) {
        if (loginErr) return next(loginErr);
        // We respond with a response object that has user with _id and email.
        res.status(200).send({
          user: _.omit(user.toJSON(), ['password', 'salt'])
        });
      });
    })
    .then(null, next);
});