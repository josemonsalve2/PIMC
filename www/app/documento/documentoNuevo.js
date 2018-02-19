(function (angular) {
    
    'use strict';

    var documentoPerfil = angular.module('documentoPerfil');

    // Controller para los datos principales
    documentoPerfil.controller('documentoNuevoController', 
        ['$uibModal',
         '$q',
         '$timeout',
         'pimcService',
         'pimcFilesService',
         'pimcBarraEstadoService',
         'pimcBaseDatosService',
         function($uibModal, $q, $timeout, pimcService, pimcFilesService, pimcBarraEstadoService, pimcBaseDatosService) {
            var documentoNuevoCtrl = this;
            documentoNuevoCtrl.agregados = false;
            documentoNuevoCtrl.reportarAgregados = function() {
                documentoNuevoCtrl.agregados = true;
            }
            // funcion para abrir modal
            documentoNuevoCtrl.abrirModalCrearDocumento = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'pimcDocumentoNuevoModal',
                    size: 'lg',
                    resolve: {
                        reportarAgregados: function() {
                            return documentoNuevoCtrl.reportarAgregados;
                        }
                    }
                  });
          
                  modalInstance.result.then(
                  function (resultadoAgregados) {
                      if (resultadoAgregados || documentoNuevoCtrl.agregados) {
                        documentoNuevoCtrl.reportarCambio({documentosGuardados: true});
                        pimcService.debug('Modal closed');
                      }
                  }, function () {
                      if (documentoNuevoCtrl.agregados) {
                        documentoNuevoCtrl.reportarCambio({documentosGuardados: true});
                        pimcService.debug('Modal dismissed');
                      }
                  });
            }            
        }]
    );

    // Modal
    documentoPerfil.component('pimcDocumentoNuevoModal', {
    templateUrl: 'views/documento/documentoNuevoModal.html',
    controllerAs: '$ctrl',
    bindings: {
        resolve: '<',
        close: '&', 
        dismiss: '&'
    },
    controller: function(pimcBaseDatosService, pimcService, pimcFilesService, $q, $timeout) {
        var $ctrl = this;
        // Inicializamos el formulario
        $ctrl.init = function() {
            $ctrl.datosPrincipales = {};
            $ctrl.datosPrincipales.contenido = {};
            $ctrl.datosPrincipales.estado = pimcService.datosEstados.VACIO;
            $ctrl.listaFiles = [];
            $ctrl.cargando = false;
        }

        $ctrl.$onInit = function () {
            $ctrl.reportarAgregados = $ctrl.resolve.reportarAgregados;
        }

        // Callback de datos principales
        $ctrl.datosPrincipalesEditados = function (datosPrincipales, listadoFiles) {
            $ctrl.datosPrincipales = datosPrincipales;
            $ctrl.listaFiles = listadoFiles;
        };

        // Boton crea y agregar otro
        $ctrl.crearContinuar = function () {
            $ctrl.cargando = true;
            $ctrl.guardar().then(
                function(guardado) {
                    if (guardado) {
                        $ctrl.mensajeGuardado = true;
                        $timeout(function() {
                            $ctrl.mensajeGuardado = false;
                        }, 3000);
                        $ctrl.reportarAgregados();
                        $ctrl.init();
                    } else {
                        $ctrl.cargando = false;
                    }
                }
            );
            
        };

        $ctrl.crearCerrar = function () {
            $ctrl.cargando = true;
            $ctrl.guardar().then(
                function(guardado) {
                    $ctrl.cargando = false;
                    $ctrl.close({$value: guardado});
                }
            );
        };

        // funcion de guardado en la base de datos
        $ctrl.guardar = function(){
            if ($ctrl.datosPrincipales.estado != pimcService.datosEstados.VACIO){
                // primero creamos el documento, si tenemos exito agregamos los archivos
                return pimcBaseDatosService.insertarElemento("Documentos", $ctrl.datosPrincipales.contenido).then(
                    function(elementoInsertado) {
                        if (Array.isArray($ctrl.listaFiles) && $ctrl.listaFiles.length != 0)
                        {
                            if (pimcFilesService.guardarCambiosFiles('Documentos', elementoInsertado.documentoID, $ctrl.listaFiles))
                            {
                                return $q.resolve(true);
                            } else {
                                $ctrl.mensajeError = "Error guardando archivos" + error;
                                $ctrl.mostrarError = true;
                                return $q.resolve(false);
                            }
                        } else {
                            return $q.resolve(true);
                        }
                    }, 
                    function(error) {
                        $ctrl.mensajeError = "Error guardando datos " + error;
                        $ctrl.mostrarError = true;                        
                        return $q.resolve(false);
                    }
                )
            } else {
                return $q.resolve(false);
            }
        };

        $ctrl.limpiar = function() {
            if(confirm("¿Está seguro que desea eliminar todo el formulario?")) {
                $ctrl.init();
            }
        }
    
        $ctrl.cancel = function () {
            $ctrl.dismiss({$value: false});
        };

        // Primera inicializacion
        $ctrl.init();
    }
    }) // fin componente modal


    // Component para crear nuevo documento.
    documentoPerfil.component('pimcDocumentoNuevo', {
        bindings: {
            reportarCambio:'&'
        },
        controller: 'documentoNuevoController',
        controllerAs: 'documentoNuevoCtrl',
        templateUrl: 'views/documento/documentoNuevo.html'
    });
        
})(window.angular);