(function (angular) {
  
  'use strict';
  
  var pimc = angular.module('pimc', [
    'angular-jwt',
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
    'fechaConFormatoModule', 
    'loginModule',
    'pimcServiceModule'
  ]);

  pimc.controller('AppController', ['pimcMenuService', '$scope', '$window', '$rootScope',  function(pimcMenuService, $scope, $window, $rootScope) {
    pimcMenuService.cargarElementos();
    $rootScope.$on('tokenHasExpired', function() {
      localStorage.removeItem('currentUser');
      $window.location.href = "#!/";
    });
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
        controller:  'personajePerfilController',
        requiresLogin: true 
      })
      .when('/archivos', {
        templateUrl: 'views/archivo/archivo.html',
        controller:  'archivoPerfilController',
        requiresLogin: true 
      })
      .when('/embarcaciones', {
        templateUrl: 'views/embarcacion/embarcacion.html',
        controller:  'embarcacionPerfilController',
        requiresLogin: true 
      })
      .when('/busqueda', {
        templateUrl: 'views/busqueda.html',
        controller:  'documentosBusquedaController',
        requiresLogin: true 
      })
      .when('/documentos', {
        templateUrl: 'views/documento/documento.html',
        controller:  'documentoPerfilController',
        requiresLogin: true 
      })
      .when('/lugares', {
        templateUrl: 'views/lugar/lugar.html',
        controller:  'lugarPerfilController',
        requiresLogin: true 
      })
      .when('/instituciones', {
        templateUrl: 'views/institucion.html',
        controller:  'institucionPerfilController',
        requiresLogin: true 
      })
      .when('/actividades', {
        templateUrl: 'views/actividad/actividad.html',
        controller:  'actividadPerfilController',
        requiresLogin: true 
      })
      .when('/eventos', {
        templateUrl: 'views/evento.html',
        controller:  'eventoPerfilController',
        requiresLogin: true 
      })
      .when('/login', {
        templateUrl: 'views/global/auth/login.html',
        controller: 'loginController'
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
