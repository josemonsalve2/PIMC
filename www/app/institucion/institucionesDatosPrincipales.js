(function (angular) {
    
    'use strict';

    var institucionPerfil = angular.module('institucionPerfil');


    // Service para comentarios. Cargar y guardar datos principales de la institucion
    institucionPerfil.service('pimcInstDatosPrincipalesService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
        var instDatosPrincipalesServicioCtrl = this;

        instDatosPrincipalesServicioCtrl.crearVacio = function () {
            var datosPrincipalesVacios = {};
            datosPrincipalesVacios.contenido = {
                nombre: "",
                tipoInstitucion: "",
                fechaCreacion: "",
                fechaCreacionFormato: "",
                fechaTerminacion: "",
                fechaTerminacionFormato: "",
                categoria: "",
                lugarID: "",
                territorioID: "",
                funciones: ""
            };
            datosPrincipalesVacios.estado = pimcService.datosEstados.LIMPIO;
            return datosPrincipalesVacios;
        }

        // Funcion para cargar datos principales de la institucion
        instDatosPrincipalesServicioCtrl.cargarDatosPrincipales = function (institucionID) {
            var consultaInstDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Instituciones');
            var config = {
                params: {
                    institucionID: institucionID
                }
            }
            // Cargamos los datos principales
            return $http.get(consultaInstDatosPrincipales, config).then(function (data) {
                //Obtener los datos JSON
                var institucionesDatosPrincipales = data.data;
                var datosPrincipales = {
                    contenido: {},
                    estado: pimcService.datosEstados.LIMPIO
                };
                // Revisamos si se recibio algo 
                if (Object.keys(institucionesDatosPrincipales).length != 0) {
                    try {
                        // Contenido, datos de embarcacion en la base de datos
                        datosPrincipales.contenido = institucionesDatosPrincipales[0];
                    }
                    catch (err) {
                        pimcService.error("Problema cargando los valores de datos principales de la institucion " + err.message);
                    }
                }
                return datosPrincipales;

            });
        }; //Fin de cargar datos principales

        instDatosPrincipalesServicioCtrl.guardarDatosPrincipales = function (datosPrincipales) {

            // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
            if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {

                pimcBarraEstadoService.registrarAccion("Actualizando BD Instituciones");
                var modificarInstitucionesURL = pimcService.crearURLOperacion('Modificar', 'Instituciones');
                return $http.post(modificarInstitucionesURL, datosPrincipales.contenido).then(
                    // funcion conexion exitosa
                    function (data) {
                        if (data.data[0] != 0) {
                            return true;

                        } else {
                            pimcService.error("ERROR no se modificó la base de datos guardando datos principales de la institucion ", data);
                            return false;
                        }
                    }, function (dataError) {
                        // funcion error de conexion
                        pimcService.error("ERROR guardando institucion", dataError);
                        return $q.resolve(false);
                    }
                );
            }
            return false;
        }; // Fin de guardar datos principales

    }]);

    // Controller para los datos principales
    institucionPerfil.controller('instDatosPrincipalesController', 
        ['pimcService', 
         'pimcBarraEstadoService', 
         'pimcInstDatosPrincipalesService', 
         '$window', 
         function(pimcService, pimcBarraEstadoService, pimcInstDatosPrincipalesService, $window) {
        var instDatosPrincipalesCtrl = this;

        // Desactivar 
        instDatosPrincipalesCtrl.activo = false;

        // Inicializacion de datos principales
        instDatosPrincipalesCtrl.datosPrincipalesInt = pimcInstDatosPrincipalesService.crearVacio();

        // Anotaciones
        instDatosPrincipalesCtrl.notasInt = [];

        // Para actualizar los elementos internos en caso de que sea necesario
        instDatosPrincipalesCtrl.$onChanges = function (changes) { 
            if (changes.activo) {
                instDatosPrincipalesCtrl.activoInt = $window.angular.copy(instDatosPrincipalesCtrl.activo);
            }
            if (changes.datosPrincipales) {
                instDatosPrincipalesCtrl.datosPrincipalesInt = $window.angular.copy(instDatosPrincipalesCtrl.datosPrincipales); // Datos principales
            }
            if (changes.notas) {
                instDatosPrincipalesCtrl.notasInt = $window.angular.copy(instDatosPrincipalesCtrl.notas); // Datos principales
            }
          } 
        // Funcion para datos editados
        instDatosPrincipalesCtrl.datoEditado = function (campo, valorNuevo) {
            pimcBarraEstadoService.registrarAccion("Dato Principal" + campo + " modificado " + valorNuevo);
            instDatosPrincipalesCtrl.datosPrincipalesInt.estado = pimcService.datosEstados.MODIFICADO;
            instDatosPrincipalesCtrl.reportarCambio({
                datosPrincipales: instDatosPrincipalesCtrl.datosPrincipalesInt,
                notas: instDatosPrincipalesCtrl.notasInt});
        };

        // Reportar Cambio fechas
        instDatosPrincipalesCtrl.fechaEditada = function (fecha, formato, campoFecha) {
            var campoFormato = campoFecha + "Formato";
            instDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFecha] = fecha;
            instDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFormato] = formato;
            instDatosPrincipalesCtrl.datoEditado(campoFecha, fecha);
        }

        // Anotaciones
        instDatosPrincipalesCtrl.notificarNotasCambios = function (notas) {
            instDatosPrincipalesCtrl.notasInt = notas;
            instDatosPrincipalesCtrl.reportarCambio({
                datosPrincipales: instDatosPrincipalesCtrl.datosPrincipalesInt,
                notas: instDatosPrincipalesCtrl.notasInt });
        };

    }]);

    institucionPerfil.component('pimcInstitucionesDatosPrincipales', {
        bindings: {
            datosPrincipales: '<',
            notas: '<',
            activo: '<',
            reportarCambio:'&'
        },
        controller: 'instDatosPrincipalesController',
        controllerAs: 'instDatosPrincipalesCtrl',
        templateUrl: 'views/institucion/institucionesDatosPrincipales.html'
    });

})(window.angular);