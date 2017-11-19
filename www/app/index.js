////////////////////////////////////////////////////////////////////////////////////
// INDEX MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {
    
    'use strict';
    
    var indexModule = angular.module('indexModule', []);
    indexModule.controller('indexController', ['$scope', 'pimcService', function($scope, pimcService) {
        // Para el menu de los elementos abiertos
        $scope.elementosAbiertos = {};

        // Cualquier cambio en los elementos abiertos es notificada aca
        $scope.cambiosElementosAbiertos = function () {
            $scope.elementosAbiertos = pimcService.elementosAbiertos;
        }
        pimcService.registrarNotificacionElementosAbiertos($scope.cambiosElementosAbiertos);
    }]);

})(window.angular);
