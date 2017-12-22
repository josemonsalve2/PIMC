(function (angular) {

    'use strict';

    var documentoPerfil = angular.module('documentoPerfil');


    // Service para cargar y guardar emisor y receptores
    documentoPerfil.service('pimcDocumentoEmisorReceptorService', [
        '$http',
        '$q',
        'pimcService',
        'pimcBarraEstadoService',
        function ($http, $q, pimcService, pimcBarraEstadoService) {
        var documentoEmisorReceptorServiceCtrl = this;

        documentoEmisorReceptorServiceCtrl.crearVacio = function () {
            var documentoEmisorReceptor = {};
            documentoEmisorReceptor.contenido = {
                origenDestinoID: null,
                documentoID: null,
                emitidoPorID: null,
                dirigidoAID: null,
                institucionEmisorID: null,
                institucionReceptorID: null,
                cargoEmisor: "",
                cargoReceptor: "",
                notasEmisor: "",
                notasReceptor: ""
            };
            documentoEmisorReceptor.estado = pimcService.datosEstados.INSERTADO;
        }

        // Funcion para cargar emisor y receptor del documento
        documentoEmisorReceptorServiceCtrl.cargarEmisoresReceptores = function (documentoID, cargarTodo=true) {
            var consultaEmisorReceptor = pimcService.crearURLOperacion('ConsultarTodos', 'DocumentosEmisorReceptor');

            // filtramos por documentoID
            var parametros = {};
            parametros.documentoID = documentoID;
            
            // Recibimos todos los emisores y receptores
            return $http.get(consultaEmisorReceptor, { params: parametros }).then(function (data) {
                var elementos = [];
                var referenciasConexiones = {};
                
                // Si hay alguna referencia
                if (Object.keys(data.data).length != 0) {
                    var emisoresReceptores = data.data;
                    angular.forEach(emisoresReceptores, function(entrada) {
                        var nuevoEmisorReceptor = {};
                        nuevoEmisorReceptor.origenDestinoID = entrada.origenDestinoID;
                        nuevoEmisorReceptor.contenido = entrada;
                        nuevoEmisorReceptor.estado = consultaEmisorReceptor.LIMPIO;
                        nuevoEmisorReceptor.personajeEmisor = null;
                        nuevoEmisorReceptor.personajeReceptor = null;
                        nuevoEmisorReceptor.institucionEmisora = null;
                        nuevoEmisorReceptor.institucionReceptora= null;
                
                        // Cargamos las referencias de emisor y receptor
                        if (cargarTodo) {
                            var conexiones = {};                        
                            // Personaje emisor
                            if (nuevoEmisorReceptor.contenido.emitidoPorID) {
                                var parPersonajeEmisor = {
                                    personajeID: nuevoEmisorReceptor.contenido.emitidoPorID
                                }
                                var consultaPersonajeEmisor = pimcService.crearURLOperacion('Consulta', 'Personajes');
                                conexiones.personajeEmisor = $http.get(consultaPersonajeEmisor, {params: parPersonajeEmisor}).then(
                                    function(data) {
                                        return data.data;
                                    }
                                    , function(error) {
                                        pimcBarraEstadoService.registrarAccion("ERROR Cargando informacion del personaje emisor")
                                        return false;
                                    }
                                );
                            }
                            // Personaje receptor                            
                            if (nuevoEmisorReceptor.contenido.dirigidoAID) {
                                var parPersonajeReceptor = {
                                    personajeID: nuevoEmisorReceptor.contenido.dirigidoAID
                                }
                                var consultaPersonajeReceptor= pimcService.crearURLOperacion('Consulta', 'Personajes');
                                conexiones.personajeReceptor = $http.get(consultaPersonajeReceptor, {params: parPersonajeReceptor}).then(
                                    function(data) {
                                        return data.data;
                                    }
                                    , function(error) {
                                        pimcBarraEstadoService.registrarAccion("ERROR Cargando informacion del personaje receptor")
                                        return false;
                                    }
                                );
                            }
                            // Institucion emisora
                            if (nuevoEmisorReceptor.contenido.institucionEmisorID) {
                                var parInstitucionEmisor = {
                                    institucionID: nuevoEmisorReceptor.contenido.institucionEmisorID
                                }
                                var consultaInstitucionEmisora= pimcService.crearURLOperacion('Consulta', 'Instituciones');
                                conexiones.institucionEmisora = $http.get(consultaInstitucionEmisora, {params: parInstitucionEmisor}).then(
                                    function(data) {
                                        return data.data;
                                    }
                                    , function(error) {
                                        pimcBarraEstadoService.registrarAccion("ERROR Cargando informacion de la institucion emisora")
                                        return false;
                                    }
                                );
                            }
                            // Institucion receptora
                            if (nuevoEmisorReceptor.contenido.institucionReceptorID) {
                                var parInstitucionReceptor = {
                                    institucionID: nuevoEmisorReceptor.contenido.institucionReceptorID
                                }
                                var consultaInstitucionReceptor= pimcService.crearURLOperacion('Consulta', 'Instituciones');
                                conexiones.institucionReceptor = $http.get(consultaInstitucionReceptor, {params: parInstitucionReceptor}).then(
                                    function(data) {
                                        return data.data;
                                    }
                                    , function(error) {
                                        pimcBarraEstadoService.registrarAccion("ERROR Cargando informacion de la institucion receptora")
                                        return false;
                                    }
                                );
                            }

                            // Revisamos conexiones pendientes
                            if (Object.keys(conexiones).length != 0) {
                                $q.all(conexiones).then(conexiones, function (relaciones) {
                                    // Por cada conexion, llenamos los valores del nuevo Emisor Receptor
                                    angular.forEach(relaciones, function(valor, key) {
                                        nuevoEmisorReceptor[key] = (relaciones[key] ? relaciones[key] : null);
                                    });
                                });
                            }
                        }
                        elementos.push(nuevoEmisorReceptor);
                    });
                };
                pimcService.debug("Documentos Emisor Receptor Cargados");
                pimcService.debug(elementos);
                // Retornamos todas las relaciones
                return elementos;
            }); // Fin de la conexion http
        }; // fin de cargar emisor receptor

        documentoEmisorReceptorServiceCtrl.guardarEmisoresReceptores = function (documentoID, emisoresReceptores) {
            // Por cada entrada de emisopr receptor
            angular.forEach(emisoresReceptores, function(entradaEmisorReceptor) {
                // Revisamos si fue cambiada
                if (entradaEmisorReceptor.estado != pimcService.datosEstados.LIMPIO) {
                    pimcBarraEstadoService.registrarAccion("Actualizamos BD EmisorReceptor");
                    var modificarDocumentosEmisorReceptorURL = pimcService.crearURLOperacion('Modificar', 'DocumentosEmisorReceptor');
                    return $http.post(modificarDocumentosEmisorReceptorURL, entradaEmisorReceptor.contenido).then(
                        // Exito
                        function (respuesta) {
                            if(data.data[0] != 0) {
                                return true;
                            } else {
                                pimcService.error("ERROR en base de datos Guardando valorEmisorReceptor = " + entradaEmisorReceptor.origenDestinoID);
                                return false;
                            }
                        },
                        // Fallo en la conexion
                        function (error) {
                             // funcion error de conexion
                            pimcService.error("ERROR guardando valorEmisorReceptor = ", entradaEmisorReceptor.origenDestinoID + "[ " + error + " ]");
                            return $q.resolve(false);
                        }
                    );
                }
            });
        }; // Fin de guardar emisor receptor

    }]);

    // Controller para la seccion de emisor receptor
    documentoPerfil.controller('documentoEmisorReceptorController', [
        'pimcService', 
        'pimcBarraEstadoService',
        'pimcDocumentoEmisorReceptorService',
        '$window',
        '$timeout',
        function (pimcService, pimcBarraEstadoService, pimcDocumentoEmisorReceptorService, $window, $timeout) {
        var documentoEmisorReceptorCtrl = this;
        // Emisor y receptor
        documentoEmisorReceptorCtrl.emisoresReceptoresInt = [];
        documentoEmisorReceptorCtrl.activoInt = false;
        documentoEmisorReceptorCtrl.ocultarCambosVacios = false;


        // Para actualizar los elementos internos en caso de que sea necesario
        documentoEmisorReceptorCtrl.$onChanges = function (changes) {
            if (changes.activo) {
                documentoEmisorReceptorCtrl.activoInt = $window.angular.copy(documentoEmisorReceptorCtrl.activo);
            }
            if (changes.emisoresReceptores) {
                documentoEmisorReceptorCtrl.emisoresReceptoresInt = $window.angular.copy(documentoEmisorReceptorCtrl.emisoresReceptores);
            }
        }
        
        // Para eliminar una entrada emisorReceptor
        documentoEmisorReceptorCtrl.eliminarEmisorReceptor = function (valor) {
            var index = documentoEmisorReceptorCtrl.emisoresReceptoresInt.indexOf(valor);
            if (valor.estado == pimcService.datosEstados.INSERTADO) {
                documentoEmisorReceptorCtrl.emisoresReceptoresInt.splice(index,1);
            } else {
                valor.estado = pimcService.datosEstados.ELIMINADO;
            }
            $timeout(function () {
                documentoEmisorReceptorCtrl.emisorReceptorActivo = index - 1; // El nuevo elemento es el activo
            }, 100);
        }
        // Para agregar una entrada emisorReceptor
        documentoEmisorReceptorCtrl.agregarNuevoEmisorReceptor = function () {
            var nuevoEmisorReceptor = pimcDocumentoEmisorReceptorService.crearVacio();
            // Agregarlo a la lista de emisor y receptor
            documentoEmisorReceptorCtrl.emisoresReceptoresInt.push(nuevoEmisorReceptor);
            
            $timeout(function () {                
                documentoEmisorReceptorCtrl.emisorReceptorActivo = documentoEmisorReceptorCtrl.emisoresReceptoresInt.length - 1; // El nuevo elemento es el activo
            }, 100);
        }
        // Para modificar el emisor de una entrada emisorReceptor
        documentoEmisorReceptorCtrl.modificarCampo = function (campoEditado, valorNuevo, valorViejo, index) {
            pimcBarraEstadoService.registrarAccion(campoEditado + " <strong> " + valorViejo + " </strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor " + (index + 1));
            documentoEmisorReceptorCtrl.reportarCambio({
                emisoresReceptores: documentoEmisorReceptorCtrl.emisoresReceptoresInt
            });
        }

        // Para el titulo de la pestaña
        documentoEmisorReceptorCtrl.tabNombre = function(emisorReceptor) {
            var nombre = "";
            if (emisorReceptor.estado == pimcService.datosEstados.INSERTADO) {
                nombre = 'Nuevo emisor receptor '
            } else {
                // TODO JOSE Poner nombre del personaje cargado
                nombre = 'Emisor receptor ' + tab.emisorReceptorID
            }
            return nombre;
        }
    }]);

    documentoPerfil.component('pimcDocumentoEmisorReceptor', {
        bindings: {
            emisoresReceptores: '<',
            activo: '<',
            reportarCambio: '&'
        },
        controller: 'documentoEmisorReceptorController',
        controllerAs: 'documentoEmisorReceptorCtrl',
        templateUrl: 'views/documento/documentoEmisorReceptor.html'
    });

})(window.angular);