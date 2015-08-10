app.factory('MessageFactory', function($http) {
  return {
    send: function(message) {
      return $http.post('/api/messages/outbound', message)
        .then(function(res) {
          return res.data
        })
    },

    fetch: function(box, userEmail) {
      return $http.get('/api/messages/' + box + '/' + userEmail)
        .then(function(res) {
          return res.data
        })
    },

    getConvo: function() {
      return $http.get('/api/messages/conversation/' + this.holdMessage.recipientEmail + '/' + this.holdMessage.senderEmail)
        .then(function(res) {
          return res.data;
        })
    },

    save: function(message) {
      message.draft = true;
      return $http.post('/api/messages/save', message)
        .then(function(res) {
          return res.data;
        })
    },

    setSeen: function(message) {
      message.seen = true;
      return $http.put('/api/messages/seen', message)
        .then(function(res) {
          return res.data;
        })
    },

    holdMessage: undefined
  }
})