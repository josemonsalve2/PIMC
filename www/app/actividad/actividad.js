////////////////////////////////////////////////////////////////////////////////////
// ACTIVIDAD PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

  'use strict';

  var actividadPerfil = angular.module('actividadPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
  actividadPerfil.controller('actividadPerfilController', ['$scope', 'pimcMenuService', '$sce','$q', '$window', '$location', '$filter', '$timeout', 'i18nService', 'pimcActividadService', 'pimcBarraEstadoService', 'pimcComentarios',  function($scope, pimcMenuService, $sce, $q, $window, $location, $filter, $timeout, i18nService, pimcActividadService, pimcBarraEstadoService, pimcComentarios) {
    $scope.actividadID = -1;
    
    // Funcion de inicializacion
    var init = function() {
      var actividadSeleccionada = pimcMenuService.obtenerElementoSeleccionado("Actividades");
      // If not set, redirect.
      if (!actividadSeleccionada) {
        pimcService.debug("No hay un archivo seleccionado");
        //TODO Enviar varios seleccionados
        $window.location.href = "#!/";
      } else {
        $scope.actividadID = actividadSeleccionada.id;
        if (!$scope.datosGuardados) {
          pimcBarraEstadoService.registrarAccion("Actividad <strong>" + $scope.embarcacionID + "</strong> ha sido cargado");
        } else {
          pimcBarraEstadoService.registrarAccion("Actividad <strong>" + $scope.embarcacionID  + "</strong> ha sido guardado en la base de datos");
          $scope.datosGuardados = false;
        }
      }
      
      $scope.cargarDatosPrincipales();
      $scope.cargarNotas();
    };
    
    // Datos principales
    $scope.datosPrincipales = {};
    $scope.cargarDatosPrincipales = function(){
      $scope.datosPrincipales = {};
      pimcActividadService.cargarDatosPrincipales($scope.actividadID).then( function(data) {
        $scope.datosPrincipales = data;
      });
    }
    
    // Notas
    $scope.notas = [];
    $scope.notasEditado = false;
    $scope.cargarNotas = function() {
      pimcComentarios.cargarNotas('Actividades',$scope.actividadID).then( function(data) {
        $scope.notas = data;
      });
    }
    $scope.notificarNotasCambios = function () {
      $scope.notasEditado = true;
    };
    
    init();

  }]);

})(window.angular);

