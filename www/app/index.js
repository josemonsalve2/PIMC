////////////////////////////////////////////////////////////////////////////////////
// INDEX MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {
    
    'use strict';
    
    var indexModule = angular.module('indexModule', ['pimcMenuModule']);
    indexModule.controller('indexController', ['$scope', 'pimcService', 'loginService', '$location', '$window', function($scope, pimcService, loginService, $location, $window) {
        $scope.location = $location;
        $scope.hlPIMC = false;
        $scope.$watch('location.path()',function(newPath) {
            $scope.hlPIMC = newPath === '/';
        });
        $scope.logout = function() {
            loginService.Logout();
            $location.href = "#!/";
            $window.location.reload();
        }
    }]);

})(window.angular);
