var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
//var Auth = require('../auth.middleware.js');

var sendMessage = require('../mandrill/sendEmail.js'); //takes: to_name, to_email, from_name, from_email, subject, message_html

var Message = mongoose.model('Message');


//-----------New Message----------
//send and save
router.post('/outbound', function(req, res, next) {
  //if has id, it was loaded from drafts, so update it in the db
  if (req.body.draft) {
    req.body.draft = false
    req.body.date = new Date();
    Message.findByIdAndUpdate(req.body._id, req.body).exec()
      .then(function(message) {
        //send the email
        sendMessage(message.recipientName, message.recipientEmail, message.senderEmail, message.senderEmail, message.subject, message.body)
        res.json(message)
      })
      .then(null, next);
  } else {
    req.body.draft = false
    req.body.date = new Date();
    Message.create(req.body)
      .then(function(message) {
        //send the email
        sendMessage(message.recipientName, message.recipientEmail, message.senderEmail, message.senderEmail, message.subject, message.body);
        return message;
      })
      .then(function(message) {
        res.json(message)
      })
      .then(null, next);
  }
})

//-----------Receive Message---------
//receive and save messages from mandrill
router.post('/inbound', function(req, res, next) {
  //transfrom the mandril message
  res.sendStatus(200);

  var msg = JSON.parse(req.body.mandrill_events)[0].msg;
  var email = {
      recipientEmail: msg.email,
      recipientName: msg.to[0][0],
      senderEmail: msg.from_email,
      senderName: msg.from_name,
      date: msg.headers.Date,
      draft: false,
      seen: false,
      subject: msg.subject,
      body: msg.text
    }
    //create the message in the database
  Message.create(email)
    .then(function(message) {
      //send the email
      console.log("Saved message--", message)
    })
    .then(null, next);
})


//-----------Inboxes----------

//get inbox
router.get('/inbox/:userEmail', function(req, res, next) {
  //do some authentication

  Message.find({
      recipientEmail: req.params.userEmail
    }).exec()
    .then(function(emails) {
      res.json(emails);
    })
    .then(null, next);
})


//get sent
router.get('/sent/:userEmail', function(req, res, next) {
  Message.find({
      senderEmail: req.params.userEmail,
      draft: false
    }).exec()
    .then(function(emails) {
      res.json(emails)
    })
    .then(null, next)
})

//get drafts
router.get('/drafts/:userEmail', function(req, res, next) {
  Message.find({
      senderEmail: req.params.userEmail,
      draft: true
    }).exec()
    .then(function(emails) {
      res.json(emails);
    })
    .then(null, next);
})

//-----------Conversation-------

//get in conversation
router.get('/conversation/:userEmail/:peerEmail', function(req, res, next) {
  //get all messages between the user and the peer
  var convoEmails = [];
  Message.find({
      senderEmail: req.params.userEmail,
      recipientEmail: req.params.peerEmail,
      draft: false
    }).exec()
    .then(function(emailsFrom) {
      convoEmails = convoEmails.concat(emailsFrom);
      return Message.find({
        senderEmail: req.params.peerEmail,
        recipientEmail: req.params.userEmail,
      })
    })
    .then(function(emailsTo) {
      convoEmails = convoEmails.concat(emailsTo);
      res.json(convoEmails);
    })
    .then(null, next);
});



//----------Helpers---------

//save to drafts
router.post('/save', function(req, res, next) {
  if (req.body.draft) {
    req.body.date = new Date();
    Message.findByIdAndUpdate(req.body._id, req.body).exec()
      .then(function(message) {
        res.json(message)
      })
  } else {
    req.body.draft = true;
    req.body.date = new Date();
    Message.create(req.body)
      .then(function(message) {
        res.json(message);
      })
      .then(null, next);
  }
});

//set a message as seen
router.put('/seen', function(req, res, next) {
  Message.findByIdAndUpdate(req.body._id, req.body).exec()
    .then(function(email) {
      res.json(email);
    })
    .then(null, next);
})



//