angular.module('nicoco').service('login', ['$window','$http', function ($window, $http) {
	this.token = function (username) {
		console.log('Trying to get token for user \'', username, '\'');
		return $http.post('/server/index.php', { "username": username }).then(function (response) {
			console.log('Got token for user \'', username, '\', token: ', response.data);
			$window.localStorage.nicoco_token = response.data;
		});
	};
	
	this.login = function (username, password) {
		var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, $window.localStorage.nicoco_token);
		hmac.update(password);
		console.log('Starting login for user \'', username, '\', with hmac: ',hmac);
		return $http.post('/server/index.php', {
			"username": username,
			"password": hmac.finalize()
		});
	};
}]);
