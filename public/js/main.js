angular.module('info-hub', ['http-auth-interceptor'])
  /**
   * This directive will find itself inside HTML as a class,
   * and will remove that class, so CSS will remove loading image and show app content.
   * It is also responsible for showing/hiding login form.
   */
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