app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

var shallowCopy = function(obj) {
    var retObj = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            retObj[prop] = obj[prop]
        }
    }
    return retObj;
}

app.controller('LoginCtrl', function($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginInfo) {
        $scope.error = null;
        var loginFo = shallowCopy(loginFo);
        loginFo.email = loginInfo.email + '@christianayscue.com';
        AuthService.login(loginFo).then(function() {
            $state.go('box', {
                boxName: 'inbox'
            });
        }).catch(function() {
            $scope.error = 'Invalid login credentials.';
        });
    };

    $scope.submitForm = function(newuser) {
        newuser.email += '@christianayscue.com';
        AuthService.signUp(newuser)
            .then(function() {
                $state.go('box', {
                    boxName: 'inbox'
                });
            }).catch(function() {
                $scope.error = 'Could not sign up. Try again.'
            })
    }
});