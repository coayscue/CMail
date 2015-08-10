app.directive('folders', function() {
  return {
    restrict: 'E',
    templateUrl: 'js/folders/folders.html',
    controller: 'FoldersController'
  };
});

app.controller('FoldersController', function($scope, $state, Session, MessageFactory) {

  $scope.folders = ["Inbox", "Sent", "Drafts", "Junk", "Groups"];

  $scope.currentFolder = "Inbox";
  $state.go("box", {
    boxName: "inbox"
  });

  //compose new message
  $scope.compose = function() {
    MessageFactory.holdMessage = {
      senderEmail: Session.user.email,
      senderName: Session.user.name
    }
    $state.go('newmessage');
  }

  //go to this folder
  $scope.viewFolder = function(folder) {
    $state.go("box", {
      boxName: folder.toLowerCase()
    });
    $scope.currentFolder = folder;
  }

});