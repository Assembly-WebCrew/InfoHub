
// Create login directive.
InfoHub.directive('infoHubApplication', function () {
  return {
    restrict: 'C',
    link: function (scope, elem, attrs) {
      elem.removeClass('waiting-for-angular');
      
      var login = elem.find('.login-container');
      var main = elem.find('.main-container');
      
      login.hide();
      
      // Show login form if user performs an action that requires authentication.
      scope.$on('event:auth-loginRequired', function () {
        main.fadeOut(150, function() {
          login.slideDown(300);
        });
      });

      // Once login is confirmed, hide login form.
      scope.$on('event:auth-loginConfirmed', function () {
        login.slideUp(300, function () {
          main.fadeIn(300);
        });
      });
    }
  }
});


InfoHub.controller({
  LoginController: function ($scope, $http, authService) {
    $scope.status = '';

    $scope.login = function() {
      $http.post('login', {username: $scope.user, password: $scope.pass}).success(function() {
        authService.loginConfirmed();
        $scope.status = '';
      }).error(function () {
        $scope.status = 'error';
      });
    };
  }
});