'use strict';

angular.module('audio-samples', [
	'ngRoute',
	'ngAudio',
	'angular-loading-bar',
	'ngAnimate',
	'audio-samples.search',
	'audio-samples.contact'
])

.config([
	'$routeProvider',
	'$locationProvider',
	function($routeProvider, $locationProvider) {
	
		$routeProvider.when('/', {
			templateUrl: 'search/search.html',
			controller: 'Search'
		})
		.when('contact', {
			templateUrl: 'contact/contact.html',
			controller: 'Contact'
		})
		.otherwise({redirectTo: '/'});
	
		$locationProvider.html5Mode(true);
	}
])

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);

