(function (angular) {
    
        'use strict';
    
        var documentoPerfil = angular.module('documentoPerfil');
    
    
        // Service para comentarios. Cargar y guardar datos principales de la embarcacion
        documentoPerfil.service('pimcDocumentoDatosPrincipalesService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
            var documentoDatosPrincipalesServiceCtrl = this;
    
            documentoDatosPrincipalesServiceCtrl.crearVacio = function () {
                var datosPrincipalesVacios = {};
                datosPrincipalesVacios.contenido = {
                    titulo: "",
                    fondo: "",
                    institucionFondo: "",
                    seccion: "",
                    numRefDentroFondo: "",
                    fechaInicial: "",
                    fechaFinal: "",
                    folioInicial: "",
                    folioFinal: "",
                    legajo: "",
                    numOrden: "",
                    numPaginas: "",
                    palabrasClaves: "",
                    disponibilidad: ""
                };
                datosPrincipalesVacios.estado = pimcService.datosEstados.LIMPIO;
            }
    
            // Funcion para cargar datos principales del documento
            documentoDatosPrincipalesServiceCtrl.cargarDatosPrincipales = function (documentoID) {
                var consultaDocumentoDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Documentos');
                var config = {
                    params: {
                        documentoID: documentoID
                    }
                }
                // Cargamos los datos principales
                return $http.get(consultaDocumentoDatosPrincipales, config).then(function (data) {
                    //Obtener los datos JSON
                    var documentoDatosPrincipales = data.data;
                    var datosPrincipales = {
                        contenido: {},
                        estado: pimcService.datosEstados.LIMPIO
                    };
                    // Revisamos si se recibio algo 
                    if (Object.keys(documentoDatosPrincipales).length != 0) {
                        try {
                            // Contenido, datos de embarcacion en la base de datos
                            datosPrincipales.contenido = documentoDatosPrincipales[0];
                        }
                        catch (err) {
                            pimcService.error("Problema cargando los valores de datos principales del documento " + err.message);
                        }
                    }
                    return datosPrincipales;
    
                });
            }; //Fin de cargar datos principales
    
            documentoDatosPrincipalesServiceCtrl.guardarDatosPrincipales = function (datosPrincipales) {
    
                // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
                if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {
    
                    pimcBarraEstadoService.registrarAccion("Actualizando BD Documentos");
                    var modificarDocumentosURL = pimcService.crearURLOperacion('Modificar', 'Documentos');
                    return $http.post(modificarDocumentosURL, datosPrincipales.contenido).then(
                        // funcion conexion exitosa
                        function (data) {
                            if (data.data[0] != 0) {
                                return true;
    
                            } else {
                                pimcService.error("ERROR no se modificó la base de datos guardando datos principales de documento", data);
                                return false;
                            }
                        }, function (dataError) {
                            // funcion error de conexion
                            pimcService.error("ERROR guardando documento", dataError);
                            return $q.resolve(false);
                        }
                    );
                }
            }; // Fin de guardar datos principales
    
        }]);
    
        documentoPerfil.controller('documentoDatosPrincipalesController', ['pimcService', 'pimcBarraEstadoService', 'pimcDocumentoDatosPrincipalesService', '$window', function(pimcService, pimcBarraEstadoService, pimcDocumentoDatosPrincipalesService, $window) {
            var documentoDatosPrincipalesCtrl = this;
    
            // Desactivar 
            documentoDatosPrincipalesCtrl.activo = false;
            // Inicializacion de datos principales
            documentoDatosPrincipalesCtrl.datosPrincipalesInt = pimcDocumentoDatosPrincipalesService.crearVacio;
            // Inicializacion de notas
            documentoDatosPrincipalesCtrl.notasInt = [];
    
            // Para actualizar los elementos internos en caso de que sea necesario
            documentoDatosPrincipalesCtrl.$onChanges = function (changes) { 
                if (changes.activo) {
                    documentoDatosPrincipalesCtrl.activoInt = $window.angular.copy(documentoDatosPrincipalesCtrl.activo);
                }
                if (changes.datosPrincipales) {
                    documentoDatosPrincipalesCtrl.datosPrincipalesInt = $window.angular.copy(documentoDatosPrincipalesCtrl.datosPrincipales); // Datos principales
                }
                if (changes.notas) {
                    documentoDatosPrincipalesCtrl.notasInt = $window.angular.copy(documentoDatosPrincipalesCtrl.notas); // Notas
                } 
              } 
            // Funcion para datos editados
            documentoDatosPrincipalesCtrl.datoEditado = function (campo, valorNuevo) {
                pimcBarraEstadoService.registrarAccion("Dato Principal" + campo + " modificado " + valorNuevo);
                documentoDatosPrincipalesCtrl.datosPrincipalesInt.estado = pimcService.datosEstados.MODIFICADO;
                documentoDatosPrincipalesCtrl.reportarCambio({
                    datosPrincipales: documentoDatosPrincipalesCtrl.datosPrincipalesInt, 
                    notas: documentoDatosPrincipalesCtrl.notasInt });
            };
    
            documentoDatosPrincipalesCtrl.notificarNotasCambios = function (notas) {
                documentoDatosPrincipalesCtrl.notasInt = notas;
                documentoDatosPrincipalesCtrl.reportarCambio({
                    datosPrincipales: documentoDatosPrincipalesCtrl.datosPrincipalesInt,
                    notas: documentoDatosPrincipalesCtrl.notasInt });
            };
    
            documentoDatosPrincipalesCtrl.listadoEditado = function (listado, csvString) {
                documentoDatosPrincipalesCtrl.palabrasClavesArray = listado;
                if (csvString != documentoDatosPrincipalesCtrl.datosPrincipales.contenido.palabrasClaves) {
                    documentoDatosPrincipalesCtrl.datoEditado('palabrasClaves', csvString);
                }
            };
    
            // Reportar Cambio fechas
            documentoDatosPrincipalesCtrl.fechaEditada = function (fecha, formato, campoFecha) {
                var campoFormato = campoFecha + "Formato";
                documentoDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFecha] = fecha;
                documentoDatosPrincipalesCtrl.datosPrincipalesInt.contenido[campoFormato] = formato;
                documentoDatosPrincipalesCtrl.datoEditado(campoFecha, fecha);
            }
    
            // Listado palabras claves
            documentoDatosPrincipalesCtrl.palabrasClavesArray = [];
    
        }]);
    
        documentoPerfil.component('pimcDocumentoDatosPrincipales', {
            bindings: {
                datosPrincipales: '<',
                activo: '<',
                notas: '<',
                reportarCambio:'&'
            },
            controller: 'documentoDatosPrincipalesController',
            controllerAs: 'documentoDatosPrincipalesCtrl',
            templateUrl: 'views/documento/documentoDatosPrincipales.html'
        });
    
    })(window.angular);