(function (angular) {
    
    'use strict';
  
    var crearLugarTerritorioModule = angular.module('crearLugarTerritorioModal',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    crearLugarTerritorioModule.service('crearLugarTerritorio', ['$uibModal', '$http', function($uibModal, $http){
        var $ctrl = this; 
        $ctrl.lugarOTerritorio = 'lugar';
        $ctrl.valorInicial = {};
        var modalOptionsDefault = {
          animation: true,
          templateUrl: 'views/lugar/crearLugarTerritorioTemplate.html',
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
                                                          
    crearLugarTerritorioModule.controller('ModalInstanceCtrl', function ($http, $uibModalInstance, valorInicial ) {
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
            fechaFinalFormato:''
        };
        
        $ctrl.datosTerritorio = {
            territorioID: -1,
            nombre: valorInicial,
            tipoTerritorio: '',
            //fechaInicial: '',
            fechaInicialFormato: '',
            //fechaFinal: '',
            fechaFinalFormato:''
        };
        
        $ctrl.ok = function () {
            // Insertar lugar en base de datos
            // revisar si el personaje nombre esta vacio
            if ($ctrl.lugarOTerritorio === 'lugar') {
                if ($ctrl.datosLugar.nombre !== "") {
                    var config = {params: {}};
                    // removemos el lugarID
                    for (var key in $ctrl.datosLugar) {
                        if (key != 'lugarID') {
                            if (typeof $ctrl.datosLugar[key] === 'string') {
                                config.params[key] = "'" + $ctrl.datosLugar[key] + "'";
                            } else {
                                config.params[key] = $ctrl.datosLugar[key];
                            }
                        }
                    }

                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Lugares', config).then(function(data) {
                        console.log(data);
                        // Data contains the last insert id
                        if (Object.keys(data.data).length != 0) {
                            var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                            $ctrl.datosLugar.lugarID = lastInsertID;
                            $ctrl.datosLugar.lugarOTerritorio = "lugar";
                            $uibModalInstance.close($ctrl.datosLugar);
                        } else {
                            $uibModalInstance.close({});
                        }
                    });
                } else {
                        $uibModalInstance.close({});
                }
            } else if ($ctrl.lugarOTerritorio === 'territorio') {
                if ($ctrl.datosTerritorio.nombre !== "") {
                    var config = {params: {}};
                    // removemos el lugarID
                    for (var key in $ctrl.datosTerritorio) {
                        if (key != 'territorioID') {
                            if (typeof $ctrl.datosTerritorio[key] === 'string') {
                                config.params[key] = "'" + $ctrl.datosTerritorio[key] + "'";
                            } else {
                                config.params[key] = $ctrl.datosTerritorio[key];
                            }
                        }
                    }

                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Territorios', config).then(function(data) {
                        console.log(data);
                        // Data contains the last insert id
                        if (Object.keys(data.data).length != 0) {
                            var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                            $ctrl.datosTerritorio.territorioID = lastInsertID;
                            $ctrl.datosTerritorio.lugarOTerritorio = "territorio";
                            $uibModalInstance.close($ctrl.datosTerritorio);
                        } else {
                            $uibModalInstance.close({});
                        }
                    });
                } else {
                    $uibModalInstance.close({});
                }
            } else {
                $uibModalInstance.close({});
            }
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancelar');
        };
    });
      
      
})(window.angular);