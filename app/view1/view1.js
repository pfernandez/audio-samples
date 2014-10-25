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

	$http.defaults.headers.common.Authorization = 
		'Token 9b72591754173d4d8baecbfb4f410c7bad47c138';
	$scope.query = 'piano';
	$scope.data = {};

	$scope.fetch = function(url, updateModel) {
		$http.get(url, {cache: $templateCache}).success(function(response) {
		console.log(response);
			if(updateModel !== false) {
				$scope.data = _.omit(response, 'results');
				$scope.data.results = [];
				_.each(response.results, function(element, index) {
					$http.get('http://www.freesound.org/apiv2/sounds/' 
						+ element.id + '/').success(function(result) {
						$scope.data.results[index] = result;
					});
				});
			}
		}).error(function(response, status) {
			console.log(status + " - Request failed: " + response);
		});
	};

	$scope.searchText = function() {
		$scope.fetch('http://www.freesound.org/apiv2/search/text/?query='
			+ $scope.query);
	};
}
]);
