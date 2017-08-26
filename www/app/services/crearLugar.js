(function (angular) {
    
    'use strict';
  
    var crearLugarModule = angular.module('crearLugarModal',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    crearLugarModule.service('crearLugar',['$uibModal', function($uibModal){
        var $ctrl = this; 
        $ctrl.valorInicial = {};
        var modalOptionsDefault = {
          animation: true,
          templateUrl: 'views/services/crearLugarTemplate.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: 'lg',
          resolve: {
            valorInicial: function () {
              return $ctrl.valorInicial;
            }
          }
        }

        this.show = function (valorInicial, customModalOptions) {
            var modalOptions = {};
            if (!customModalOptions) modalOptions = modalOptionsDefault;
            $ctrl.valorInicial = valorInicial;
            return $uibModal.open(modalOptions).result;
        };
    }]);
                                                          
    crearLugarModule.controller('ModalInstanceCtrl', function ($uibModalInstance, valorInicial) {
        var $ctrl = this;
        $ctrl.datosLugar = {
            lugarID: -1,
            nombre: valorInicial,
            tipoLugar: '',
            categoria: '',
            coordenadas: '',
            fechaInicial: '',
            fechaInicialFormato: '',
            fechaFinal: '',
            feachaFinalFormato:''
        };

        $ctrl.ok = function () {
            $uibModalInstance.close($ctrl.datosLugar);
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancelar');
        };
    });
      
      
})(window.angular);