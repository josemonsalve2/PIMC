(function (angular) {
    
        'use strict';
    
        var tablaRefElementoRelacionalModule = angular.module('tablaRefElementoRelacionalModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);
    
        // Service para comentarios. Cargar y guardar notas
        tablaRefElementoRelacionalModule.service('pimcTablaRefElementoService', ['$http', '$q', 'pimcService', function($http, $q, pimcService){
            var tablaRefElementoServiceCtrl = this;
    
            tablaRefElementoServiceCtrl.cargarElementos = function(elementoRelacional, elementoID) {
            };
    
            comentariosController.guardarNotas = function(elementoRelacional, idElementoRelaciona, notas) {
                
            };
    
        }]);
    
        tablaRefElementoRelacionalModule.controller('pimcRefTablaController',['pimcService', 'pimcBarraEstadoService','$window', function(pimcService, pimcBarraEstadoService, $window) {
           
        }]);
    
        tablaRefElementoRelacionalModule.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
                return function (notas) {
                    if (!notas) return [];
                    var filtrados = [];
                    angular.forEach(notas, function(val, key) {
                        if (val.estado != pimcService.datosEstados.ELIMINADO) {
                            filtrados.push(val);
                        }
                    });
                    return filtrados;
                }
            }]);
        
            tablaRefElementoRelacionalModule.component('pimcRefElementoRelacionalTabla', {
            bindings:{
                notas:'<', // Input
                reportarCambio:'&' // Output
            },
            controller: 'comentariosComponentController',
            controllerAs: 'controladorComentarios',
            templateUrl: 'views/global/comentarios/comentariosTemplate.html'
        });
    
    
    })(window.angular);