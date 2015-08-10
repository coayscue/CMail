app.config(function($stateProvider) {
  $stateProvider.state('conversation', {
    url: '/conversation',
    templateUrl: '/js/conversation/conversation.html',
    resolve: {
      conversationMessages: function($state, MessageFactory, AuthService) {
        if (AuthService.isAuthenticated()) {
          return MessageFactory.getConvo()
            .then(function(conversationMessages) {
              return conversationMessages.sort(function(a, b) {
                if (b.date && a.date) {
                  return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
              })
            })
        } else {
          return undefined;
        }
      }
    },
    controller: 'ConversationController'
  })
})

app.controller('ConversationController', function($state, $scope, conversationMessages, Session, MessageFactory) {
  if (!conversationMessages) {
    $state.go('login');
  }

  //for date filter
  $scope.offset = new Date().getTimezoneOffset();

  if (MessageFactory.holdMessage.senderEmail === Session.user.email) {
    $scope.peerEmail = MessageFactory.holdMessage.recipientEmail;
    $scope.peerName = MessageFactory.holdMessage.recipientEmail
  } else {
    $scope.peerEmail = MessageFactory.holdMessage.senderEmail;
    $scope.peerName = MessageFactory.holdMessage.senderName;
  }
  $scope.subject = MessageFactory.holdMessage.subject;
  $scope.user = Session.user

  $scope.conversationMessages = conversationMessages;

  $scope.reply = function() {
    MessageFactory.holdMessage = {
      senderEmail: Session.user.email,
      senderName: Session.user.name,
      recipientEmail: $scope.peerEmail,
      recipientName: $scope.peerName,
      subject: $scope.subject
    }
    $state.go('newmessage');
  }
});