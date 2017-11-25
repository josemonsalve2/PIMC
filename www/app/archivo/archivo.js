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
                    // EMBARCACIONES
                    $scope.cargarEmbarcaciones();
                    // LUGARES Y TERRITORIOS
                    $scope.cargarLugaresTerritorios();
                    // ACTIVIDADES
                    $scope.cargarActividades();
                    // EVENTOS
                    $scope.cargarEventos();
                    // INSTITUCIONES
                    $scope.cargarInstituciones();
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
          });
        };
        
        // Cargar Listado Embarcaciones
        $scope.embarcacionesArchivo = [];
        $scope.embarcacionesArchivoColumnas = {
          campos: [
            'nombre',
            'alias',
            'tipo',
            'categoria'
          ],
          nombres: {
            'nombre': "Nombre",
            'alias': "Alias",
            'tipo': "Tipo de Embarcacion",
            'categoria': "Categoria"
          }
        };
        $scope.cargarEmbarcaciones = function () {
            pimcTablaListaRefService.cargarElementos("Embarcaciones", $scope.archivoID, $scope.documentos)
            .then(function(embarcaciones) {
              $scope.embarcacionesArchivo = embarcaciones;
            });
          };

        // Cargar Listado Lugares y Territorios
        $scope.lugaresTerritoriosArchivo = [];
        $scope.lugaresTerritoriosArchivoColumnas = {
          campos: [
            'elementoRelacional',
            'nombre',
            'tipo',
            'categoria',
          ],
          nombres: {
            'nombre': "Nombre",
            'tipo': "Tipo",
            'categoria': "Categoria"
          }
        };

        $scope.cargarLugaresTerritorios = function () {
          pimcTablaListaRefService.cargarElementos("Lugares", $scope.archivoID, $scope.documentos)
          .then(function(lugares) {
            $scope.lugaresTerritoriosArchivo.concat(lugares);
          })
          pimcTablaListaRefService.cargarElementos("Territorios", $scope.archivoID, $scope.documentos)
          .then(function(territorios) {
            $scope.lugaresTerritoriosArchivo.concat(territorios);
          });
        };

        // Cargar Listado Actividades
        $scope.actividadesArchivo = [];
        $scope.actividadesArchivoColumnas = {
          campos: [
            'nombre',
            'tipo',
            'descripcion',
            'herramientas',
            'materiales',
            'personalInvolucrado'
          ],
          nombres: {
            'nombre': "Nombre",
            'tipo': "Tipo de actividad",
            'descripcion': "Descripción",
            'herramientas': "Herramientas",
            'materiales': "Materiales",
            'personalInvolucrado': "Personal Invulucrado"
          }
        };

        $scope.cargarActividades = function () {
          pimcTablaListaRefService.cargarElementos("Actividades", $scope.archivoID, $scope.documentos)
          .then(function(actividades) {
            $scope.actividadesArchivo = actividades;
          });
        };
            
        // Cargar Listado de Eventos
        $scope.eventosArchivo = [];
        $scope.eventosColumnas = {
          campos: [
            'fecha',
            'descripcion',
            'categoriaEvento'
          ],
          camposTipos: {
              'fecha': 'Date'
          },
          nombres: {
            'fecha': 'Fecha del evento',
            'descripcion': 'Descripción',
            'categoriaEvento': 'Categoria del evento' 
          }
        };

        $scope.cargarEventos = function () {
          pimcTablaListaRefService.cargarElementos("Eventos", $scope.archivoID, $scope.documentos)
          .then(function(eventos) {
            $scope.eventosArchivo = eventos;
          });
        };

        // Cargar Listado de instituciones
        $scope.institucionesArchivo = [];
        $scope.institucionesArchivoColumnas = {
          campos: [
            'nombre',
            'tipo',
            'descripcion',
            'herramientas',
            'materiales',
            'personalInvolucrado'
          ],
          nombres: {
            'nombre': "Nombre",
            'tipo': "Tipo de actividad",
            'descripcion': "Descripción",
            'herramientas': "Herramientas",
            'materiales': "Materiales",
            'personalInvolucrado': "Personal Invulucrado"
          }
        };

        $scope.cargarInstituciones = function () {
          pimcTablaListaRefService.cargarElementos("Instituciones", $scope.archivoID, $scope.documentos)
          .then(function(instituciones) {
            $scope.institucionesArchivo = instituciones;
          })
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
 
  