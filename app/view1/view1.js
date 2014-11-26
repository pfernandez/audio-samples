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
	
	$scope.fetch = function(url, updateModel) {
		$http.get(url, {cache: $templateCache}).success(function(response) {
			if(updateModel !== false) {
				$scope.data = response;
				
				// Add a field indicating what sound # the array begins with.
				var prevUrl = response.previous;
				$scope.data.start = response.results.length
					* (prevUrl ? getQueryVar(prevUrl, 'page') : 0);
					
				//TODO: link tags
			}
		}).error(function(response, status) {
			console.log(status + " - Request failed: " + response);
		});
	};

	$scope.searchText = function(text) {
		text = text || $scope.query;
		//TODO: multi-word search
		$scope.fetch('http://www.freesound.org/apiv2/search/text/?query='
			+ text + '&fields=name,url,previews,tags,username');
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
		//TODO: Stop playing when search button is clicked
		audio.paused ? audio.play() : audio.pause();
	};
	
	$scope.paused = function() {
		var paused = this.sound.audio.paused;
		if(paused || paused === 'undefined') {
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

.filter("asMinutes", function () {
    return function(time) {
    	var time = time || 0,
			minutes = Math.floor(time / 60),  
			seconds = Math.floor(time - minutes * 60);
        return minutes + ':' + (seconds > 9 ? seconds : '0' + seconds);
    }
})

.filter("noExtension", function () {
    return function(name) {
        return name.replace(/\.[^/.]+$/, "");
    }
});
