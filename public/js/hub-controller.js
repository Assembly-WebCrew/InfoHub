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

    $scope.toggle = function (id) {
      $scope.filter[id] = !$('#' + id).hasClass('active');
    }
  }
});

InfoHub.directive('tooltipDirective', function() {
  // Return the directive link function.
  return function(scope, element, attrs) { 

  // watch the expression, and alert the class.
  //the directive has access to the whole element
  scope.$watch(attrs.outputDirective, function (value) {
      element.tooltip({ placement: 'bottom', container: '.broadcast-form' });
  });
      
}
});