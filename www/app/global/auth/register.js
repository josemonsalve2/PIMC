(function () {
    
        'use strict';
    
        var pimcLogin = angular
            .module('pimcRegisterModule',
            ['ngAnimate',
                'ngSanitize',
                'ui.bootstrap',
                'ngTouch'])
            .controller('pimcRegisterController', ['$scope', '$location', 'loginService', registerControllerFnc])
                
        
        function registerControllerFnc($scope, $location, loginService) {
            var vm = this;
            $scope.vm = vm;
            vm.register = function () {
                vm.error = 'Por favor contacte a soporte técnico';
            }
        }
    })(window.angular);