////////////////////////////////////////////////////////////////////////////////////
// INSTITUCION   PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var institucionPerfil = angular.module('institucionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    institucionPerfil.controller('institucionPerfilController', ['$scope', '$sce','$q', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $q, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
        $scope.institucionID = -1;
    }]);

})(window.angular);

