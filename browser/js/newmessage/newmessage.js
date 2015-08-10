app.config(function($stateProvider) {
  $stateProvider.state('newmessage', {
    url: '/newmessage',
    templateUrl: '/js/newmessage/newmessage.html',
    resolve: {
      message: function($state, $stateParams, AuthService, MessageFactory) {
        if (AuthService.isAuthenticated()) {
          return MessageFactory.holdMessage;
        } else {
          $state.go('login');
        }
      }
    },
    controller: 'NewMessageController'
  })
})

app.controller('NewMessageController', function($scope, $state, $rootScope, $stateParams, MessageFactory, message) {

  $scope.message = message;

  $scope.send = function() {
    //send a message to $scope.recipientEmail with subject $scope.subject and body
    MessageFactory.send($scope.message)
      .then(function() {
        $rootScope.$broadcast('statusUpdate', {
          success: true,
          message: 'Sent'
        })
        $state.go('box', {
          boxName: 'inbox'
        })
      })
      .then(null, function() {
        $rootScope.$broadcast('statusUpdate', {
          success: false,
          message: 'Failed Send'
        });
      });
  }

  $scope.save = function() {
    //save all the info, so that this state will be revived when someone clicks on one of their drafts
    MessageFactory.save($scope.message)
      .then(function() {
        $rootScope.$broadcast('statusUpdate', {
          success: true,
          message: 'Saved'
        })
        $state.go('box', {
          boxName: 'inbox'
        });
      })
      .then(null, function() {
        $rootScope.$broadcast('statusUpdate', {
          success: false,
          message: 'Failed Save'
        })
      })
  }

})