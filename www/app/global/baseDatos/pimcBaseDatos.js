(function (angular) {

    'use strict';

    var pimcServiceModule = angular.module('pimcServiceModule');
    pimcServiceModule.service('pimcBaseDatosService', 
        ['pimcService',
         '$q',
         '$http',
         function (pimcService, $q, $http) {
        var pimcBaseDatosServiceCtrl = this;

        pimcBaseDatosServiceCtrl.consultarPorID = function(elementoRelacional, elementoRelacionalID) {
            var consultaElementoRelacionalURL = pimcService.crearURLOperacion('Consulta', elementoRelacional);
            var idNombre = pimcService.idElementoRelaciona[elementoRelacional];
            if (!idNombre) {
                return $q.reject("Elemento Relacional no disponible")
            }
            var config = { params: {} };
            config.params[idNombre] = elementoRelacionalID;
            // Cargamos los personajes
            return $http.get(consultaElementoRelacionalURL, config).then(function (data) {
                //Obtener los datos JSON
                var valoresElementoRelacional = data.data;
                // Revisamos si se recibio algo 
                if (Object.keys(valoresElementoRelacional).length == 0) {
                    return $q.reject("No se encontro nada en la base de datos")
                }
                return valoresElementoRelacional;
            });
        }
        
        pimcBaseDatosServiceCtrl.consultarBaseDatosParametros = function(baseDatos, parametros) {
            var consultarTodosElementosRelacionalURL = pimcService.crearURLOperacion('ConsultarTodos', baseDatos);            
            var config = {};
            config.params = parametros;
            // Cargamos los personajes
            return $http.get(consultarTodosElementosRelacionalURL, config).then(function (data) {
                //Obtener los datos JSON
                var valoresElementoRelacional = data.data;
                // Revisamos si se recibio algo 
                if (Object.keys(valoresElementoRelacional).length == 0) {
                    return $q.reject("No se encontro nada en la base de datos")
                }
                return valoresElementoRelacional;
            });
        }
        pimcBaseDatosServiceCtrl.insertarElemento = function(baseDatos, contenido) {
            if (! (contenido instanceof Object)) {
                return $q.reject("contenido debe ser un diccionario");
            }
            var insertarElementoURL = pimcService.crearURLOperacion('Insertar', baseDatos);
            return $http.post(insertarElementoURL, contenido).then(
                function (data) {
                    // Revisamos si la respuesta tiene elementos 
                    if (Object.keys(data.data[0]).length != 0){
                        return data.data[0];
                    }
                    // No deberia llegar aca
                    $q.reject("Error al insertar nuevo elemento relacional");
                }, 
                function (error) {
                    $q.reject("Error al insertar elemento en la base de datos " + baseDatos);
                }
            );
        }
        pimcBaseDatosServiceCtrl.modificarElemento = function (baseDatos, contenido) {
            if (! (contenido instanceof Object)) {
                return $q.reject("contenido debe ser un diccionario");
            }
            var modificarElementoURL = pimcService.crearURLOperacion('Modificar', baseDatos);
            return $http.post(modificarElementoURL, contenido).then(
                function (data) {
                    // Revisamos si la respuesta tiene elementos 
                    if (data.data[0] == 0){
                        return $q.reject("No se modifico nada en la base de datos");
                    } else {
                        return $q.resolve(data.data[0]);
                    }
                    // No deberia llegar aca
                    $q.reject("Error al modificar elemento relacional");
                }, 
                function (error) {
                    $q.reject("Error al modificar elemento en la base de datos " + baseDatos);
                }
            );
        }
        pimcBaseDatosServiceCtrl.eliminarElemento = function (baseDatos, contenido) {
            if (! (contenido instanceof Object)) {
                return $q.reject("contenido debe ser un diccionario");
            }
            var modificarElementoURL = pimcService.crearURLOperacion('Eliminar', baseDatos);
            return $http.delete(modificarElementoURL, {params: contenido}).then(
                function (data) {
                    // Revisamos si la respuesta tiene elementos 
                    if (data.data[0] == 0){
                        return $q.reject("No se elimino nada en la base de datos");
                    } else {
                        return $q.resolve(data.data[0]);
                    }
                    // No deberia llegar aca
                    $q.reject("Error al eliminar elemento relacional");
                }, 
                function (error) {
                    $q.reject("Error al eliminar elemento en la base de datos " + baseDatos);
                }
            );
        }

    }]);
})(window.angular);