'use strict';

// Declare app level module which depends on views, and components
angular.module('audio-samples', [
  'ngRoute',
  'audio-samples.view1',
  'audio-samples.view2',
  'audio-samples.version',
  'ngAudio', //TODO: Should this be here, in the view module, or both?
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
