(function (angular) {
    
    'use strict';
  
    var crearLugarModule = angular.module('crearLugarModal',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    crearLugarModule.service('crearLugar',['$uibModal', function($uibModal){
        var $ctrl = this; 
        $ctrl.resultado = {};
        var modalOptionsDefault = {
          animation: true,
          templateUrl: 'views/services/crearLugarTemplate.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: 'lg',
          resolve: {
            resultado: function () {
              return $ctrl.resultado;
            }
          }
        }

        this.show = function (customModalOptions) {
            var modalOptions = {};
            if (!customModalOptions) modalOptions = modalOptionsDefault;

            return $uibModal.open(modalOptions).result;
        };
    }]);
                                                          
    crearLugarModule.controller('ModalInstanceCtrl', function ($uibModalInstance) {
        var $ctrl = this;
        $ctrl.resultado = -1;

        $ctrl.ok = function () {
          alert(1);
        $uibModalInstance.close($ctrl.resultado);
        };

        $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancelar');
        };
    });
      
      
})(window.angular);