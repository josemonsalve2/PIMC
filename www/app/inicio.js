////////////////////////////////////////////////////////////////////////////////////
// INDEX MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {
    
    'use strict';
    
    var indexModule = angular.module('inicioModule', ['pimcMenuModule']);
    indexModule.controller('inicioController', ['$scope', 'pimcService', function($scope, pimcService) {}]);

})(window.angular);
