/*globals Masonry, imagesLoaded */
angular.module('nicoco')
	.directive('masonry', [function () {
		'use strict';
		return {
			restrict: 'E',
			replace: true,
			scope: {
				input: '=',
				gallery: '='
			},
			template: '<div class="row">' +
      '<div class="photos {{gallery}}">' +
			'<a class="grid-item" ng-repeat="entry in input" href="" ' +
      'data-gallery="{{gallery}}" ' +
      'data-toggle="lightbox" ' +
      'data-remote="{{entry.src}}" ' +
      'data-width="800" ' +
      'data-title="{{entry.desc}}">' +
			'<img ng-src="/{{entry.src}}" class="img-responsive thumbnail" />' +
			'</a>' +
      '</div>' +
      '</div>',
			link: function ($scope, element) {
				$(element).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
					event.preventDefault();
					return $(this).ekkoLightbox({
						always_show_close: true,
						remote: $(this).children('img').attr('src'),
						type: 'image',
            left_arrow_class: '',
            right_arrow_class: ''
					});
				});
			}

		};
	}]);
