angular.module('info-hub').controller({
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
      }).error(function  () {
        $scope.status = 'error';
        $scope.message = 'Failure!';
      }).then(function () {
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
      console.log(id);
      $scope.filter[id] = !$('#' + id).hasClass('active');
    }
  }
});