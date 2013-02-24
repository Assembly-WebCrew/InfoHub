var InfoHub = angular.module('info-hub', ['http-auth-interceptor'])
  .directive('infoHubApplication', function() {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        //once Angular is started, remove class:
        elem.removeClass('waiting-for-angular');
        
        var login = elem.find('.login-container');
        var main = elem.find('.main-container');
        
        login.hide();
        
        scope.$on('event:auth-loginRequired', function() {
          login.slideDown(300, function() {
            main.fadeOut(150);
          });
        });
        scope.$on('event:auth-loginConfirmed', function() {
          main.show();
          login.slideUp(300);
        });
      }
    }
  });