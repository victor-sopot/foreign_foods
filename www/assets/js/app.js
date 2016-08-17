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

app.controller('CheckLogin', function($scope){
	console.log('Hello World');
	$scope.formInfo = {};
	$scope.saveData = function() {

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