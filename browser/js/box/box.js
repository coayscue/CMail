app.config(function($stateProvider) {
  $stateProvider.state('box', {
    url: '/box/:boxName',
    templateUrl: '/js/box/box.html',
    controller: 'BoxController',
    resolve: {
      box: function($stateParams, MessageFactory, AuthService, Session) {
        return AuthService.getLoggedInUser()
          .then(function(user) {
            if (user) {
              return MessageFactory.fetch($stateParams.boxName, Session.user.email)
                .then(function(messages) {
                  return messages.sort(function(a, b) {
                    if (b.date && a.date) {
                      return new Date(b.date).getTime() - new Date(a.date).getTime();
                    }
                  });
                })
            } else {
              return undefined;
            }
          })
      }
    }
  })
})

app.controller('BoxController', function($scope, $rootScope, MessageFactory, $state, box, $stateParams, Session) {

  $scope.box = box;



  if (!box) {
    $state.go('login');
  }

  //to view a message in conversation context
  $scope.view = function(message) {
    if ($stateParams.boxName === 'drafts') {
      MessageFactory.holdMessage = message;
      $state.go('newmessage');
    } else {
      MessageFactory.setSeen(message)
        .then(function(resMessage) {
          //set the selected message to the updated one
          MessageFactory.holdMessage = resMessage;
          message = resMessage;
          $state.go('conversation')
        });
    }
  }


  //filter messages based on user input
  $scope.$on("refilter", function(event, filter) {
    $scope.box = box.filter(function(message) {
      if (message.senderEmail.indexOf(filter) > -1 || message.subject.indexOf(filter) > -1 || message.body.indexOf(filter) > -1) {
        return true;
      }
    })
  })

  //continually check for new messages
  setInterval(function() {
    MessageFactory.fetch($stateParams.boxName, Session.user.email)
      .then(function(messages) {
        var oldBox = $scope.box;
        $scope.box = messages.sort(function(a, b) {
          if (b.date && a.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        });
        if (oldBox.length !== $scope.box.length) {
          $rootScope.$broadcast("statusUpdate", {
            success: true,
            message: "New Mail"
          })
        }
      })
  }, 10000)

});