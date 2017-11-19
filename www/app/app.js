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
    $routeProvider.caseInsensitiveMatch = true;    
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller:  'indexController'
      })
      .when('/personajes', {
        templateUrl: 'views/personaje.html',
        controller:  'personajePerfilController'
      })
      .when('/archivos', {
        templateUrl: 'views/archivo/archivo.html',
        controller:  'archivoPerfilController'
      })
      .when('/embarcaciones', {
        templateUrl: 'views/embarcacion/embarcacion.html',
        controller:  'embarcacionPerfilController'
      })
      .when('/busqueda', {
        templateUrl: 'views/busqueda.html',
        controller:  'archivosBusquedaController'
      })
      .when('/documentos', {
        templateUrl: 'views/documento/documento.html',
        controller:  'documentoPerfilController'
      })
      .when('/lugares', {
        templateUrl: 'views/lugar/lugar.html',
        controller:  'lugarPerfilController'
      })
      .when('/instituciones', {
        templateUrl: 'views/institucion.html',
        controller:  'institucionPerfilController'
      })
      .when('/actividades', {
        templateUrl: 'views/actividad/actividad.html',
        controller:  'actividadPerfilController'
      })
      .when('/eventos', {
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

})(window.angular);
