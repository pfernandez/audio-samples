'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  
  $scope.message1 = 'angular sux';
}])

.controller('FetchController', ['$scope', '$http', '$templateCache',
  function($scope, $http, $templateCache) {
    $scope.method = 'GET';
    $scope.url = 'http://www.freesound.org/apiv2/search';
    $scope.queryType = 'text';
    $scope.query = 'piano';
    $scope.url = $scope.url + '/' + $scope.queryType + '/?query=' + $scope.query;
    $http.defaults.headers.common.Authorization = 
      'Token 9b72591754173d4d8baecbfb4f410c7bad47c138';
    $scope.data = null;

    var fetch = function() {
      $scope.code = null;
      $scope.response = null;
      $http({
          method: $scope.method, 
          url: $scope.url,
          cache: $templateCache
        }).
        success(function(data) {
        console.log(data);
          return data;
          //$scope.jsonString = JSON.stringify(data, undefined, 2);
        }).
        error(function(data, status) {
          return "Request failed: " + status;
      });
    };

    $scope.updateModel = function(url) {
      if(url) $scope.url = url;
      var data = fetch();
      
      $scope.data = data;
    };
  }]);
