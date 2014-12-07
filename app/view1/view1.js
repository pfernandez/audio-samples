'use strict';

//TODO: URL bookmarking & back/forward navigation.

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
		'Token XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	$scope.query = '';
	$scope.data = {};
	
	$scope.fetch = function(url) {
	
		// Pause any currently playing sounds.
		($scope.data.results || []).map(function(sound) {
			if(isLoaded(sound)) { sound.audio.pause() }
		});
	
		$http.get(url.replace('http:', 'https:'), {cache: $templateCache})
		.success(function(response) {
			
			// Add fields indicating the current page number and what sound
			// number the page begins with.
			var prevUrl = response.previous,
				prevPage = (prevUrl ? getQueryVar(prevUrl, 'page') : 0);
			response.start = response.results.length * prevPage + 1;
			response.thisPage = prevPage + 1;
			
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
	
	$scope.goToPage = function(page) {
		console.log('hello?');
		$scope.fetch('https://www.freesound.org/apiv2/search/text/?query='
			+ encodeURIComponent($scope.query) + '&page='
			+ encodeURIComponent(page || 1)
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
	
	$scope.navNumbers = function() {
	
		var data = $scope.data,
			thisPage = data.thisPage,
			nPages = Math.ceil(data.count / data.results.length),
			nPerPage = 10,
			pageFrac = thisPage / nPerPage,
			roundDn = Math.floor(pageFrac) * nPerPage,
			firstLink = (roundDn > 0 ? roundDn : 1),
			roundUp = Math.ceil(pageFrac) * nPerPage,
			lastLink = (roundUp == firstLink ? roundUp + nPerPage : roundUp),
			lastLink = (nPages < lastLink ? nPages : lastLink),
			result = '';
			
		for(var i=firstLink; i<lastLink; i++) {
			if(thisPage == i) {
				result += '<span class="current">' + i
					 + (i != lastLink-1 ? ',</span> ' : '</span>');
			} else {
				result += '<button ng-click="goToPage(' + i + ')">' + i 
					+ (i != lastLink-1 ? ',</button> ' : '</button>');
			}
		}
	
		if(!(thisPage == nPages) && lastLink < nPages) {
			result += ' <button ng-click="goToPage(' + lastLink 
				+ ')">...</button> <button ng-click="goToPage(' + nPages
				+ ')">' + insertCommas(nPages) + '</button>';
		} else if(thisPage != lastLink) {
			result += ', <button ng-click="goToPage(' + lastLink + ')">' 
				+ lastLink + '</button>';
		} else {
			result += ', ' + lastLink;
		}
		
		return result;
	};
	
	// Return a specified argument from a url string, 
	// either as a number or string as appropriate.
	function getQueryVar(url, variable) {
		var vars = url.split("&");
		for (var i=0; i<vars.length; i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable) {
				var x = pair[1], 
					n = parseFloat(x);
				return !isNaN(n) && isFinite(x) ? n : x;
			}
		}
		return false;
	}
	
	function isLoaded(sound) {
		return !!(sound.audio && sound.audio.id);
	}
	
}])

.directive('dir', function($compile, $parse) {
    return {
      restrict: 'E',
      link: function(scope, element, attr) {
        scope.$watch(attr.content, function() {
          element.html($parse(attr.content)(scope));
          $compile(element.contents())(scope);
        }, true);
      }
    }
  })

.filter('trusted', ['$sce', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    }
}])

.filter('renderHTML', ['$sce', function($sce) {
	return function(html) {
		return $sce.trustAsHtml(html);
	}
}])

.filter('numberWithCommas', function() {
	return function(number) {
		return insertCommas(number);
	}
})

.filter('asMinutes', function() {
	return function(time) {
		var time = time || 0,
			minutes = Math.floor(time / 60),  
			seconds = Math.floor(time - minutes * 60);
		return minutes + ':' + (seconds > 9 ? seconds : '0' + seconds);
	}
})

.filter('noExtension', function() {
	return function(name) {
		return name.replace(/\.[^/.]+$/, "");
	}
});

var insertCommas = function(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
