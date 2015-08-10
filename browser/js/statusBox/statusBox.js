app.directive('statusBox', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/statusBox/statusBox.html',
    controller: 'StatusBoxController'
  }
})

app.controller('StatusBoxController', function($scope, $rootScope) {

  var errorStyle = {
    'background-color': 'red',
    'opacity': '1'
  }

  var successStyle = {
    'background-color': 'green',
    'opacity': '1'
  }

  var noStyle = {
    'transition': 'all 0.2s',
    'opacity': '0'
  }

  $scope.statusStyle = noStyle;

  $rootScope.$on('statusUpdate', function(event, data) {
    if (data.success) {
      $scope.statusStyle = successStyle;
      $scope.statusMessage = data.message;
    } else {
      $scope.statusStyle = errorStyle;
      $scope.statusMessage = data.message;
    }
    setTimeout(function() {
      $scope.statusStyle = noStyle;
      $rootScope.$digest()
    }, 2000)
  })

})