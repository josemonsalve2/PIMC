(function () {

    'use strict';

    var pimcLogin = angular
        .module('loginModule',
        ['ngAnimate',
            'ngSanitize',
            'ui.bootstrap',
            'ngTouch'])
        .controller('loginController', ['$scope', '$location', 'loginService', loginControllerFnc])
        .factory('loginService',
        ['$http',
            'pimcService',
            loginServiceFcn]);

    function loginServiceFcn($http, pimcService) {
        var service = {};

        service.Login = function(username, password, callback) {
            var urlAuth = pimcService.authURL;
            $http.post(urlAuth, { username: username, password: password })
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.data.access_token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({ username: username, access_token: response.data.access_token }));

                        // execute callback with true to indicate successful login
                        callback(true);
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false);
                    }
                }, function() {
                    callback(false);
                });
        };
        service.Logout = function() {
            // remove user from local storage and clear http auth header
            localStorage.removeItem('currentUser');
        };

        return service;

        

        
    }
    function loginControllerFnc($scope, $location, loginService) {
        var vm = this;

        vm.login = login;

        initController();
        $scope.vm = vm;
        function initController() {
        };

        function login() {
            vm.loading = true;
            loginService.Login(vm.username, vm.password, function (result) {
                if (result === true) {
                    $location.path('/');
                } else {
                    vm.error = 'Nombre de usuario o contraseña incorrectos';
                    vm.loading = false;
                }
            });
        };
    }
})(window.angular);