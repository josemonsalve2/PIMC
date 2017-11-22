////////////////////////////////////////////////////////////////////////////////////
// ARCHIVO PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {    

    'use strict';

    var archivoPerfil = angular.module("archivoPerfil", [
      "ngAnimate",
      "ngSanitize",
      "ui.bootstrap",
      "ui.grid",
      "ngTouch",
      "ui.grid.edit",
      "ui.grid.autoResize",
      "ui.grid.selection",
      "ui.grid.cellNav",
      "xeditable"
    ]);
    archivoPerfil.controller('archivoPerfilController', [
      'pimcService', 
      'pimcMenuService',
      'pimcArchivoDatosPrincipalesService',
      'pimcTablaListaRefService',
      'pimcBarraEstadoService', 
      'pimcComentarios', 
      '$scope', 
      '$sce', 
      '$q', 
      '$http', 
      '$window', 
      '$location', 
      '$filter', 
      'uiGridConstants', 
      'i18nService', 
      function( pimcService, pimcMenuService, pimcArchivoDatosPrincipalesService, 
          pimcTablaListaRefService, pimcBarraEstadoService, pimcComentarios, $scope, 
          $sce, $q, $http, $window, $location, $filter, 
          i18nService, uiGridConstants) {
        var init = function() {
            var archivoSeleccionado = pimcMenuService.obtenerElementoSeleccionado("Archivos");
            // If not set, redirect.
            if (!archivoSeleccionado) {
              pimcService.debug("No hay un archivo seleccionado");
              //TODO Enviar varios seleccionados
              $window.location.href = "#!/busqueda";
            } else {
              $scope.archivoID = archivoSeleccionado.id;
                if (!$scope.datosGuardados) {
                    pimcBarraEstadoService.registrarAccion("Archivo <strong>" + $scope.archivoID + "</strong> ha sido cargado");
                } else {
                    pimcBarraEstadoService.registrarAccion("Archivo <strong>" + $scope.archivoID + "</strong> ha sido guardado en la base de datos");
                    $scope.datosGuardados = false;
                }
                // DATOS PRINCIPALES
                $scope.cargarDatosPrincipales();
                // ANOTACIONES
                $scope.cargarNotas();
                // DOCUMENTOS
                $scope.cargarDocumentos().then(function () {
                  // PERSONAJES
                  $scope.cargarPersonajes(); 
                });
                 
            }
        };

        ///////// DATOS PRINCIPALES

        // Inicializamos datos principales
        $scope.datosPrincipales = pimcArchivoDatosPrincipalesService.crearVacio();

        //Bandera para saber cuando esta cargando
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            pimcArchivoDatosPrincipalesService.cargarDatosPrincipales($scope.archivoID).then(function(datosPrincipales) {
                $scope.datosPrincipales = datosPrincipales;
                $scope.datosPrincipalesCargando = false;
            });
        };
        
        $scope.datosPrincipalesEditados = function (datosPrincipales, notas) {
            $scope.datosPrincipales = datosPrincipales;
            $scope.notas = notas;
        };

        // Anotaciones
        $scope.notas = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            pimcComentarios.cargarNotas('Archivos',$scope.archivoID).then( function(notas) {
                $scope.notas = notas;
            });
        };
        
        
        //// DOCUMENTOS

        //Variables necessarias
        $scope.documentos = [];
        $scope.documentosResumen = [];
        $scope.documentosFechaRangoInferior = "";
        $scope.documentosFechaRangoSuperior = "";
        $scope.documentosNuevos = [];
        $scope.documentosAEliminar = [];
        $scope.documentosCambio = false;
        
        //metodo para cargar variables
        $scope.cargarDocumentos = function () {
            // Inicializacion
            $scope.documentos = [];
            $scope.documentosResumen = {};
            $scope.documentosFechaRangoInferior = "";
            $scope.documentosFechaRangoSuperior = "";
            $scope.documentosNuevos = [];
            $scope.documentosAEliminar = [];
            $scope.documentosCambio = false;
            return $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Documentos?archivoID=' + $scope.archivoID).then(function(data) {
                if (Object.keys(data.data).length != 0) {
                    $scope.documentos = data.data;
                    
                    $scope.documentos.forEach(function(doc) {
                        // Arreglando la fecha
                        doc.fechaMinima = $filter('date')(new Date(doc.fechaMinima), String(doc.fechaMinFormato).toLowerCase());
                        doc.fechaMaxima = $filter('date')(new Date(doc.fechaMaxima), String(doc.fechaMaxFormato).toLowerCase());
                        
                        // Fecha rangos
                        if ($scope.documentosFechaRangoInferior === "") {
                            $scope.documentosFechaRangoInferior = doc.fechaMinima;
                        } else if (doc.fechaMinima < $scope.documentosFechaRangoInferior) {
                            $scope.documentosFechaRangoInferior = doc.fechaMinima;
                        }
                        if ($scope.documentosFechaRangoSuperior === "") {
                            $scope.documentosFechaRangoSuperior = doc.fechaMaxima;
                        } else if (doc.fechaMaxima < $scope.documentosFechaRangoSuperior) {
                            $scope.documentosFechaRangoSuperior = doc.fechaMaxima;
                        }

                        // Para el resumen de los archivos
                        if (doc.tipoDocumento in $scope.documentosResumen) {
                            $scope.documentosResumen[doc.tipoDocumento].cantidad++;
                            // Revisamos si el formato disponible ya existe
                            if (!$scope.documentosResumen[doc.tipoDocumento].formatos.includes(doc.formatoDisponible)) {
                                $scope.documentosResumen[doc.tipoDocumento].formatos.push(doc.formatoDisponible);
                            }
                        } else {
                            $scope.documentosResumen[doc.tipoDocumento] = {cantidad: 1, formatos: [doc.formatoDisponible]};
                        }
                    });
                    // LOG
                    pimcService.debug($scope.documentos);
                    return "Success";
                }
            });
        };
        $scope.agregarDocumento = function () {
            var documentoNuevo = {
                documentoID: -1,
                tipoDocumento: "",
                formato: "",
                listaTemas: ""
            };
            $scope.documentosNuevos.push(documentoNuevo);
            $scope.documentosCambio = true;
            
        };
        $scope.borrarDocumentoNuevo = function (indexDocumento) {
            $scope.documentosNuevos.splice(indexDocumento, 1);
        };
        $scope.borrarDocumentoExistente = function (indexDocumento) {
            $scope.documentosAEliminar.push($scope.documentos[indexDocumento]);
            $scope.documentos.splice(indexDocumento,1);
            $scope.documentosCambio = true;
        }
        // TODO: Esta funcion es en caso de ser necesario. No esta siendo usada en este momento
        $scope.reiniciarDocumentosBorrados = function () {
            $scope.documentosAEliminar.forEach (function(doc) {
                $scope.documents.push(doc);
            });
            $scope.documentosAEliminar = [];
        }
        $scope.abrirDocumentoSeleccionado = function (indexDocumento) {
            var seleccionado = $scope.documentos[indexDocumento].documentoID;
            pimcService.debug("Abriendo documento" + seleccionado);
            //TODO Enviar varios seleccionados
            pimcMenuService.abrirElemento("Documentos", seleccionado, "documento[" + seleccionado + "] del archivo " + $scope.archivoID, true);
        };


        


        // Palabras claves
        $scope.palabrasClaves = {}
        // Para borrar palabras claves
        $scope.palabrasClaves.modificarBorrarPalabra = function(indexEditada, palabra) {
            if (palabra == "") {
                var palabraEliminada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if (palabraEliminada != "") {
                    pimcBarraEstadoService.registrarAccion("palabra clave <strong>" + palabraEliminada + "</strong> eliminada");
                    $scope.datosPrincipales.editado = true;
                }
                $scope.datosPrincipales.palabrasClaves.splice(indexEditada, 1);
            } else {
                var palabraModificada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if (palabra != palabraModificada) {
                    pimcBarraEstadoService.registrarAccion("palabra clave <strong>" + palabraModificada + "</strong> Modificada a <strong>" + palabra + "</strong>");
                    $scope.datosPrincipales.palabrasClaves[indexEditada] = palabra;
                    $scope.datosPrincipales.editado = true;
                }
            }
        }
        //Para agregar palabras claves
        $scope.palabrasClaves.palabraNueva = {
            mensaje: '+ Agregar'
        };
        $scope.palabrasClaves.borrarCampo = function() {
            $scope.palabrasClaves.palabraNueva.mensaje = "";
        }
        $scope.palabrasClaves.mostrarCampo = function() {
            $scope.palabrasClaves.palabraNueva.mensaje = "+ Agregar";
        }
        $scope.palabrasClaves.agregarPalabraNueva = function(palabra) {
            if (!$scope.datosPrincipales.palabrasClaves.includes(palabra) && palabra.length != 0) {
                $scope.datosPrincipales.palabrasClaves.push(palabra);
                pimcBarraEstadoService.registrarAccion("palabra clave <strong>" + palabra + "</strong> agregada");
                $scope.datosPrincipales.editado = true;
            }
            $scope.palabrasClaves.palabraNueva.mensaje = "+ Agregar";
        }
        
        // Cargar Listado personajes
        $scope.personajesArchivo = [];
        $scope.personajesArchivoColumnas = {
          campos: [
            'nombre',
            'ocupacion',
            'nacionalidad',
            'categoria'
          ],
          nombres: {
            'nombre': "Nombre",
            'ocupacion': "Ocupación",
            'nacionalidad': "Nacionalidad",
            'categoria': "Categoria"
          }
        };

        $scope.cargarPersonajes = function () {
          pimcTablaListaRefService.cargarElementos("Personajes", $scope.archivoID, $scope.documentos)
          .then(function(personajes) {
            $scope.personajesArchivo = personajes;
          })
        };
        
        // Cargar Listado Embarcaciones
        $scope.hayEmbarcaciones = false;
        $scope.embarcaciones = [];
        $scope.cargarEmbarcaciones = function () {
            $scope.embarcaciones = [];
            var embarcacionesIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosRefEmbarcacion?documentoID=' + doc.documentoID).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var embarcacionID = referencia.embarcacionID;
                            if (!embarcacionesIDs.includes(embarcacionID)) {
                                embarcacionesIDs.push(embarcacionID);
                                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Embarcaciones?embarcacionID=' + embarcacionID).then(function(data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var embarcacion = data.data[0];
                                        embarcacion.documentosReferencias = [doc.documentoID];
                                        $scope.embarcaciones.push(embarcacion);
                                        $scope.hayEmbarcaciones = true;
                                    }
                                });
                            } else {
                                // Add the reference to this document
                                $scope.embarcaciones.forEach (function (embarcacion) {
                                    if (!embarcacion.documentosReferencias.includes[doc.documentoID])
                                        embarcacion.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };      
        // Cargar listado de Lugares
        $scope.hayLugares = false;
        $scope.lugares = [];
        $scope.cargarLugares = function () {
            $scope.lugares = [];
            var lugaresIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosRefLugares?documentoID=' + doc.documentoID).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var lugarID = referencia.lugarID;
                            if (!lugaresIDs.includes(lugarID)) {
                                lugaresIDs.push(lugarID);
                                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Lugares?lugarID=' + lugarID).then(function(data) {
                                if (Object.keys(data.data).length != 0) {
                                    var lugar = data.data[0];
                                    lugar.documentosReferencias = [doc.documentoID];
                                    $scope.lugares.push(lugar);
                                    $scope.hayLugares = true;
                                }
                            });
                            } else {
                                // Add the reference to this document
                                $scope.lugares.forEach (function (lugar) {
                                    if (!lugar.documentosReferencias.includes[doc.documentoID])
                                        lugar.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };      
        // Cargar Listado de Actividades
        $scope.hayActividades = false;
        $scope.actividades = [];
        $scope.cargarActividades = function () {
            $scope.actividades = [];
            var actividadesIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosRefActividades?documentoID=' + doc.documentoID).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var actividadID = referencia.actividadID;
                            if (!actividadesIDs.includes(actividadID)) {
                                actividadesIDs.push(actividadID);
                                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Actividades?actividadID=' + actividadID).then(function(data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var actividad = data.data[0];
                                        actividad.documentosReferencias = [doc.documentoID];
                                        $scope.actividades.push(actividad);
                                        $scope.hayActividades = true;
                                    }
                                });
                            } else {
                                // Add the reference to this document
                                $scope.actividades.forEach (function (actividad) {
                                    if (!actividad.documentosReferencias.includes[doc.documentoID])
                                        actividad.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };      
        // Cargar Listado de fechas y sucesos
        $scope.hayFechasSucesos = false;
        $scope.fechasSucesos = [];
        $scope.cargarFechasSucesos = function () {
            $scope.fechasSucesos = [];
            var fechasSucesosIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosRefEventos?documentoID=' + doc.documentoID).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var eventoID = referencia.eventoID;                          
                            if (!fechasSucesosIDs.includes(eventoID)) {
                                fechasSucesosIDs.push(eventoID);
                                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Eventos?eventoID=' + eventoID).then(function(data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var fechaSuceso = data.data[0];
                                        fechaSuceso.documentosReferencias = [doc.documentoID];
                                        $scope.fechasSucesos.push(fechaSuceso);
                                        $scope.hayFechasSucesos = true;
                                    }
                                });
                            } else {
                                // Add the reference to this document
                                $scope.fechasSucesos.forEach (function (fechaSuceso) {
                                    if (!fechaSuceso.documentosReferencias.includes[doc.documentoID])
                                        fechaSuceso.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };      
        // Cargar Listado de instituciones
        $scope.hayInstituciones = false;
        $scope.instituciones = [];
        $scope.cargarInstituciones = function () {
            $scope.instituciones = [];
            var institucionesIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosRefInstituciones?documentoID=' + doc.documentoID).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var institucionID = referencia.institucionID;
                            if (!institucionesIDs.includes(institucionID)) {
                                institucionesIDs.push(institucionID);
                                $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Instituciones?institucionID=' + institucionID).then(function(data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var institucion = data.data[0];
                                        institucion.documentosReferencias = [doc.documentoID];
                                        $scope.instituciones.push(institucion);
                                        $scope.hayInstituciones = true;
                                    }
                                });
                            } else {
                                // Add the reference to this document
                                $scope.instituciones.forEach (function (institucion) {
                                    if (!institucion.documentosReferencias.includes[doc.documentoID])
                                        institucion.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };
        
        
        // Button functions
        $scope.borrarCambios = function() {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                pimcBarraEstadoService.registrarAccion("Los cambios han sido borrados");
                init();
            }
        };
        $scope.datosGuardados = false;
        $scope.guardarCambios = function() {
            var conexiones = {};

            // Guardar datos principales
            conexiones['datosPrincipales'] = pimcArchivoDatosPrincipalesService.guardarDatosPrincipales($scope.datosPrincipales);
            // Guardar notas
            conexiones['commentarios'] = pimcComentarios.guardarNotas('Archivos', $scope.archivoID, $scope.notas);

           // Revisamos documentos
            if ($scope.documentosCambio) {
                $scope.documentosNuevos.forEach(function (docNuevo) {
                    pimcBarraEstadoService.registrarAccion("Actualizando BD Documentos")
                    conexiones['documentosCambiosInsertados'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Documentos?archivoID=' + $scope.archivoID + 
                            '&tipoDocumento="' + docNuevo.tipoDocumento +
                            '"&formatoDisponible="' + docNuevo.formatoDisponible +
                            '"&listaTemas="' + docNuevo.listaTemas +'"'
                    );
                });
                $scope.documentosAEliminar.forEach(function (docABorrar) {
                    pimcBarraEstadoService.registrarAccion("Eliminando documento de la base de datos")
                    conexiones['documentosCambiosEliminados'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/Documentos',
                                {params: {idUnico:'documentoID',
                                        documentoID: docABorrar.documentoID}}
                    );
                    
                });
            }
            if (Object.keys(conexiones).length != 0) {
                $scope.datosPrincipalesCargando = true;
                $scope.datosGuardados = true;
                $q.all(conexiones).then(function(responses) {
                    for (var res in responses) {
                        pimcService.debug(res.data);
                    }
                    init();
                });
            }
        };

        // Initialization fucntion
        init();

    }]);

    archivoPerfil.run(function(editableOptions, editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        editableOptions.buttons = 'no';
    });

 })(window.angular);
 
  