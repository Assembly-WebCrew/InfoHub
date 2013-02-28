InfoHub.controller({
  HubController: function ($scope, $http, $timeout) {
    $scope.status = '';
    $scope.filter = {};

    $scope.broadcast = function  () {
     $http.post('api/broadcast',
      { message: $scope.message,
        filter: $scope.filter
      }).success(function (res) {
        $scope.status = 'success';
        $scope.message = 'Success!';
        $timeout(function () {
          $scope.status = '';
          $scope.message = '';
        }, 1000);
      }).error(function  () {
        $scope.status = 'error';
        $scope.message = 'Failure!';
        $timeout(function () {
          $scope.status = '';
          $scope.message = '';
        }, 1000);
      });
    }

    $http.get('api/outputs').success(function (data) {
      $scope.outputs = data;
      Object.keys(data).forEach(function (i) {
        $scope.filter[data[i].id] = false;
      });
    });

  }
});

InfoHub.directive('outputToggles', function () {
  return {
    template: '<ul class="btn-group output-modules"></ul>',
    replace: true,
    restrict: 'E',
    compile: function (tElem, tAttrs, transclude) {
      return {
        post: function (scope, iElem, iAttrs, controller) {
          scope.$watch('outputs', function (newVal, oldVal) {
            angular.forEach(newVal, function (v, k) {
              var butt = angular.element('<li />')
                .addClass('btn')
                .attr({
                  'data-toggle': 'buttons-checkbox',
                  'id': v.id,
                  'title': v.description })
                .tooltip({
                  placement: 'bottom',
                  container: tElem.parent() })
                .text(v.name);

              if (v.online) {
                butt.append(' <i class="icon-ok-sign" />');
              } else {
                butt.append(' <i class="icon-remove-sign" />');
              }

              butt.on('click', function (e) {
                scope.filter[v.id] = !scope.filter[v.id];
                scope.$digest();
              });

              iElem.append(butt);
            });
          })
        }
      }
    }
  }
});