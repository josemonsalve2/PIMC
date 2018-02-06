(function (angular) {

    'use strict';

    var pimcServiceModule = angular.module('pimcServiceModule', []);
    pimcServiceModule.constant("pimcApiDomain", "pimcapi.fundacionproyectonavio.org");
    pimcServiceModule.constant("pimcBackEndURL", "http://pimcapi.fundacionproyectonavio.org");
    pimcServiceModule.constant("pimcApiURL", "http://pimcapi.fundacionproyectonavio.org/PIMC0.2");
    pimcServiceModule.service('pimcService', ['$window', '$http', 'pimcApiDomain', 'pimcApiURL', 'pimcBackEndURL', function ($window, $http, pimcApiDomain, pimcApiURL, pimcBackEndURL) {
        var pimcService = this;

        // PARA BACKEND
        pimcService.apiDomain = pimcApiDomain;
        pimcService.apiURL = pimcApiURL;
        pimcService.backEndURL = pimcBackEndURL; // sin / al final
        // crea la URL 
        pimcService.crearURLOperacion = function (operacion, elementoRelacional) {
            return pimcService.apiURL + "/" + String(operacion) + "/" + String(elementoRelacional);
        }
        pimcService.authURL = pimcService.backEndURL + "/pimcAuth";
        pimcService.registerURL = pimcService.backEndURL + "/register";

        // OPCION DEBUGGING
        pimcService.debugMode = true;

        if (pimcService.debugMode)
            pimcService.debug = console.log.bind(window.console)
        else
            pimcService.debug = function () { }

        pimcService.error = console.error.bind(window.console)

        // ESTADO DE DATOS
        pimcService.datosEstados = {
            LIMPIO: 0,
            MODIFICADO: 1,
            INSERTADO: 2,
            ELIMINADO: 3,
            CREADO: 4,
            propiedades: {
                0: { nombre: 'Limpia', value: 0, code: 'L' },
                1: { nombre: 'Modificada', value: 1, code: 'M' },
                2: { nombre: 'Insertada', value: 2, code: 'I' },
                3: { nombre: 'Eliminada', value: 3, code: 'E' },
                4: { nombre: 'Creada', value: 3, code: 'C' }
            }
        };

        // IDs Elementos relacionales
        pimcService.idElementoRelaciona = {
            Embarcaciones: "embarcacionID",
            Archivos: "archivoID",
            Documentos: "documentoID",
            Personajes: "personajeID",
            Actividades: "actividadID",
            Instituciones: "institucionID",
            Eventos: "eventoID",
            Lugares: "lugarID",
            Territorios: "territorioID"
        }
        // ColumnasNombres. Nombre que lo identifica en la base de datos
        pimcService.nombreColElementoRelacional = {
            Embarcaciones: "nombres",
            Archivos: "",
            Documentos: "titulo",
            Personajes: "nombre",
            Actividades: "nombre",
            Instituciones: "nombre",
            Eventos: "descripcion",
            Lugares: "nombre",
            Territorios: "nombre"
        }

        pimcService.fechasFormatosVisualizacion = {
            "YYYY": "yyyy",        
            "MMMM, YYYY" : "MMMM, yyyy",        
            "DD/MMMM": "dd/MMMM",
            "D-M-YYYY": "d-M-yyyy",
            "DD-MM-YYYY": "dd-MM-yyyy",
            "h:mm A": "h:mm a",
            "DD/MM/YYYY hh:mm A" : "dd/MM/yyyy hh:mm a"
        };

    }]);

    pimcServiceModule.filter('estadoNoEliminado', ['pimcService', function (pimcService) {
        return function (items) {
            var filtered = [];
            angular.forEach(items, function (el) {
                if (el.estado && el.estado != pimcService.datosEstados.ELIMINADO) {
                    filtered.push(el);
                }
            });
            return filtered;
        }
    }]);

})(window.angular);