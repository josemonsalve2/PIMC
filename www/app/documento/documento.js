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
         'pimcTablaRefElementoService',
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
                  pimcTablaRefElementoService, 
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

                // Cargamoss los datos principales
                $scope.cargarDatosPrincipales();

                // Cargamos Emisor Receptor
                $scope.cargarEmisorReceptor();

                // Anotaciones
                $scope.cargarNotas();

                // Personajes
                $scope.cargarPersonajes();

                // Embarcaciones
                $scope.cargarEmbarcaciones();

                // Actividades 
                $scope.cargarActividades();

                // Actividades 
                $scope.cargarEventos();

                // Instituciones 
                $scope.cargarInstituciones();
            }
        };
        
        //Datos principales
        $scope.datosPrincipales = {
            tipoDocumento: "",
            estadoConservacion: "",
            formatoDisponible: "",
            fechaMinima: "",
            fechaMinimaFormato: "",
            fechaMaxima: "",
            fechaMaximaFormato: "",
            sinopsis: "",
            listaTemas: []
        };

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipalesEditado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Documentos?documentoID=' + $scope.documentoID).then(function(data) {
                //Obtener los datos JSON
                var documentoDatos = data.data[0];
                
                //Log
                pimcService.debug(documentoDatos);

                try {
                    //Llenamos los datos del documento
                    $scope.datosPrincipales.tipoDocumento = documentoDatos.tipoDocumento;
                    $scope.datosPrincipales.estadoConservacion = documentoDatos.estadoConservacion;
                    $scope.datosPrincipales.formatoDisponible = documentoDatos.formatoDisponible;
                    $scope.datosPrincipales.fechaMinima = documentoDatos.fechaMinima != null ? $filter('date')(new Date(documentoDatos.fechaMinima), String(documentoDatos.fechaMinFormato).toLowerCase()) : "";
                    $scope.datosPrincipales.fechaMinFormato = documentoDatos.fechaMinFormato;
                    $scope.datosPrincipales.fechaMaxima = documentoDatos.fechaMaxima != null ? $filter('date')(new Date(documentoDatos.fechaMaxima), String(documentoDatos.fechaMaxFormato).toLowerCase()) : "";
                    $scope.datosPrincipales.fechaMaxFormato = documentoDatos.fechaMaxFormato;
                    $scope.datosPrincipales.sinopsis = documentoDatos.sinopsis;
                    $scope.datosPrincipales.listaTemas = documentoDatos.listaTemas.split(",");
                    $scope.datosPrincipales.listaTemas = $scope.datosPrincipales.listaTemas.map(function(e) {
                        return e.trim();
                    });
                }
                catch(err) {
                    pimcService.debug("Problema cargando los valores de datos principales del documento " + err.message);
                }

                //Limpiamos la bandera de editado
                $scope.datosPrincipalesEditado = false;

                //Para palabras claves
                $scope.listaTemas.temaNuevo = {
                    mensaje: "+ Agregar"
                };
                $scope.datosPrincipalesCargando = false;
            });
        };
        $scope.datosPrincipales.datoEditado = function(campo, valorNuevo) {
            switch (campo) {
                case "tipoDocumento":
                    if (valorNuevo != $scope.datosPrincipales.archivoTitulo) {
                        pimcBarraEstadoService.registrarAccion("Tipo de documento modificado");
                        $scope.datosPrincipalesEditado = true;
                    }
                    break;
                case "estadoConservacion":
                    if (valorNuevo != $scope.datosPrincipales.archivoFondo) {
                        pimcBarraEstadoService.registrarAccion("Estado de conservacion modificado");
                        $scope.datosPrincipalesEditado = true;
                    }
                    break;
                case "formatoDisponible":
                    if (valorNuevo != $scope.datosPrincipales.institucionFondo) {
                        pimcBarraEstadoService.registrarAccion("Formato disponible modificado");
                        $scope.datosPrincipalesEditado = true;
                    }
                    break;
                case "sinopsis":
                    if (valorNuevo != $scope.datosPrincipales.seccion) {
                        pimcBarraEstadoService.registrarAccion("Sinopsis modificada");
                        $scope.datosPrincipalesEditado = true;
                    }
                    break;
                default:
                    pimcBarraEstadoService.registrarAccion("[ERROR] No se pueden modificar datos principales.");
                    break;
            }

        }
        
        // Temas
        $scope.listaTemas = {}
        // Para borrar Temas
        $scope.listaTemas.modificarBorrarTema = function(indexEditada, tema) {
            if (tema == "") {
                var temaEliminado = $scope.datosPrincipales.listaTemas[indexEditada];
                if (temaEliminado != "") {
                    pimcBarraEstadoService.registrarAccion("Tema <strong>" + temaEliminado + "</strong> eliminado");
                    $scope.datosPrincipalesEditado = true;
                }
                $scope.datosPrincipales.listaTemas.splice(indexEditada, 1);
            } else {
                var temaModificado = $scope.datosPrincipales.listaTemas[indexEditada];
                if (tema != temaModificado) {
                    pimcBarraEstadoService.registrarAccion("Tema <strong>" + temaModificado + "</strong> Modificado a <strong>" + tema + "</strong>");
                    $scope.datosPrincipales.listaTemas[indexEditada] = tema;
                    $scope.datosPrincipalesEditado = true;
                }
            }
        }
        //Para agregar temas
        $scope.listaTemas.temaNuevo = {
            mensaje: '+ Agregar'
        };
        $scope.listaTemas.borrarCampo = function() {
            $scope.listaTemas.temaNuevo.mensaje = "";
        }
        $scope.listaTemas.mostrarCampo = function() {
            $scope.listaTemas.temaNuevo.mensaje = "+ Agregar";
        }
        $scope.listaTemas.agregarTemaNuevo = function(tema) {
            if (!$scope.datosPrincipales.listaTemas.includes(tema) && tema.length != 0) {
                $scope.datosPrincipales.listaTemas.push(tema);
                pimcBarraEstadoService.registrarAccion("Tema <strong>" + tema + "</strong> agregado");
                $scope.datosPrincipalesEditado = true;
            }
            $scope.listaTemas.temaNuevo.mensaje = "+ Agregar";
        }
        
        // Emisor y receptor
        $scope.emisorReceptorEditado = false;
        $scope.emisorReceptor = [];
        $scope.emisorReceptorEliminar = [];
        $scope.emisorReceptorActivo = 0;
        // Para eliminar una entrada emisorReceptor
        $scope.eliminarEmisorReceptor = function (index) {
            $scope.emisorReceptorEditado = true;
            if ($scope.emisorReceptor[index].emisorReceptorID != -1) {
                $scope.emisorReceptorEliminar.push($scope.emisorReceptor[index].emisorReceptorID);
            }
            $scope.emisorReceptor.splice(index,1);
            $timeout(function() {
                $scope.emisorReceptorActivo = index-1; // El nuevo elemento es el activo
            });
        }
        // Para agregar una entrada emisorReceptor
        $scope.agregarEmisorReceptor = function () {
            $scope.emisorReceptorEditado = true;
            var nuevoEmisorReceptor = {}
            nuevoEmisorReceptor.emisorReceptorID = -1;
            nuevoEmisorReceptor.nuevo = true;
            nuevoEmisorReceptor.emisor= {
                personaje: "",
                cargo: "",
                institucion: "",
                nota: ""
            }
            nuevoEmisorReceptor.receptor= {
                personaje: "",
                cargo: "",
                institucion: "",
                nota: ""
            }
            // Agregarlo a la lista de emisor y receptor
            $scope.emisorReceptor.push(nuevoEmisorReceptor);
            
            $timeout(function() {
                $scope.emisorReceptorActivo = $scope.emisorReceptor.length - 1; // El nuevo elemento es el activo
            });
        }
        // Para modificar el emisor de una entrada emisorReceptor
        $scope.modificarEmisor = function (index, elementoEditado, valorNuevo) {
            $scope.emisorReceptorEditado = true;
            switch(elementoEditado) {
                case "personaje":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.personaje) {
                        pimcBarraEstadoService.registrarAccion("Personaje emisor  <strong>" + $scope.emisorReceptor[index].emisor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "cargo":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.cargo) {
                        pimcBarraEstadoService.registrarAccion("Cargo personaje emisor <strong>" + $scope.emisorReceptor[index].emisor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.institucion) {
                        pimcBarraEstadoService.registrarAccion("Institucion emisora <strong>" + $scope.emisorReceptor[index].emisor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "nota":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.nota) {
                        pimcBarraEstadoService.registrarAccion("nota emisor modificada en Emisor Receptor "+(index + 1));
                    }
                    break;
                default:
                pimcBarraEstadoService.registrarAccion("[ERROR] DATO EMISOR INCORRECTO!");
                    break;
            }
        }
        // Para modificar el receptor de una entrada emisorReceptor
        $scope.modificarReceptor = function (index, elementoEditado, valorNuevo) {
            $scope.emisorReceptorEditado = true;
            switch(elementoEditado) {
                case "personaje":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.personaje) {
                        pimcBarraEstadoService.registrarAccion("Personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "cargo":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.cargo) {
                        pimcBarraEstadoService.registrarAccion("Cargo personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.institucion) {
                        pimcBarraEstadoService.registrarAccion("Institucion receptora <strong>" + $scope.emisorReceptor[index].receptor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "nota":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.nota) {
                        pimcBarraEstadoService.registrarAccion("nota receptor modificada en Emisor Receptor "+index);
                    }
                    break;
                default:
                pimcBarraEstadoService.registrarAccion("[ERROR] DATO INCORRECTO!");
                    break;
            }
        }
        $scope.cargarEmisorReceptor = function () {
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID).then(function(data) {
                if (Object.keys(data.data).length != 0) {
                    //Obtener los datos JSON
                    var emisorReceptorDatos = data.data[0];

                    //Log
                    pimcService.debug(emisorReceptorDatos);

                    try {
                        //Llenamos los datos del documento
                        emisorReceptorDatos.forEach(function (emisorReceptorEntrada) {
                            var nuevoEmisorReceptor = {}
                            nuevoEmisorReceptor.emisorReceptorID = emisorReceptorDatos.origenDestinoID;
                            nuevoEmisorReceptor.emisor= {
                                personaje: emisorReceptorEntrada.emitidoPorID,
                                cargo: emisorReceptorEntrada.cargoEmisor,
                                institucion: emisorReceptorEntrada.institucionEmisorID,
                                nota: emisorReceptorEntrada.notasEmisor
                            }
                            nuevoEmisorReceptor.receptor= {
                                personaje: emisorReceptorEntrada.dirigidoAID,
                                cargo: emisorReceptorEntrada.cargoReceptor,
                                institucion: emisorReceptorEntrada.institucionReceptorID,
                                nota: emisorReceptorEntrada.notasReceptor
                            }
                            $scope.emisorReceptor.push(nuevoEmisorReceptor);
                        });
                    }
                    catch(err) {
                        pimcService.debug("Problema cargando los emisores y receptores de la base de datos");
                    }
                }

                //Limpiamos la bandera de editado
                $scope.emisorReceptorEditado = false;
                });
        }
        
        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/DocumentosNotas?documentoID=' + $scope.documentoID).then(function(data) {
                if (Object.keys(data.data).length != 0) {
                    $scope.notas = data.data;
                    $scope.notas.forEach(function(nota) {
                        nota.modificada = false;
                    });
                    // LOG
                    pimcService.debug($scope.notas);
                }
            });

        };
        $scope.agregarNotaVacia = function() {
            pimcBarraEstadoService.registrarAccion("Nota vacia agregada");
            // Una nota que no tiene fecha de creacion es una nota que no existe en la base de datos aun
            if ($scope.notas === "") {
                $scope.notas = [{
                    nota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: "",
                    modificada: false
                }];
            } else {
                $scope.notas.push({
                    nota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: "",
                    modificada: false
                });
            }
            $scope.notasCambios = true;
        }
        $scope.eliminarNota = function(indexNota) {
            pimcBarraEstadoService.registrarAccion("Nota <strong>" + indexNota + "</strong> eliminada");
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notasAEliminar.push($scope.notas[indexNota]);
            }
            $scope.notas.splice(indexNota, 1);
            $scope.notasCambios = true;
        };
        $scope.modificarNota = function(indexNota, nuevaNota) {
            pimcBarraEstadoService.registrarAccion("Nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].nota = nuevaNota;
            // fecha creacion esta vacia cuando la nota aun no se encuentra
            // en la base de dats
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            };
            $scope.notasCambios = true;
        };
        $scope.modificarReferencia = function(indexNota, nuevaReferencia) {
            pimcBarraEstadoService.registrarAccion("Referencia de nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].referencia = nuevaReferencia;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;
        };
        $scope.modificarFechaHistorica = function(indexNota, nuevaFechaHistorica) {
            pimcBarraEstadoService.registrarAccion("Fecha Historica de nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].fechaHistorica = nuevaFechaHistorica;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;
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
            //Revisamos datos principales editados
            if ($scope.datosPrincipalesEditado) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD Documentos");
                var request = 'http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/Documentos';
                
                var parameters = {
                    idUnico:documentoID,
                    documentoID:$scope.documentoID
                }

                var agregado = false;
                for (var key in $scope.datosPrincipales) {
                    var value = $scope.datosPrincipales[key];
                    if (key == 'listaTemas' && value.length != 0) {
                        parametros[key] = "'" + value.join(", ") + "'";
                        agregado = true;
                    } else if (value != null && value != "" ) {
                        if (typeof value === 'string') {
                            parametros[key] = "'" + value + "'";
                        } else {
                            parametros[key] = value;
                        }
                        agregado = true;
                    }                          
                };
                
                if (agregado) {
                    conexiones['datosPrincipalesModificados'] = $http.get(request,{params:parameters});
                }
            }
            // Anotaciones
            if ($scope.notasCambios) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD notasArchivo");
                $scope.notasCambios = false;
                $scope.notas.forEach(function(nota) {
                    // Insertamos notas nuevas
                    if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                        conexiones['anotacionesInsertar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/DocumentosNotas',
                                                                      { params: {
                                                                            documentoID:$scope.documentoID,
                                                                            nota:"'" + nota.nota + "'",
                                                                            referencia:"'" + nota.referencia + '"'
                                                                        }
                                                                      });
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        var config = {params: {
                                        idUnico:'documentoID',
                                        idUnico2:'notaID',
                                        notaID: nota.notaID,
                                        documentoID:$scope.documentoID,
                                        nota:"'" + nota.nota + "'",
                                        referencia:"'" + nota.referencia + "'"
                                        }
                                      };
                        conexiones['anotacionesModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/DocumentosNotas',config);
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function(nota) {
                    var config = { params: {
                                        idUnico2:'documentoID',
                                        idUnico:'notaID',
                                        notaID:nota.notaID,
                                        documentoID:$scope.documentoID
                                }};
                    conexiones['anotacionesEliminar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/DocumentosNotas');
                });

            }
            
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
                $scope.datosPrincipalesCargando = true;
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
                        $scope.datosPrincipalesCargando = false;
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

