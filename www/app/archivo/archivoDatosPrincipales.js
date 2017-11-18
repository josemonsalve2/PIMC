(function (angular) {

    'use strict';

    var archivoPerfil = angular.module('archivoPerfil');


    // Service para comentarios. Cargar y guardar datos principales de la embarcacion
    archivoPerfil.service('pimcArchivoDatosPrincipalesService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
        var archivoDatosPrincipalesServiceCtrl = this;

        archivoDatosPrincipalesServiceCtrl.crearVacio = function () {
            var datosPrincipalesVacios = {};
            datosPrincipalesVacios.contenido = {
                archivoTitulo: "",
                archivoFondo: "",
                institucionFondo: "",
                seccion: "",
                numRefDentroFondo: "",
                fechaInicial: "",
                fechaFinal: "",
                folioInicial: "",
                folioFinal: "",
                legajo: "",
                numOrden: "",
                numPaginas: "",
                palabrasClaves: "",
                disponibilidad: ""
            };
            datosPrincipalesVacios.estado = pimcService.datosEstados.LIMPIO;
        }

        // Funcion para cargar datos principales del archivo
        archivoDatosPrincipalesServiceCtrl.cargarDatosPrincipales = function (archivoID) {
            var consultaArchivoDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Archivos');
            var config = {
                params: {
                    archivoID: archivoID
                }
            }
            // Cargamos los datos principales
            return $http.get(consultaArchivoDatosPrincipales, config).then(function (data) {
                //Obtener los datos JSON
                var archivoDatosPrincipales = data.data;
                var datosPrincipales = {
                    contenido: {},
                    estado: pimcService.datosEstados.LIMPIO
                };
                // Revisamos si se recibio algo 
                if (Object.keys(archivoDatosPrincipales).length != 0) {
                    try {
                        // Contenido, datos de embarcacion en la base de datos
                        datosPrincipales.contenido = archivoDatosPrincipales[0];
                    }
                    catch (err) {
                        pimcService.error("Problema cargando los valores de datos principales del archivo " + err.message);
                    }
                }
                return datosPrincipales;

            });
        }; //Fin de cargar datos principales

        archivoDatosPrincipalesServiceCtrl.guardarDatosPrincipales = function (datosPrincipales) {

            // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
            if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {

                pimcBarraEstadoService.registrarAccion("Actualizando BD Archivos");
                var modificarArchivosURL = pimcService.crearURLOperacion('Modificar', 'Archivos');
                return $http.post(modificarArchivosURL, datosPrincipales.contenido).then(
                    // funcion conexion exitosa
                    function (data) {
                        if (data.data[0] != 0) {
                            return true;

                        } else {
                            pimcService.error("ERROR no se modificó la base de datos guardando datos principales de archivo", data);
                            return false;
                        }
                    }, function (dataError) {
                        // funcion error de conexion
                        pimcService.error("ERROR guardando archivo", dataError);
                        return $q.resolve(false);
                    }
                );
            }
        }; // Fin de guardar datos principales

    }]);

    archivoPerfil.controller('archivoDatosPrincipalesController', ['pimcService', 'pimcBarraEstadoService', 'pimcArchivoDatosPrincipalesService', '$window', function(pimcService, pimcBarraEstadoService, pimcArchivoDatosPrincipalesService, $window) {
        var archivoDatosPrincipalesCtrl = this;

        // Desactivar 
        archivoDatosPrincipalesCtrl.activo = false;
        // Inicializacion de datos principales
        archivoDatosPrincipalesCtrl.datosPrincipalesInt = pimcArchivoDatosPrincipalesService.crearVacio;
        // Inicializacion de notas
        archivoDatosPrincipalesCtrl.notasInt = [];

        // Para actualizar los elementos internos en caso de que sea necesario
        archivoDatosPrincipalesCtrl.$onChanges = function (changes) { 
            if (changes.activo) {
                archivoDatosPrincipalesCtrl.activoInt = $window.angular.copy(archivoDatosPrincipalesCtrl.activo);
            }
            if (changes.datosPrincipales) {
                archivoDatosPrincipalesCtrl.datosPrincipalesInt = $window.angular.copy(archivoDatosPrincipalesCtrl.datosPrincipales); // Datos principales
            }
            if (changes.notas) {
                archivoDatosPrincipalesCtrl.notasInt = $window.angular.copy(archivoDatosPrincipalesCtrl.notas); // Notas
            } 
          } 
        // Funcion para datos editados
        archivoDatosPrincipalesCtrl.datoEditado = function (campo, valorNuevo) {
            pimcBarraEstadoService.registrarAccion("Dato Principal" + campo + " modificado " + valorNuevo);
            archivoDatosPrincipalesCtrl.datosPrincipalesInt.estado = pimcService.datosEstados.MODIFICADO;
            archivoDatosPrincipalesCtrl.reportarCambio({
                datosPrincipales: archivoDatosPrincipalesCtrl.datosPrincipalesInt, 
                notas: archivoDatosPrincipalesCtrl.notasInt });
        };

        archivoDatosPrincipalesCtrl.notificarNotasCambios = function (notas) {
            archivoDatosPrincipalesCtrl.notasInt = notas;
            archivoDatosPrincipalesCtrl.reportarCambio({
                datosPrincipales: archivoDatosPrincipalesCtrl.datosPrincipalesInt,
                notas: archivoDatosPrincipalesCtrl.notasInt });
        };

        archivoDatosPrincipalesCtrl.listadoEditado = function (listado, csvString) {
            archivoDatosPrincipalesCtrl.palabrasClavesArray = listado;
            if (csvString != archivoDatosPrincipalesCtrl.datosPrincipales.contenido.palabrasClaves) {
                archivoDatosPrincipalesCtrl.datoEditado('palabrasClaves', csvString);
            }
        };

        // Reportar Cambio fechas
        archivoDatosPrincipalesCtrl.fechaEditada = function (fecha, formato, campoFecha) {
            var campoFormato = campoFecha + "Formato";
            archivoDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFecha] = fecha;
            archivoDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFormato] = formato;
            archivoDatosPrincipalesCtrl.datoEditado(campoFecha, fecha);
        }

        // Listado palabras claves
        archivoDatosPrincipalesCtrl.palabrasClavesArray = [];

    }]);

    archivoPerfil.component('pimcArchivoDatosPrincipales', {
        bindings: {
            datosPrincipales: '<',
            activo: '<',
            notas: '<',
            reportarCambio:'&'
        },
        controller: 'archivoDatosPrincipalesController',
        controllerAs: 'archivoDatosPrincipalesCtrl',
        templateUrl: 'views/archivo/archivoDatosPrincipales.html'
    });

})(window.angular);