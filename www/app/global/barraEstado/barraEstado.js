(function (angular) {

    'use strict';

    var barraEstadoModule = angular.module('barraEstadoModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

    // Service para comentarios. Cargar y guardar notas
    barraEstadoModule.service('pimcBarraEstadoService', ['$http', '$q', '$sce', 'pimcService', function($http, $q,  $sce, pimcService){
        // Para cargar los elementos seleccionados luego
        var barraEstadoServiceCtrl = this;
        
        // Para guardar borrar y barra de estado
        barraEstadoServiceCtrl.ultimaAccion = {mensaje: $sce.trustAsHtml("Ninguna")};
        // Log
        barraEstadoServiceCtrl.registrarAccion = function(mensaje) {
            barraEstadoServiceCtrl.ultimaAccion.mensaje = $sce.trustAsHtml(mensaje);
            pimcService.debug(mensaje);
        }
        // Button functions
        barraEstadoServiceCtrl.borrarCambios = function() {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                barraEstadoServiceCtrl.registrarAccion("Los cambios han sido borrados");
                return true;
            }
            return false;
        };
    }]);

    barraEstadoModule.controller('barraEstadoComponentController', ['$scope', 'pimcService', 'pimcBarraEstadoService', function($scope, pimcService, pimcBarraEstadoService) {
        var barraEstadoCtrl = this;
        barraEstadoCtrl.ultimaAccion = pimcBarraEstadoService.ultimaAccion;
//        $scope.$watch('pimcBarraEstadoService.ultimaAccion', function() {
//            barraEstadoCtrl.ultimaAccion = pimcBarraEstadoService.ultimaAccion;
//        });
        
        barraEstadoCtrl.guardarCambiosInterno = function() {
            pimcBarraEstadoService.registrarAccion("Guardando cambios ...");
            barraEstadoCtrl.guardarCambios();
        }
        barraEstadoCtrl.borrarCambiosInterno = function() {
            if (pimcBarraEstadoService.borrarCambios()) {
                pimcBarraEstadoService.registrarAccion("Descartar cambios");
                barraEstadoCtrl.borrarCambios();
            }
        }
    }]);
    
    barraEstadoModule.component('pimcBarraEstado', {
        bindings:{
            borrarCambios: '&',
            guardarCambios:'&'
        },
        controller: 'barraEstadoComponentController',
        controllerAs: 'barraEstadoCtrl',
        templateUrl: 'views/global/barraEstado/barraEstadoTemplate.html'
    });


})(window.angular);