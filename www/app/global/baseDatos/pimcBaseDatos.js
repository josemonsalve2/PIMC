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
            var consultaElementoRelacionalURL = pimcService.crearURLOperacion('Consultar', elementoRelacional);
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

    }]);
})(window.angular);