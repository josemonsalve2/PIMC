////////////////////////////////////////////////////////////////////////////////////
// EVENTO PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var eventoPerfil = angular.module('eventoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    eventoPerfil.controller('eventoPerfilController', ['$scope', '$sce','$q', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $q, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
        $scope.eventoID = -1;
    }]);

})(window.angular);

