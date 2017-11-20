////////////////////////////////////////////////////////////////////////////////////
// INDEX MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {
    
    'use strict';
    
    var indexModule = angular.module('indexModule', ['pimcMenuModule']);
    indexModule.controller('indexController', ['$scope', 'pimcService', function($scope, pimcService) {}]);

})(window.angular);
