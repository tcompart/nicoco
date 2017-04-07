angular.module('nicoco').service('login', ['$window','$http', function ($window, $http) {
	this.token = function (username) {
		return $http.post('/server/index.php', { 'username': username }).then(function (response) {
			$window.localStorage.nicoco_token = response.data;
		});
	};

	this.login = function (username, password) {
		var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, $window.localStorage.nicoco_token);
		hmac.update(password);
		return $http.post('/server/index.php', {
			'username': username,
			'password': hmac.finalize()
		});
	};
}]);
