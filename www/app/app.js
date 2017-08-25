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
    'archivosBusqueda',
    'documentoPerfil'
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
        templateUrl: 'views/embarcacion.html',
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
        templateUrl: 'views/lugar.html',
        controller:  'lugarPerfilController'
      })
      .when('/institucion', {
        templateUrl: 'views/institucion.html',
        controller:  'institucionPerfilController'
      })
      .when('/actividad', {
        templateUrl: 'views/actividad.html',
        controller:  'actividadPerfilController'
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
