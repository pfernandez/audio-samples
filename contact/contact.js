
angular.module('audio-samples.contact', ['ngRoute'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.when('/contact', {
			templateUrl: 'contact/contact.html',
			controller: 'Contact'
		});
		$locationProvider.html5Mode(true);
	}
])

.controller('Contact', function($scope, $http) {
	
	$scope.formData = {};
	
	// Don't show submission message when the page loads.
	$scope.submission = false;
	
	// Encode data as a query string.
	var param = function(data) {
		var returnString = '';
		for(d in data){
			if(data.hasOwnProperty(d)) {
				returnString += d + '=' + data[d] + '&';
			}
		}
		// Remove the last ampersand and return.
		return returnString.slice( 0, returnString.length - 1 );
	};
	
	$scope.submitForm = function() {
		$http({
			method : 'POST',
			url : 'contact/contact.php',
			data : param($scope.formData), // pass in data as strings
			// Set the headers so angular passing info as form data (not request payload).
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
		}).success(function(data) {
		  if (!data.success) {
				// If not successful, bind errors to error variables.
				$scope.errorName = data.errors.name;
				$scope.errorEmail = data.errors.email;
				$scope.errorTextarea = data.errors.message;
				$scope.submissionMessage = data.messageError;
				$scope.submission = true; //shows the error message
		  } else {
				// If successful, bind success message to message.
				$scope.submissionMessage = data.messageSuccess;
				$scope.formData = {}; // form fields are emptied with this line
				$scope.submission = true; //shows the success message
		  }
		});
	}
	
});
