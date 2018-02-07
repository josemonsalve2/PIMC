(function (angular) {

    'use strict';

    var autocompletarModule = angular.module('autocompletarModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);

    autocompletarModule.service('pimcAutocompletarService', ['$http', '$q', 'pimcService', function($http, $q, pimcService){
    

    }]);

    autocompletarModule.controller('autocompletarController',
        ['pimcService',
         'pimcBarraEstadoService', 
         function(pimcService, pimcBarraEstadoService) {
            var autocompletarCtrl = this;
            autocompletarCtrl.elementoSeleccionado = {};

            // Valores por defecto
            autocompletarCtrl.elementoRelacionalInt = "";
            autocompletarCtrl.camposElementoRelacionalInt = "";
            autocompletarCtrl.opcionesInt = {
                minLength: 3,
                delay: 100
            }
            autocompletarCtrl.permitirAgregarInt = false;
            autocompletarCtrl.mostrarCampoInt = "";
            autocompletarCtrl.estado = pimcService.datosEstados.LIMPIO;
            
            // Funcion para inicializar los campos de el elemento seleccionado
            autocompletarCtrl.inicializarSeleccionado = function() {
                autocompletarCtrl.elementoSeleccionado = {};
                // Definimos los valores de los campos de busqueda
                angular.forEach(autocompletarCtrl.campoElementoRelacionalInt, function (campo) {
                    autocompletarCtrl.elementoSeleccionado[campo] = "";
                })
                // Campo a mostrar puede ser diferente al campo de busqueda
                if (autocompletarCtrl.mostrarCampoInt)
                    autocompletarCtrl.elementoSeleccionado[autocompletarCtrl.mostrarCampoInt] = "";
            }


            // Para actualizar los elementos internos en caso de que sea necesario
            autocompletarCtrl.$onChanges = function (changes) {
                if (changes.elementoRelacional) {
                    autocompletarCtrl.elementoRelacionalInt = $window.angular.copy(autocompletarCtrl.elementoRelacional);
                    // Si el elemento relacional cambia, reiniciamos el seleccionado
                    autocompletarCtrl.inicializarSeleccionado();
                    autocompletarCtrl.estado = pimcService.datosEstados.LIMPIO;
                }
                if (changes.camposElementoRelacional) {
                    autocompletarCtrl.campoElementoRelacionalInt = $window.angular.copy(autocompletarCtrl.campoElementoRelacional); 
                    // Si no es array lo convertimos en uno
                    if (!Array.isArray(autocompletarCtrl.campoElementoRelacionalInt)) {
                        autocompletarCtrl.campoElementoRelacionalInt = [autocompletarCtrl.campoElementoRelacionalInt];
                    }

                    // Si los campos del elemento relacional cambian, reiniciamos el seleccionado                    
                    autocompletarCtrl.inicializarSeleccionado();
                    autocompletarCtrl.estado = pimcService.datosEstados.LIMPIO;                    
                }
                if (changes.mostrarCampo) {
                    autocompletarCtrl.mostrarCampoInt = $window.angular.copy(autocompletarCtrl.mostrarCampo);
                    // Si el campo no existe ya, lo agregamos
                    if (!autocompletarCtrl.elementoSeleccionado[autocompletarCtrl.mostrarCampoInt])
                        autocompletarCtrl.elementoSeleccionado[autocompletarCtrl.mostrarCampoInt] = "";
                }
                // Opciones del campo de autocompletar
                if (changes.opciones) {
                    autocompletarCtrl.opcionesInt = $window.angular.copy(autocompletarCtrl.opciones);
                    if (!autocompletarCtrl.opcionesInt.minLength) autocompletarCtrl.opcionesInt.minLength = 3;
                    if (!autocompletarCtrl.opcionesInt.delay) autocompletarCtrl.opcionesInt.delay = 100;
                }
                // Permitir agregar el campo si no existe.
                if (changes.permitirAgregar) {
                    autocompletarCtrl.permitirAgregarInt = $window.angular.copy(autocompletarCtrl.permitirAgregar); 
                }
            } 

            // Funcion de autocompletar
            autocompletarCtrl.autocompletarElemento = function(valorActual) {

            };

            // Funcion de seleccionar
            autocompletarCtrl.seleccionAutocompletar = function($item) {

            }

            // Funcion que no permite seleccionar hasta que no haya autocompletado
            autocompletarCtrl.revisarEstadoCargando = function() {

            }

            // Funcion que reporta cuando se termino de editar
            autocompletarCtrl.reportarCambioNuevo = function() {

            }

    }]);

    autocompletarModule.component('pimcAutocompletar', {
        bindings:{
            elementoRelacional:'<', // Tabla en la que se buscara el match
            camposElementoRelacional: '<', // Campo en el que se buscara un match
            mostrarCampo: '<', // Campo que se mostara al seleccionar
            opciones: '<', // Controllar delays, min lenght y el resto de parametros
            permitirAgregar:'<', // Agrega una nueva entrada al principio de la lista que es insertar nuevo elemento
            reportarCambio:'&' // Cada que hay un cambio, se llama esta funcion
        },
        controller: 'autocompletarController',
        controllerAs: 'autocompletarCtrl',
        templateUrl: 'views/global/autocompletar/autocompletar.html'
    });


})(window.angular);