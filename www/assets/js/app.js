/* AngularJS App 
Adam Sofokleous */
'use strict';

var app = angular.module('foreign', [
	'ngRoute'
]);

/* Routes */
// app.config(['$routeProvider', function($routeProvider){
// 	$routeProvider
// 	//Home
// 	// .when("/", {templateUrl: "welcome.html", controller: "CheckLogin"})
// 	// .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
// }]);

app.controller('SignupForm', function($scope){
	$scope.signupInfo = {};
	$scope.registerUser = function() {
		console.log($scope.signupInfo);
		console.log('Register user with Hoodie here');
	}
});

app.controller('CheckLogin', function($scope){
	console.log('Hello World');
	$scope.loginInfo = {};
	$scope.saveData = function() {
		console.log($scope.loginInfo);
		console.log('Login user with Hoodie here');
	}
});

app.directive('menuBar', function() {
	return {
		// scope:
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/menu_bar.html'
	}
});

app.directive('pageHeader', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/page_header.html'
	}
});

app.directive('shelterBanner', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/shelter.html'
	}
});

app.directive('footer', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'templates/footer.html'
	}
});

app.directive('welcomePage', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'partials/welcome.html'
	}
});