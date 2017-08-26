////////////////////////////////////////////////////////////////////////////////////
// ACTIVIDAD PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var actividadPerfil = angular.module('actividadPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    actividadPerfil.controller('actividadPerfilController', ['$scope', '$sce','$q', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $q, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
        $scope.actividadID = -1;
    }]);

})(window.angular);

