(function (angular) {

    'use strict';

    var autocompletarModule = angular.module('autocompletarModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);

    autocompletarModule.service('pimcAutocompletarService', ['$http', '$q', 'pimcService', function($http, $q, pimcService){
        var pimcAutocompletarServiceCtrl = this;
        
        pimcAutocompletarServiceCtrl.buscarElementosSimilares = function (elementoRelacional, camposAutocompletar, hint) {
            var urlAutocompletar = pimcService.crearURLOperacion('ConsultarTodos', elementoRelacional);
            var parametros = {};
            angular.forEach(camposAutocompletar, function(campoAutocompletar) {
                parametros[campoAutocompletar] = hint;
            });
            return $http.get(urlAutocompletar, { params: parametros }).then(function (data) {
                return data.data;
            });
        } // fin autocompletarElemento

    }]);

    autocompletarModule.controller('autocompletarController',
        ['pimcService',
         'pimcBarraEstadoService',
         'pimcAutocompletarService',
         '$q',
         '$window',
         function(pimcService, pimcBarraEstadoService, pimcAutocompletarService, $q, $window) {
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
            

            // Para actualizar los elementos internos en caso de que sea necesario
            autocompletarCtrl.$onChanges = function (changes) {
                if (changes.elementoRelacional) {
                    autocompletarCtrl.elementoRelacionalInt = $window.angular.copy(autocompletarCtrl.elementoRelacional);
                    // Si el elemento relacional cambia, reiniciamos el seleccionado
                    autocompletarCtrl.estado = pimcService.datosEstados.LIMPIO;
                }
                if (changes.camposElementoRelacional) {
                    autocompletarCtrl.camposElementoRelacionalInt = $window.angular.copy(autocompletarCtrl.camposElementoRelacional); 
                    // Si no es array lo convertimos en uno
                    if (!Array.isArray(autocompletarCtrl.camposElementoRelacionalInt)) {
                        autocompletarCtrl.camposElementoRelacionalInt = [autocompletarCtrl.camposElementoRelacionalInt];
                    }

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
                    if (!autocompletarCtrl.opcionesInt ) {
                        autocompletarCtrl.opcionesInt = {
                            minLength: 3,
                            delay: 100
                        }
                    } else {
                        if (!autocompletarCtrl.opcionesInt.minLength) autocompletarCtrl.opcionesInt.minLength = 3;
                        if (!autocompletarCtrl.opcionesInt.delay) autocompletarCtrl.opcionesInt.delay = 100;
                    }
                }
                // Permitir agregar el campo si no existe.
                if (changes.permitirAgregar) {
                    autocompletarCtrl.permitirAgregarInt = $window.angular.copy(autocompletarCtrl.permitirAgregar); 
                }
            } 

            // Funcion de autocompletar
            autocompletarCtrl.autocompletarElemento = function(valorActual) {
                // Hacemos la consulta en la base de datos
                return pimcAutocompletarService.buscarElementosSimilares(
                    autocompletarCtrl.elementoRelacionalInt, 
                    autocompletarCtrl.camposElementoRelacionalInt,
                    valorActual
                ).then(
                    function(resultados) {
                        var todasLasOpciones = [];
                        // Consulta exitosa
                        if (Object.keys(resultados).length != 0)
                            todasLasOpciones = resultados;
                        
                        // Si esta la opcion de agregar
                        // Por cada una revisamos si hay match perfecto o no para ver 
                        // si le damos la opcion de agregar uno nuevo
                        if (autocompletarCtrl.permitirAgregarInt) { 
                            var matchPerfecto = false;
                            angular.forEach(todasLasOpciones, function(opcion) {
                                angular.forEach(autocompletarCtrl.camposElementoRelacionalInt, function (campo) {
                                    // TODO cambiar acentos 
                                    if (String(valorActual).toLowerCase().replace(/\s/g, '') == String(opcion[campo]).toLowerCase().replace(/\s/g, ''))
                                        matchPerfecto = true
                                });
                            });
                            // Queremos que lo que este escribiendo la persona siempre salga de primero, a no ser
                            // que ya exista en la base de datos perfectamente, para no crear duplicados
                            if (!matchPerfecto) {
                                var nuevoElemento = {};
                                nuevoElemento[autocompletarCtrl.mostrarCampoInt] = "(+Agregar) " + valorActual;
                                nuevoElemento.estado = pimcService.datosEstados.INSERTADO; 
                                nuevoElemento.valorNuevo = valorActual;
                                todasLasOpciones.unshift(nuevoElemento)
                            }
                        }
                        return todasLasOpciones;
                    },
                    function(error) {
                        // Consulta erronea
                        pimcBarraEstadoService.registrarAccion("Error buscando autocompletar");
                        pimcService.debug("[ERROR] en autocompletar " + error);
                    }
                );
            };// fin autocompletar elemento

            // Funcion de seleccionar
            autocompletarCtrl.seleccionAutocompletar = function(elementoSeleccionado, formAutocompletar) {
                // Si permitimos agregar, revisamos si se agrego nuevo
                if(autocompletarCtrl.permitirAgregarInt &&
                    elementoSeleccionado.estado && 
                    elementoSeleccionado.estado == pimcService.datosEstados.INSERTADO ) {
                        autocompletarCtrl.estado = pimcService.datosEstados.INSERTADO;
                        elementoSeleccionado[autocompletarCtrl.mostrarCampoInt] = elementoSeleccionado.valorNuevo;
                    }
                else {
                    autocompletarCtrl.estado = pimcService.datosEstados.LIMPIO;
                }
                // Seleccionamos y enviamos
                formAutocompletar.$submit();
            }

            // Funcion que reporta cuando se termino de editar
            autocompletarCtrl.reportarCambioNuevo = function() {
                if (autocompletarCtrl.cargandoValores) {
                    return "Se debe seleccionar un valor de la lista..."
                } else {
                    autocompletarCtrl.reportarCambio({elementoSeleccionado: autocompletarCtrl.elementoSeleccionado,
                                                      estado: autocompletarCtrl.estado});
                }
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