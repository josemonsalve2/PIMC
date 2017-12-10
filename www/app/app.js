(function (angular) {
  
  'use strict';
  
  var pimc = angular.module('pimc', [
    'ngRoute',
    'indexModule',
    'inicioModule',
    'pimcMenuModule',
    'archivoPerfil',
    'personajePerfil',
    'embarcacionPerfil',
    'lugarPerfil',
    'institucionPerfil',
    'actividadPerfil',
    'eventoPerfil',
    'documentosBusqueda',
    'documentoPerfil',
    'lugarTerritorioModule',
    'comentariosModule',
    'barraEstadoModule',
    'pimcListadoModule',
    'fechaConFormatoModule'
  ]);

  pimc.controller('AppController', ['pimcMenuService', '$scope', function(pimcMenuService, $scope) {
    pimcMenuService.cargarElementos();
  }]);

  pimc.config(function($routeProvider){
    $routeProvider.caseInsensitiveMatch = true;    
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller:  'indexController'
      })
      .when('/inicio', {
        templateUrl: 'views/inicio.html',
        controller:  'inicioController'
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
        controller:  'documentosBusquedaController'
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

})(window.angular);
