'use strict';

angular.module('audio-samples.view1', ['ngRoute', 'ngAudio'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: 'view1/view1.html',
		controller: 'FetchSounds'
	});
}])

.controller('FetchSounds',['$scope', '$http', '$templateCache', 'ngAudio',
function($scope, $http, $templateCache, ngAudio) {

	$http.defaults.headers.common.Authorization = 
		'Token XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	$scope.query = '';
	$scope.data = {};
	
	$scope.fetch = function(url, updateModel) {
		$http.get(url, {cache: $templateCache}).success(function(response) {
			if(updateModel !== false) {
				$scope.data = response;
				//TODO: remove name extensions: x.replace(/\.[^/.]+$/, "")
				//TODO: number each result accurately regardless of page
			}
		}).error(function(response, status) {
			console.log(status + " - Request failed: " + response);
		});
	};

	$scope.searchText = function() {
		$scope.fetch('http://www.freesound.org/apiv2/search/text/?query='
			+ $scope.query + '&fields=name,url,previews,tags,username');
	};
	
	$scope.play = function() {
		var sound = this.sound;
		if(! sound.audio) {
			//TODO: Test for mp3/ogg browser compatibility.
			sound.audio = ngAudio.load(
				sound.previews['preview-hq-ogg']);
			sound.audio.paused = true;
		}
		var audio = sound.audio;
		audio.paused ? audio.play() : audio.pause();
	}
	
	$scope.paused = function() {
		var paused = this.sound.audio.paused;
		if(paused || paused === 'undefined') {
			return true;
		} else {
			return false;
		}
	}
	
}])

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.filter("asMinutes", function () {
    return function(time) {
    	var time = time || 0,
			minutes = Math.floor(time / 60),  
			seconds = Math.floor(time - minutes * 60);
        return minutes + ':' + (seconds > 9 ? seconds : '0' + seconds);
    }
});
