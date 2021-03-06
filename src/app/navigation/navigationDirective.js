angular.module('nicoco').directive('navigation', [function () {
	return {
		templateUrl: '/navigation.html',
		restrict: 'E',
		bindToController: true,
		controllerAs: 'nav',
		controller: function () {
			this.navigationPoints = [
				{title: 'Galerien', link: '/gallery'},
				{title: 'Über mich', link: '/aboutme'},
				{title: 'Angebote', link: '/offer'},
				{title: 'Blog', link: '/wordpress/', deeplink: true },
				{title: 'Datenschutz', link: '/privacy'}
			];
		}
	};
}]);
