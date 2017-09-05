(function (angular) {

    'use strict';

    var crearLugarTerritorioModule = angular.module('crearLugarTerritorioModal',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

    // Service para comentarios. Cargar y guardar notas
    crearLugarTerritorioModule.service('pimcLugarTerritorioService', ['$http', '$q', 'pimcService', function($http, $q, pimcService) {
        var lugarTerritorioServiceCtrl = this;

        // Funcion para obtener lugar o territorio.
        lugarTerritorioServiceCtrl.obtenerLugarOTerritorio = function (lugarId, territorioId) {

            // Si no se envio ninguno de los dos
            if (!lugarId && !territorioId) {
                return  $q.resolve({lugarTerritorioNombre: "",
                        lugarTerritorioID: -1,
                        lugarOTerritorio: "" });
            }

            var conexiones = {};
            // Lugar tiene prioridad, revisamos si hay lugar ID
            if (lugarId) {
                var consultaLugar = pimcService.crearURLOperacion('Consulta', 'Lugares');
                conexiones['lugar'] = $http.get(consultaLugar,{
                    params: {
                        lugarID: datosPrincipales.contenido.lugarConstruccion
                    }
                });
            }
            if (territorioId) {
                var consultaLugar = pimcService.crearURLOperacion('Consulta', 'Territorios');
                conexiones['territorio'] = $http.get(consultaLugar,{
                    params: {
                        lugarID: datosPrincipales.contenido.lugarConstruccion
                    }
                });
            }

            // Revisamos las conexiones
            if (Object.keys(conexiones).length != 0) {
                // Retornamos la respuesta, dando prioridad a territorio
                return $q.all(conexiones).then(
                    // funcion para conexiones exitosas
                    function(responses) {
                        // Lugar tiene prioridad
                        if (responses['lugar']) {
                            var lugarDatos = responses['lugar'].data;
                            pimcService.debug('lugar = ' + lugarDatos);
                            if (Object.keys(lugarDatos).length != 0) {
                                lugarDatos = lugarDatos[0];
                                var lugar = {
                                    lugarTerritorioNombre: lugarDatos.nombre,
                                    lugarTerritorioID: lugarId,
                                    lugarOTerritorio: "lugar"
                                };
                                return lugar;
                            }
                        }

                        // Revisamos territorio
                        if (responses['territorio']) {
                            var lugarDatos = responses['territorio'].data;
                            pimcService.debug('territorio = ' + lugarDatos);
                            if (Object.keys(lugarDatos).length != 0) {
                                lugarDatos = lugarDatos[0];
                                var lugar = {
                                    lugarTerritorioNombre: lugarDatos.nombre,
                                    lugarTerritorioID: lugarId,
                                    lugarOTerritorio: "territorio"
                                };
                                return lugar;
                            }
                        } 

                        // No se retorno nada
                        return $q.resolve({ lugarTerritorioNombre: "",
                                lugarTerritorioID: -1,
                                lugarOTerritorio: "" });
                    },
                    // Funcion para conexiones fallidas
                    function (responses) {
                        pimcService.debug("conexion a lugar o territorio fallida", responses)
                        return $q.resolve({lugarTerritorioNombre: "",
                                lugarTerritorioID: -1,
                                lugarOTerritorio: "" });
                    }
                );
            } else {
                // Esto no deberia pasar
                pimcService.debug("Algo salio mal. lugar o territorio no cargado")
                return $q.resolve({lugarTerritorioNombre: "",
                        lugarTerritorioID: -1,
                        lugarOTerritorio: "" });
            }
        }

    }]);

})(window.angular);