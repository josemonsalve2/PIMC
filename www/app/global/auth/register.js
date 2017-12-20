(function () {
    
        'use strict';
    
        var pimcLogin = angular
            .module('pimcRegisterModule',
            ['ngAnimate',
                'ngSanitize',
                'ui.bootstrap',
                'ngTouch'])
            .controller('pimcRegisterController', ['$scope', '$location', 'registerService', registerControllerFnc])
            .factory('registerService',
            ['$http',
                'pimcService',
                registerServiceFcn]);

        function registerServiceFcn($http, pimcService) {
            var service = {};
    
            service.Register = function(datosLogin, callback) {
                var urlRegistro = pimcService.registerURL;
                $http.post(urlRegistro, datosLogin)
                    .then(function (response) {
                        // login successful if there's a token in the response
                        if (response.data.status == "Success") {
                            // execute callback with true to indicate successful login
                            callback(true, response.data.message);
                        } else if (respose.data.message) {
                            // execute callback with false to indicate failed login
                            callback(false, respose.data.message);
                        } else {
                            callback(false, "Error desconocido");
                        }
                    }, function(respuesta) {
                        if (respuesta.data.message)
                            callback(false, "" + respuesta.data.message);
                        else
                            callback(false, "Error desconocido")
                    });
            };
    
            return service;
    
            
    
            
        }
        
        function registerControllerFnc($scope, $location, registerService) {
            var vm = this;
            $scope.vm = vm;
            vm.register = function () {
                var datosRegistro = {};
                datosRegistro.nombreReal = vm.nombreReal;
                datosRegistro.email = vm.email;
                datosRegistro.nombreUsuario = vm.username;
                datosRegistro.contrasenna = vm.password;
                vm.loading = true;
                registerService.Register(datosRegistro, function (exito, mensaje){
                    if (exito) {
                        vm.info = "Usuario creado exitosamente. En este momento nos encontramos validando tu usuario";
                        vm.ocultarFormulario = true;
                    } else {
                        vm.error = mensaje;
                    }
                    vm.loading = null;
                })
            }
        }
    })(window.angular);