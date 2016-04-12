angular.module('nicoco', ['ui.router', 'ngMessages'])
	.constant('wordpress', 'http://www.nicoco.de/wordpress')
	.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
		$rootScope.$on('$stateChangeSuccess', function (event) {
			if ($window.ga) {
				$window.ga('send', 'pageview', {page: $location.path()});
			}
		});
	}])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
		$locationProvider.hashPrefix('!');

		$urlRouterProvider.otherwise("/home");

		$stateProvider.state({
			name: 'home',
			url: '/home',
			template: ' '
		});
		$stateProvider.state({
			name: 'gallery',
			url: '/gallery',
			templateUrl: '/gallery.html',
			controller: 'galleryCtrl as gallery'
		});
		$stateProvider.state({
			name: 'aboutme',
			url: '/aboutme',
			templateUrl: '/aboutme.html'
		});
		$stateProvider.state({
			name: 'offer',
			url: '/offer',
			templateUrl: '/offer.html'
		});
		$stateProvider.state({
			name: 'login',
			url: '/login',
			templateUrl: '/login.html'
		});
		$stateProvider.state({
			name: 'impressum',
			url: '/impressum',
			templateUrl: '/impressum.html'
		});
	}]);
