angular.module('nicoco').controller('loginCtrl', ['login', function (login) {
	var me = this;
	this.loginForm = {};
	this.submitted = false;
	this.failed = false;
	this.login = function () {
		me.submitted = true;
		var valid = this.loginForm.$valid;
		me.failed = !valid;
		if (valid) {
			var username = this.loginForm.username.$modelValue;
			login.token(username).then(function () {
				login.login(username, this.loginForm.password.$modelValue);
			});
		}
	};
}]);
