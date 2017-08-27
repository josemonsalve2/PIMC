(function (angular) {
    
    'use strict';
  
    var crearLugarTerritorioModule = angular.module('crearLugarTerritorioModal',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    crearLugarTerritorioModule.service('crearLugarTerritorio',['$uibModal', function($uibModal){
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
                                                          
    crearLugarTerritorioModule.controller('ModalInstanceCtrl', ['$http', function ($http, $uibModalInstance, valorInicial ) {
        var $ctrl = this;
        
        $ctrl.datosLugar = {
            lugarID: -1,
            nombre: valorInicial,
            tipoLugar: '',
            categoria: '',
            coordenadas: '',
            //fechaInicial: '',
            fechaInicialFormato: '',
            //fechaFinal: '',
            feachaFinalFormato:''
        };
        
        $ctrl.ok = function () {
            // Insertar lugar en base de datos
            // revisar si el personaje nombre esta vacio
            if ($ctrl.datosLugar.nombre !== "") {
                var parametros = {};
                // removemos el lugarID
                for (var key in $ctrl.datosLugar) {
                    if (key != 'lugarID') {
                        parametros[key] = $ctrl.datosLugar[key];
                    }
                }
                
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Lugares',{
                    params: parametros
                }).then(function(data) {
                    console.log(data);
                    // Data contains the last insert id
                    if (Object.keys(data.data).length != 0) {
                        var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                        $ctrl.datosLugar.lugarID = lastInsertID;
                        $uibModalInstance.close($ctrl.datosLugar);
                    } else {
                        $uibModalInstance.close({});
                    }
                });
            }

        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancelar');
        };
    }]);
      
      
})(window.angular);