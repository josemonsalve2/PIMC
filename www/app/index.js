////////////////////////////////////////////////////////////////////////////////////
// INDEX MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {
    
    'use strict';
    
    var indexModule = angular.module('indexModule', ['pimcMenuModule']);
    indexModule.controller('indexController', ['$scope', 'pimcService', '$location', function($scope, pimcService, $location) {
        $scope.location = $location;
        $scope.hlPIMC = false;
        $scope.$watch('location.path()',function(newPath) {
            $scope.hlPIMC = newPath === '/';
        });
    }]);

})(window.angular);
