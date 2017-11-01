(function (angular) {

    'use strict';

    var archivoPerfil = angular.module('archivoPerfil');


    // Service para comentarios. Cargar y guardar datos principales de la embarcacion
    archivoPerfil.service('pimcArchivoDatosPrincipalesService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
        var archivoDatosPrincipalesServiceCtrl = this;

        // Funcion para cargar datos principales del archivo
        archivoDatosPrincipalesServiceCtrl.cargarDatosPrincipales = function (archivoID) {
            var consultaArchivoDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Archivos');
            var config = {
                params: {
                    embarcacionID: archivoID
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

            });
        }; //Fin de cargar datos principales

        archivoDatosPrincipalesServiceCtrl.guardarDatosPrincipales = function (datosPrincipales) {

            // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
            if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {

                pimcBarraEstadoService.registrarAccion("Actualizando BD Archivos");
                var modificarArchivosURL = pimcService.crearURLOperacion('Modificar', 'Archivos');
                var parametros = datosPrincipales.contenido;
                parametros.idUnico = 'archivoID';
                var config = {
                    params: parametros
                }
                return $http.get(modificarArchivosURL, config).then(
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


})(window.angular);