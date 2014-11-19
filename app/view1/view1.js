'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'view1/view1.html',
		controller: 'FetchSounds'
	});
}])

.controller('FetchSounds', ['$scope', '$http', '$templateCache',
function($scope, $http, $templateCache) {

	$http.defaults.headers.common.Authorization = 
		'Token 9b72591754173d4d8baecbfb4f410c7bad47c138';
	$scope.query = '';
	$scope.data = {};

	$scope.fetch = function(url, updateModel) {
		$http.get(url, {cache: $templateCache}).success(function(response) {
			if(updateModel !== false) {
				$scope.data = response;
				
				// TODO: to remove name extensions: x.replace(/\.[^/.]+$/, "")
			/*
				$scope.data = _.omit(response, 'results');
				$scope.data.results = [];
				_.each(response.results, function(element, index) {
					$http.get('http://www.freesound.org/apiv2/sounds/' 
						+ element.id + '/').success(function(result) {
						$scope.data.results[index] = result;
					});
				});
				*/
			}
		}).error(function(response, status) {
			console.log(status + " - Request failed: " + response);
		});
	};

	$scope.searchText = function() {
		$scope.fetch('http://www.freesound.org/apiv2/search/text/?query='
			+ $scope.query + '&fields=name,url,previews,tags,username');
	};
}
]).
filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
