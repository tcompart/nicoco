/*global $*/
angular.module('nicoco').directive('carousel', ['slides', function (slides) {
	return {
		templateUrl: '/carousel.html',
		restrict: 'E',
		bindToController: 'true',
		controllerAs: 'carousel',
		controller: function () {
			this.slides = slides;
			$('#carousel').carousel({	interval: 3000 });
		}
	};
}]);
