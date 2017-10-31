(function (angular) {
  
  'use strict';
  
  var pimc = angular.module('pimc', [
    'ngRoute',
    'indexModule',
    'archivoPerfil',
    'personajePerfil',
    'embarcacionPerfil',
    'lugarPerfil',
    'institucionPerfil',
    'actividadPerfil',
    'eventoPerfil',
    'archivosBusqueda',
    'documentoPerfil',
    'lugarTerritorioModule',
    'comentariosModule',
    'barraEstadoModule',
    'pimcListadoModule',
    'fechaConFormatoModule'
  ]);

  pimc.controller('AppController', function($scope) {});

  pimc.config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller:  'indexController'
      })
      .when('/personaje', {
        templateUrl: 'views/personaje.html',
        controller:  'personajePerfilController'
      })
      .when('/archivo', {
        templateUrl: 'views/archivo.html',
        controller:  'archivoPerfilController'
      })
      .when('/embarcacion', {
        templateUrl: 'views/embarcacion/embarcacion.html',
        controller:  'embarcacionPerfilController'
      })
      .when('/busqueda', {
        templateUrl: 'views/busqueda.html',
        controller:  'archivosBusquedaController'
      })
      .when('/documento', {
        templateUrl: 'views/documento.html',
        controller:  'documentoPerfilController'
      })
      .when('/lugar', {
        templateUrl: 'views/lugar/lugar.html',
        controller:  'lugarPerfilController'
      })
      .when('/institucion', {
        templateUrl: 'views/institucion.html',
        controller:  'institucionPerfilController'
      })
      .when('/actividad', {
        templateUrl: 'views/actividad/actividad.html',
        controller:  'actividadPerfilController'
      })
      .when('/evento', {
        templateUrl: 'views/evento.html',
        controller:  'eventoPerfilController'
      })
      .otherwise({
        redirectTo:  '/'
      });
  }).config(function($provide){
    $provide.decorator('GridOptions',['$delegate', 'i18nService', function($delegate, i18nService){
        var gridOptions = angular.copy($delegate);
        gridOptions.initialize = function(options) {
            var initOptions = $delegate.initialize(options);
            return initOptions;
        };
        i18nService.setCurrentLang('es');
        return gridOptions;
    }]);
  });

  pimc.directive('setParentActive', ['$location', function($location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        var classActive = attrs.setParentActive || 'active',
            path = attrs.ngHref.replace('#!', '');
        scope.location = $location;
        scope.$watch('location.path()', function(newPath) {
          if (path == newPath) {
            element.parent().addClass(classActive);
          } else {
            element.parent().removeClass(classActive);
          }
        })
      }
    }
  }]);

  pimc.service('pimcService', ['$window', '$http', function($window, $http){
      var pimcService = this;
      // PARA BACKEND
      pimcService.backEndURL = "http://pimcapi.fundacionproyectonavio.org/PIMC0.2"; // sin / al final
      // crea la URL 
      pimcService.crearURLOperacion = function(operacion, elementoRelacional) {
          return pimcService.backEndURL + "/" + String(operacion) + "/" + String(elementoRelacional);
      }
      
      /// CADA UNA DE LAS OPERACIONES DE LA API
      // pimcService.apiConsulta = function(operacion, elementoRelacional, elementoID) {
      //   var consultaURL = pimcService.crearURLOperacion(operacion, elementoRelacional);
      //   var carga[pimcService.idElementoRelacional[elementoRelacional]] = elementoID;
      //   return $http.get(consultaURL, {params:carga}).then( function (data) {
      //       return data.data;
      //   }, function (respuestaError) {
      //   });
      // };     
      
      // OPCION DEBUGGING
      pimcService.debugMode = true;

      if (pimcService.debugMode)
          pimcService.debug = console.log.bind(window.console)
      else
          pimcService.debug = function(){}
          
      // ESTADO DE DATOS
      pimcService.datosEstados = {
            LIMPIO: 0, 
            MODIFICADO: 1,
            INSERTADO: 2,
            ELIMINADO: 3,
            propiedades: {
                0: {nombre:'Limpia', value: 0, code: 'L'},
                1: {nombre:'Modificada', value: 1, code: 'M'},
                2: {nombre:'Insertada', value: 2, code: 'I'},
                3: {nombre:'Eliminada', value: 3, code: 'E'}
            }
      };  
    
      // IDs Elementos relacionales
      pimcService.idElementoRelaciona = {
          Embarcaciones: "embarcacionID",
          Archivos: "archivoID",
          Documentos: "documentoID",
          Personajes: "personajeID",
          Actividades: "actividadID"
      }

    }]);
    
    pimc.filter('estadoNoEliminado', ['pimcService', function(pimcService) {
      return function(items) {
        var filtered = [];
        angular.forEach(items, function(el) {
          if(el.estado && el.estado != pimcService.datosEstados.ELIMINADO) {
            filtered.push(el);
          }
        });
        return filtered;
      }
    }]);

})(window.angular);
