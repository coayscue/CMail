'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  recipientEmail: String,
  recipientName: String,
  senderEmail: String,
  senderName: String,
  date: Date,
  draft: Boolean,
  seen: Boolean,
  subject: String,
  body: String
});

mongoose.model('Message', schema);