angular.module('nicoco')
	.controller('headerController', ['$rootScope', '$location', function ($rootScope, $location) {
		var me = this;
		function evaluateLocation() {
			me.showCarousel = $location.path() === '/home';
		}
		evaluateLocation();
		$rootScope.$on('$locationChangeStart', evaluateLocation);
	}])
	.directive('headerDirective', function () {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: '/header.html',
			bindToController: true,
			controllerAs: 'header',
			controller: 'headerController'
		};
	});
