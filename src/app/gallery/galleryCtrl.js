angular.module('nicoco').controller('galleryCtrl', ['family', 'portraits', 'weddings', 'horses',
	function (family, portraits, weddings, horses) {
		$('a[data-toggle]').on('click', function (e) {
			e.preventDefault();
			var that = $(this);
			var toggleKey = that.attr('data-toggle');

			that.closest('.container').find('div[data-toggle]').collapse('hide');
			that.closest('.container').find('div[data-toggle=' + toggleKey + ']').collapse('toggle');
		});

		this.family = family;
		this.portraits = portraits;
		this.weddings = weddings;
		this.horses = horses;
	}]);
