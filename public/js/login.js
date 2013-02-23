angular.module('info-hub').controller({
  LoginController: function ($scope, $http, authService) {
    $scope.submit = function() {
      $http.post('login', {username: $scope.user, password: $scope.pass}).success(function() {
        authService.loginConfirmed();
      }).error(function () {
      	// ...
      });
    }
  }
});