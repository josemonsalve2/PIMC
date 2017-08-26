(function (angular) {
    'use strict';
  
  angular.module('crearLugarModal').service('crearLugar',['$uibModal', function($uibModal){
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
                                                          
angular.module('crearLugarModal').controller('ModalInstanceCtrl', function ($uibModalInstance) {
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