InfoHub.controller({
  LoginController: function ($scope, $http, authService) {
    $scope.status = '';

    $scope.login = function() {
      $http.post('login', {username: $scope.user, password: $scope.pass}).success(function() {
        authService.loginConfirmed();
      }).error(function () {
        $scope.status = 'error';
      });
    };
  }
});