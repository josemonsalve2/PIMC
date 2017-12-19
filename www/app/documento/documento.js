////////////////////////////////////////////////////////////////////////////////////
// DOCUMENTO PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';

    var documentoPerfil = angular.module('documentoPerfil', 
        ['ngAnimate', 
         'ngSanitize', 
         'ui.bootstrap', 
         'ui.grid', 
         'ngTouch', 
         'ui.grid.edit', 
         'ui.grid.autoResize', 
         'ui.grid.selection', 
         'ui.grid.cellNav', 
         'xeditable']);
    documentoPerfil.controller('documentoPerfilController', 
        ['$scope',
         'pimcMenuService', 
         'pimcService',
         'pimcBarraEstadoService',
         'pimcDocumentoDatosPrincipalesService',         
         'pimcTablaRefElementoService',
         'pimcComentarios',          
         '$q', 
         '$http', 
         '$window', 
         '$location', 
         '$filter', 
         '$timeout', 
         'uiGridConstants', 
         'i18nService', 
         '$scope', 
         function($scope, 
                  pimcMenuService, 
                  pimcService, 
                  pimcBarraEstadoService, 
                  pimcDocumentoDatosPrincipalesService,
                  pimcTablaRefElementoService,
                  pimcComentarios,
                  $q, 
                  $http,
                  $window, 
                  $location, 
                  $filter, 
                  $timeout, 
                  i18nService, 
                  uiGridConstants) {
        $scope.documentoID = -1;
        var init = function() {
            var documentoSeleccionado = pimcMenuService.obtenerElementoSeleccionado("Documentos");
            // If not set, redirect.
            if (!documentoSeleccionado) {
              pimcService.debug("No hay un documentos seleccionado");
              //TODO Enviar varios seleccionados
              $window.location.href = "#!/";
            } else {
              $scope.documentoID = documentoSeleccionado.id;
                if (!$scope.datosGuardados) {
                    pimcBarraEstadoService.registrarAccion("Documento <strong>" + $scope.documentoID + "</strong> ha sido cargado");
                } else {
                    pimcBarraEstadoService.registrarAccion("Documento <strong>" + $scope.documentoID + "</strong> ha sido guardado en la base de datos");
                    $scope.datosGuardados = false;
                }

                // Inicializamos todos los contenedors
                $scope.inicializarArrayReferencias();

                var conexiones = [];
                $scope.documentoCargando = true;                

                // DATOS PRINCIPALES
                conexiones.push($scope.cargarDatosPrincipales());

                // ANOTACIONES
                conexiones.push($scope.cargarNotas());

                // Cargamos Emisor Receptor
                //conexiones.push($scope.cargarEmisorReceptor());

                // Personajes
                conexiones.push($scope.cargarPersonajes());

                // Embarcaciones
                conexiones.push($scope.cargarEmbarcaciones());

                // Actividades 
                conexiones.push($scope.cargarActividades());

                // Actividades
                conexiones.push($scope.cargarEventos());

                // Instituciones 
                conexiones.push($scope.cargarInstituciones());

                $q.all(conexiones).then(function(){
                    $scope.documentoCargando = false;                
                });
            }
        };
        
        // Indicador de carga
        $scope.documentoCargando = true;

        //Datos principales
        $scope.datosPrincipales = pimcDocumentoDatosPrincipalesService.crearVacio();

        $scope.cargarDatosPrincipales = function() {
            return pimcDocumentoDatosPrincipalesService.cargarDatosPrincipales($scope.documentoID).then(function(datosPrincipales) {
                $scope.datosPrincipales = datosPrincipales;
                pimcBarraEstadoService.registrarAccion("Documento con referencia <strong>" + $scope.datosPrincipales.contenido.numRefDentroFondo + "</strong> ha sido cargado");                
            });
        };
        
        $scope.datosPrincipalesEditados = function (datosPrincipales) {
            $scope.datosPrincipales = datosPrincipales;
        };

        $scope.sinopsisComentariosEditados = function (datosPrincipales, notas) {
            $scope.datosPrincipales = datosPrincipales;
            $scope.notas = notas;
        };
        

        // Anotaciones
        $scope.notas = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            return pimcComentarios.cargarNotas('Documentos',$scope.documentoID).then( function(notas) {
                $scope.notas = notas;
            });
        };

        
        
        // REFERENCIAS
        $scope.inicializarArrayReferencias = function() {
            $scope.personaje = [];
            $scope.embarcaciones = [];
            $scope.lugares = [];
            $scope.actividades = [];
            $scope.eventos = [];
            $scope.institucion = [];
        };

        // PERSONAJES
        $scope.personajes = [];
        $scope.personajesColumnas = ['nombre', 'ocupacion', 'nacionalidad', 'sexo', 'categoria'];
        $scope.personajesNombresColumnas = {
            nombre: "Nombre Personaje", 
            ocupacion: "Ocupación",
            nacionalidad: "Nacionalidad",
            sexo: "Sexo",
            categoria: "Categoria"
        }
        $scope.autocompletarPersonajesOpciones = {
            camposAutocompletar: ['nombre']
        };
        $scope.cargarPersonajes = function () {
            return pimcTablaRefElementoService.cargarElementos('Personajes', $scope.documentoID).then(
                function(data) {
                    $scope.personajes = data;
                });
        };
        $scope.guardarPersonajes = function () {
            return pimcTablaRefElementoService.guardarElementos('Personajes', $scope.documentoID, $scope.personajes);
        };
        $scope.personajesCambios = function (valores) {
            $scope.personajes = valores;
        };

        // EMBARCACIONES
        $scope.embarcaciones = [];
        $scope.embarcacionesColumnas = ['nombres', 'alias', 'tipo', 'usos', 'categoria'];
        $scope.embarcacionesNombresColumnas = {
            nombres: "Nombres Embarcacion", 
            alias: "Alias Embarcacion",
            tipo: "Tipo de Embarcacion",
            usos: "Usos",
            categoria: "Categoria"
        }
        $scope.autocompletarEmbarcacionesOpciones = {
            camposAutocompletar: ['nombres']
        };
        $scope.cargarEmbarcaciones = function () {
            return pimcTablaRefElementoService.cargarElementos('Embarcaciones', $scope.documentoID).then(
                function(data) {
                    $scope.embarcaciones = data;
                });
        };
        $scope.guardarEmbarcaciones = function () {
            return pimcTablaRefElementoService.guardarElementos('Embarcaciones', $scope.documentoID, $scope.embarcaciones);
        };
        $scope.embarcacionesCambios = function (valores) {
            $scope.embarcaciones = valores;
        };

        // ACTIVIDADES
        $scope.actividades = [];
        $scope.actividadesColumnas = ['tipo', 'descripcion', 'personalInvolucrado', 'herramientas', 'materiales', 'categoria'];
        $scope.actividadesNombresColumnas = {
            tipo: "Tipo de Actividad", 
            descripcion: "Descripción del proceso",
            personalInvolucrado: "Personal involucrado",
            herramientas: "Herramientas Usadas",
            materiales: "Materiales",
            categoria: "Categoria"
        }
        $scope.autocompletaractividadesOpciones = {
            camposAutocompletar: ['tipo']
        };
        $scope.cargarActividades = function () {
            return pimcTablaRefElementoService.cargarElementos('Actividades', $scope.documentoID).then(
                function(data) {
                    $scope.actividades = data;
                });
        };
        $scope.guardarActividades = function () {
            return pimcTablaRefElementoService.guardarElementos('Actividades', $scope.documentoID, $scope.actividades);
        };
        $scope.actividadesCambios = function (valores) {
            $scope.actividades = valores;
        };

        // EVENTOS : FECHAS Y SUCESOS
        $scope.eventos = [];
        $scope.eventosColumnas = [
            'fecha', 
            'descripcion', 
            'categoriaEvento'
        ];
        $scope.eventosTiposColumnas = {
            'fecha': 'Date'
        }
        $scope.eventosNombresColumnas = {
            fecha: "Fecha", 
            descripcion: "Descripción del evento",
            categoriaEvento: "Categoria"
        }
        $scope.cargarEventos = function () {
            return pimcTablaRefElementoService.cargarElementos('Eventos', $scope.documentoID).then(
                function(data) {
                    $scope.eventos = data;
                });
        };
        $scope.guardarEventos = function () {
            return pimcTablaRefElementoService.guardarElementos('Eventos', $scope.documentoID, $scope.eventos);
        };
        $scope.eventosCambios = function (valores) {
            $scope.eventos = valores;
        };


        // INSTITUCIONES
        $scope.instituciones = [];
        $scope.institucionesColumnas = ['nombre', 'tipoInstitucion', 'categoria'];
        $scope.institucionesNombresColumnas = {
            nombre: "Nombre", 
            tipoInstitucion: "Tipo de Institucion",
            categoria: "Categoria"
        }
        $scope.autocompletarInstitucionesOpciones = {
            camposAutocompletar: ['nombre']
        };
        $scope.cargarInstituciones = function () {
            return pimcTablaRefElementoService.cargarElementos('Instituciones', $scope.documentoID).then(
                function(data) {
                    $scope.instituciones = data;
                });
        };
        $scope.guardarInstituciones = function () {
            return pimcTablaRefElementoService.guardarElementos('Instituciones', $scope.documentoID, $scope.instituciones);
        };
        $scope.institucionesCambios = function (valores) {
            $scope.instituciones = valores;
        };

        // Button functions
        $scope.borrarCambios = function() {
            pimcBarraEstadoService.registrarAccion("Los cambios han sido borrados");
            init();
        };
        $scope.datosGuardados = false;
        $scope.guardarCambios = function() {
            var conexiones = {};
            
            // Emisor Receptor
            if ($scope.emisorReceptorEditado) {
                $scope.emisorReceptor.forEach( function (entrada) {
                    // Agregar a la base de datos
    //                  if (entrada.emisorReceptorID == -1) {
    //                      $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
    //                          $scope.datosGuardados = true;
    //                          pimcService.debug(data);
    //                      });
    //                  }
                });
            }
            
            // Guardar datos principales
            conexiones['datosPrincipales'] = pimcDocumentoDatosPrincipalesService.guardarDatosPrincipales($scope.datosPrincipales);
            // Guardar notas
            conexiones['commentarios'] = pimcComentarios.guardarNotas('Documentos', $scope.documentoID, $scope.notas);

            // PERSONAJES
            conexiones['personajesGuardados'] = ($scope.guardarPersonajes());
            // EMBARCACIONES
            conexiones['embarcacionesGuardads'] = $scope.guardarEmbarcaciones();
            // ACTIVIDADES
            conexiones['actividadesGuardadas'] = $scope.guardarActividades();
            // EVENTOS
            conexiones['eventosGuardadas'] = $scope.guardarEventos();
            // INSTITUCIONES
            conexiones['institucionesGuardadas'] = $scope.guardarInstituciones();

            // Incializamos todo
            if (Object.keys(conexiones).length != 0) {
                $scope.documentoCargando = true;
                $scope.datosGuardados = true;
                var guardoAlgo = false;
                $q.all(conexiones).then(function (responses) {
                    for (var res in responses) {
                        if (res && responses[res]) {
                            guardoAlgo = true;
                            if (responses[res].data) {
                                pimcService.debug(res + ' = ' + responses[res].data);
                            }
                            else {
                                pimcService.debug(res + ' = ' + responses[res]);
                            }
                        }
                    }
                    if (guardoAlgo) {
                        init();
                    } else {
                        $scope.documentoCargando = false;
                        $scope.datosGuardados = false;
                    }
                    return true;
                },
                    function (rejectedResponse) {
                        pimcService.debug("[ERROR][GUARDANDO DOCUMENTO = " + $scope.documentoID + " ] " + rejectedResponse);
                        init();                        
                        return false;
                    });
            }
        };
        
        $timeout(function () {init();});
        
    }]);
    
    documentoPerfil.directive("uibTabAgregar", function() {
        return {
            restrict: 'EA',
            scope: {
            handler: '&',
            text:'@'
            },
            template: '<li class="uib-tab nav-item">' +
            '<a ng-click="handler()" class="nav-link" ng-bind="text"></a>' +
            '</li>',
            replace: true
        }
    });

    documentoPerfil.run(function(editableOptions, editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        editableOptions.buttons = 'no';
    });

})(window.angular);

