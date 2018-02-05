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
                return false;
            }; // Fin de guardar datos principales
    
        }]);
    
        // Controller para los datos principales
        documentoPerfil.controller('documentoDatosPrincipalesController', ['pimcService', 'pimcBarraEstadoService', 'pimcDocumentoDatosPrincipalesService', '$window', function(pimcService, pimcBarraEstadoService, pimcDocumentoDatosPrincipalesService, $window) {
            var documentoDatosPrincipalesCtrl = this;
    
            // Desactivar 
            documentoDatosPrincipalesCtrl.activo = false;
            // Inicializacion de datos principales
            documentoDatosPrincipalesCtrl.datosPrincipalesInt = pimcDocumentoDatosPrincipalesService.crearVacio;
            documentoDatosPrincipalesCtrl.filesListaInt = [];

            // Para actualizar los elementos internos en caso de que sea necesario
            documentoDatosPrincipalesCtrl.$onChanges = function (changes) { 
                if (changes.activo) {
                    documentoDatosPrincipalesCtrl.activoInt = $window.angular.copy(documentoDatosPrincipalesCtrl.activo);
                }
                if (changes.datosPrincipales) {
                    documentoDatosPrincipalesCtrl.datosPrincipalesInt = $window.angular.copy(documentoDatosPrincipalesCtrl.datosPrincipales); // Datos principales
                }
                if (changes.filesLista) {
                    documentoDatosPrincipalesCtrl.filesListaInt = $window.angular.copy(documentoDatosPrincipalesCtrl.filesLista); // FILES
                }
              } 
            // Funcion para datos editados
            documentoDatosPrincipalesCtrl.datoEditado = function (campo, valorNuevo) {
                pimcBarraEstadoService.registrarAccion("Dato Principal" + campo + " modificado " + valorNuevo);
                documentoDatosPrincipalesCtrl.datosPrincipalesInt.estado = pimcService.datosEstados.MODIFICADO;
                documentoDatosPrincipalesCtrl.reportarCambio({
                    datosPrincipales: documentoDatosPrincipalesCtrl.datosPrincipalesInt, 
                    listadoFiles: documentoDatosPrincipalesCtrl.filesListaInt});
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

            // Reportar Cambio files
            documentoDatosPrincipalesCtrl.filesEditados = function (files) {
                pimcBarraEstadoService.registrarAccion("Files han sido editados");
                documentoDatosPrincipalesCtrl.reportarCambio({
                    datosPrincipales: documentoDatosPrincipalesCtrl.datosPrincipalesInt, 
                    listadoFiles: files });
            }
    
            // Listado palabras claves
            documentoDatosPrincipalesCtrl.palabrasClavesArray = [];
            
            // Estado de conservacion
            documentoDatosPrincipalesCtrl.estadosConservacionDisponibles = ["Bueno", "Regular", "Malo"];
    
        }]);
    

        // Controller para sinopsis y comentarios
        documentoPerfil.controller('documentoSinopsisComentariosCtrl', ['pimcService', 'pimcBarraEstadoService', 'pimcDocumentoDatosPrincipalesService', '$window', function(pimcService, pimcBarraEstadoService, pimcDocumentoDatosPrincipalesService, $window) {
            var docSinopsisComentCtrl = this;
    
            // Desactivar 
            docSinopsisComentCtrl.activo = false;
            // Inicializacion de datos principales
            docSinopsisComentCtrl.datosPrincipalesInt = pimcDocumentoDatosPrincipalesService.crearVacio;
            // Inicializacion de notas
            docSinopsisComentCtrl.notasInt = [];
    
            // Para actualizar los elementos internos en caso de que sea necesario
            docSinopsisComentCtrl.$onChanges = function (changes) { 
                if (changes.activo) {
                    docSinopsisComentCtrl.activoInt = $window.angular.copy(docSinopsisComentCtrl.activo);
                }
                if (changes.datosPrincipales) {
                    docSinopsisComentCtrl.datosPrincipalesInt = $window.angular.copy(docSinopsisComentCtrl.datosPrincipales); // Datos principales
                }
                if (changes.notas) {
                    docSinopsisComentCtrl.notasInt = $window.angular.copy(docSinopsisComentCtrl.notas); // Notas
                } 
              } 
            // Funcion para datos editados
            docSinopsisComentCtrl.datoEditado = function (campo, valorNuevo) {
                pimcBarraEstadoService.registrarAccion("Dato Principal" + campo + " modificado " + valorNuevo);
                docSinopsisComentCtrl.datosPrincipalesInt.estado = pimcService.datosEstados.MODIFICADO;
                docSinopsisComentCtrl.reportarCambio({
                    datosPrincipales: docSinopsisComentCtrl.datosPrincipalesInt, 
                    notas: docSinopsisComentCtrl.notasInt });
            };
    
            docSinopsisComentCtrl.notificarNotasCambios = function (notas) {
                docSinopsisComentCtrl.notasInt = notas;
                docSinopsisComentCtrl.reportarCambio({
                    datosPrincipales: docSinopsisComentCtrl.datosPrincipalesInt,
                    notas: docSinopsisComentCtrl.notasInt });
            };

        }]);
    
        documentoPerfil.component('pimcDocumentoDatosPrincipales', {
            bindings: {
                datosPrincipales: '<',
                filesLista: '<',
                activo: '<',
                reportarCambio:'&'
            },
            controller: 'documentoDatosPrincipalesController',
            controllerAs: 'documentoDatosPrincipalesCtrl',
            templateUrl: 'views/documento/documentoDatosPrincipales.html'
        });

        documentoPerfil.component('pimcDocumentoSinopsisComentarios', {
            bindings: {
                datosPrincipales: '<',
                activo: '<',
                notas: '<',
                reportarCambio:'&'
            },
            controller: 'documentoSinopsisComentariosCtrl',
            controllerAs: 'docSinopsisComentCtrl',
            templateUrl: 'views/documento/documentoSinopsisComentarios.html'
        });
    
    })(window.angular);