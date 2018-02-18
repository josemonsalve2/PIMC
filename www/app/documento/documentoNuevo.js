(function (angular) {
    
    'use strict';

    var documentoPerfil = angular.module('documentoPerfil');


    // Service para comentarios. Cargar y guardar datos principales de la embarcacion
    documentoPerfil.service('pimcDocumentoNuevoService', 
        ['$q', 
         'pimcService', 
         'pimcBarraEstadoService', 
         'pimcBaseDatosService',
         function ($q, pimcService, pimcBarraEstadoService, pimcBaseDatosService) {
            var documentoNuevoService = this;

            documentoNuevoService.crearNuevoDocumento = function (informacioDocumento) {

            }
    
        }]
    ); // Fin pimcDocumentoNuevoService

    // Controller para los datos principales
    documentoPerfil.controller('documentoNuevoController', 
        ['$uibModal',
         '$q',
         'pimcService',
         'pimcFilesService',
         'pimcBarraEstadoService', 
         'pimcDocumentoNuevoService', 
         function($uibModal, pimcService, pimcFilesService, pimcBarraEstadoService, pimcDocumentoNuevoService) {
            var documentoNuevoCtrl = this;
            documentoNuevoCtrl.agregados = false;
            // funcion para abrir modal
            documentoNuevoCtrl.abrirModalCrearDocumento = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    component: 'pimcDocumentoNuevoModal',
                    size: 'lg',
                    resolve: {
                        reportarAgregados: function() {
                            documentoNuevoCtrl.agregados = true;
                        }
                    }
                  });
          
                  modalInstance.result.then(
                  function (resultadoAgregados) {
                      if (resultado || documentoNuevoCtrl.agregados) {
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
    controller: function(pimcDocumentoNuevoService, pimcService, pimcFilesService, $q) {
        var $ctrl = this;
        // Inicializamos el formulario
        $ctrl.init = function() {
            $ctrl.datosPrincipales = {};
            $ctrl.datosPrincipales.contenido = {};
            $ctrl.datosPrincipales.estado = pimcService.datosEstados.VACIO;
            $ctrl.listaFiles = {};
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
            $ctrl.guardar().then(
                function(guardado) {
                    if (guardado) {
                        $ctrl.mensajeGuardado = true;
                        $ctrl.reportarAgregados();
                        $ctrl.init();
                    }
                }
            );
            
        };

        $ctrl.crearCerrar = function () {
            $ctrl.guardar().then(
                function(guardado) {
                    $uibModalInstance.close(guardado);
                }
            );
        };

        // funcion de guardado en la base de datos
        $ctrl.guardar = function(){
            if ($ctrl.datosPrincipales.estado != pimcService.datosEstados.VACIO){
                // primero creamos el documento, si tenemos exito agregamos los archivos
                return pimcBaseDatosService.insertarElemento("Documentos", $ctrl.documentoPerfil.contenido).then(
                    function(elementoInsertado) {
                        if ($ctrl.listaFiles.length != 0)
                        {
                            return pimcFilesService.guardarCambiosFiles('Documentos', elementoInsertado.documentoID, $ctrl.listaFiles).then(
                                function() {
                                    return $q.resolve(true);
                                }, 
                                function(error){
                                    $ctrl.mensajeError = "Error guardando archivos" + error;
                                    $ctrl.mostrarError = true;
                                    return $q.resolve(false);
                                }
                            );
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
            $uibModalInstance.dismiss('cancel');
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