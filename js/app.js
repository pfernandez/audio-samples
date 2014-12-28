'use strict';

// Declare app level module which depends on views, and components
angular.module('audio-samples', [
	'ngRoute',
	'audio-samples.search',
	'audio-samples.view2',
])
.config(['$routeProvider', '$locationProvider', 
function($routeProvider, $locationProvider) {
	$routeProvider.otherwise({redirectTo: '/search'});
	//$locationProvider.html5Mode(true); //see https://github.com/nodeapps/http-server/issues/80
}]);
