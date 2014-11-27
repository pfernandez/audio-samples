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
		'Token 9b72591754173d4d8baecbfb4f410c7bad47c138';
	$scope.query = '';
	$scope.data = {};
	
	$scope.fetch = function(url) {
	
		// Pause any currently playing sounds.
		($scope.data.results || []).map(function(sound) {
			if(isLoaded(sound)) { sound.audio.pause() }
		});
	
		$http.get(url.replace('http:', 'https:'), {cache: $templateCache})
		.success(function(response) {
			
			// Add a field indicating what sound # the array begins with.
			var prevUrl = response.previous;
			response.start = response.results.length
				* (prevUrl ? getQueryVar(prevUrl, 'page') : 0);
			
			// Set default player values.
			response.results.map(function(sound) {
				sound.audio = {progress: 0, volume: 1};
			});
			
			$scope.data = response;
				
		}).error(function(response, status) {
			console.log(status + " - Request failed: " + response);
		});
	};

	$scope.searchText = function(text) {
		$scope.fetch('https://www.freesound.org/apiv2/search/text/?query='
			+ encodeURIComponent(text || $scope.query) 
			+ '&fields=name,url,previews,tags,username');
	};
	
	$scope.play = function() {
		var sound = this.sound;
		if(! isLoaded(sound)) {
			// Test for mp3/ogg browser compatibility and load the sound.
			var el = document.createElement('audio');
			if(el.canPlayType) {
				var source;
				if(el.canPlayType('audio/ogg; codecs="vorbis"')) {
					source = sound.previews['preview-hq-ogg'];
				} else if(el.canPlayType('audio/mpeg')) {
					source = sound.previews['preview-hq-mp3'];
				}
				if(source) {
					sound.audio = ngAudio.load(source);
					sound.audio.paused = true;
				}
			}
			if(!sound.audio) {
				alert("Sorry, your web browser doesn't support HTML audio"); 
			}
		}
		var audio = sound.audio;
		audio.paused ? audio.play() : audio.pause();
	};
	
	$scope.isPaused = function(sound) {
		if( !isLoaded(sound) || sound.audio.paused ) {
			return true;
		} else {
			return false;
		}
	};
	
	function getQueryVar(url, variable) {
		var vars = url.split("&");
		for (var i=0; i<vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable) {
				return pair[1];
			}
		}
		return false;
	}
	
	function isLoaded(sound) {
		return !!(sound.audio && sound.audio.id);
	}
	
}])

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.filter('numberWithCommas', function () {
    return function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
})

.filter('asMinutes', function () {
    return function(time) {
    	var time = time || 0,
			minutes = Math.floor(time / 60),  
			seconds = Math.floor(time - minutes * 60);
        return minutes + ':' + (seconds > 9 ? seconds : '0' + seconds);
    }
})

.filter('noExtension', function () {
    return function(name) {
        return name.replace(/\.[^/.]+$/, "");
    }
});
