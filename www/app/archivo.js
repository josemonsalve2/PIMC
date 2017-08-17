////////////////////////////////////////////////////////////////////////////////////
// ARCHIVO PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {    

    'use strict';

    var archivoPerfil = angular.module('archivoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    archivoPerfil.controller('archivoPerfilController', ['$scope', '$sce', '$q', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function($scope, $sce, $q, $http, $window, $location, $filter, i18nService, uiGridConstants) {
        var init = function() {
            $scope.archivoID = $window.localStorage.getItem("archivoID");
            // If not set, redirect.
            if (!$scope.archivoID) {
                console.log("No hay archivoID" + seleccionado);
                //TODO Enviar varios seleccionados
                $window.location.href = "#!/busqueda";
            }
            if (!$scope.datosGuardados) {
                $scope.registrarAccion("Archivo <strong>" + $scope.archivoID + "</strong> ha sido cargado");
            } else {
                $scope.registrarAccion("Archivo <strong>" + $scope.archivoID + "</strong> ha sido guardado en la base de datos");
                $scope.datosGuardados = false;
            }
            // DATOS PRINCIPALES
            $scope.cargarDatosPrincipales();
            // ANOTACIONES
            $scope.cargarNotas();
            // DOCUMENTOS
            $scope.cargarDocumentos();
        };

        //Datos principales
        $scope.datosPrincipales = {
            archivoTitulo: "",
            archivoFondo: "",
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
            palabrasClaves: {},
            disponibilidad: "",
        };

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipales.editado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/ConsultaArchivo?archivoID=' + $scope.archivoID).then(function(data) {
                //Obtener los datos JSON
                var archivoDatos = data.data[0];
                //Log
                console.log(archivoDatos);

                //Llenamos los datos del archivo
                $scope.datosPrincipales.archivoTitulo = archivoDatos.titulo;
                $scope.datosPrincipales.archivoFondo = archivoDatos.fondo;
                $scope.datosPrincipales.institucionFondo = archivoDatos.institucionFondo;
                $scope.datosPrincipales.seccion = archivoDatos.seccion;
                $scope.datosPrincipales.numRefDentroFondo = archivoDatos.numRefDentroFondo;
                $scope.datosPrincipales.fechaInicial = $filter('date')(new Date(archivoDatos.fechaInicial), String(archivoDatos.fechaInicialFormato).toLowerCase());
                $scope.datosPrincipales.fechaFinal = $filter('date')(new Date(archivoDatos.fechaFinal), String(archivoDatos.fechaFinalFormato).toLowerCase());
                $scope.datosPrincipales.folioInicial = archivoDatos.folioInicial;
                $scope.datosPrincipales.folioFinal = archivoDatos.folioFinal;
                $scope.datosPrincipales.legajo = archivoDatos.legajo;
                $scope.datosPrincipales.numOrden = archivoDatos.numOrden;
                $scope.datosPrincipales.numPaginas = archivoDatos.numPaginas;
                $scope.datosPrincipales.palabrasClaves = archivoDatos.palabrasClaves.split(",");
                $scope.datosPrincipales.palabrasClaves = $scope.datosPrincipales.palabrasClaves.map(function(e) {
                    return e.trim();
                });
                $scope.datosPrincipales.disponibilidad = archivoDatos.disponibilidad;

                //Limpiamos la bandera de editado
                $scope.datosPrincipales.editado = false;

                //Para palabras claves
                $scope.palabrasClaves.palabraNueva = {
                    mensaje: "+ Agregar"
                };
                $scope.datosPrincipalesCargando = false;
            });
        };
        $scope.datosPrincipales.datoEditado = function(campo, valorNuevo) {
            switch (campo) {
                case "titulo":
                    if (valorNuevo != $scope.datosPrincipales.archivoTitulo) {
                        $scope.registrarAccion("Titulo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fondo":
                    if (valorNuevo != $scope.datosPrincipales.archivoFondo) {
                        $scope.registrarAccion("Fondo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.datosPrincipales.institucionFondo) {
                        $scope.registrarAccion("Institucion Fondo modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "seccion":
                    if (valorNuevo != $scope.datosPrincipales.seccion) {
                        $scope.registrarAccion("Seccion modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numReferencia":
                    if (valorNuevo != $scope.datosPrincipales.numRefDentroFondo) {
                        $scope.registrarAccion("Numero Referencia dentro del fondo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fechaInicial":
                    if (valorNuevo != $scope.datosPrincipales.fechaInicial) {
                        $scope.registrarAccion("Fecha Inicial modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fechaFinal":
                    if (valorNuevo != $scope.datosPrincipales.fechaFinal) {
                        $scope.registrarAccion("Fecha Fianl modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "folioInicial":
                    if (valorNuevo != $scope.datosPrincipales.folioInicial) {
                        $scope.registrarAccion("Folio Inicial modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "folioFinal":
                    if (valorNuevo != $scope.datosPrincipales.folioFinal) {
                        $scope.registrarAccion("Folio Final modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "legajo":
                    if (valorNuevo != $scope.datosPrincipales.legajo) {
                        $scope.registrarAccion("Legajo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numOrden":
                    if (valorNuevo != $scope.datosPrincipales.numOrden) {
                        $scope.registrarAccion("Numero de Orden modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numPaginas":
                    if (valorNuevo != $scope.datosPrincipales.numPaginas) {
                        $scope.registrarAccion("Numero de Paginas modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "disponibilidadConsulta":
                    if (valorNuevo != $scope.datosPrincipales.disponibilidad) {
                        $scope.registrarAccion("Disponibilidad de consulta modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                default:
                    $scope.registrarAccion("[ERROR] No se pueden modificar datos principales.");
                    break;
            }

        }
        
        // DOCUMENTOS
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
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Documentos?archivoID=' + $scope.archivoID).then(function(data) {
                if (!String(data.data).startsWith("[WARNING]")) {
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
                    console.log($scope.notas);
                    // PERSONAJES
                    $scope.cargarPersonajes();  
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
            console.log("Abriendo documento" + seleccionado);
            //TODO Enviar varios seleccionados
            $window.localStorage.setItem("archivoID", $scope.archivoID);
            $window.localStorage.setItem("documentoID", seleccionado);
            $window.location.href = "#!/documento";
        };


        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/ArchivosNotas?archivoID=' + $scope.archivoID).then(function(data) {
                if (!String(data.data).startsWith("[WARNING]")) {
                    $scope.notas = data.data;
                    $scope.notas.forEach(function(nota) {
                        nota.modificada = false;
                    });
                    // LOG
                    console.log($scope.notas);
                }
            });

        };
        $scope.agregarNotaVacia = function() {
            $scope.registrarAccion("Nota vacia agregada");
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
            $scope.registrarAccion("Nota <strong>" + indexNota + "</strong> eliminada");
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notasAEliminar.push($scope.notas[indexNota]);
            }
            $scope.notas.splice(indexNota, 1);
            $scope.notasCambios = true;
        };
        $scope.modificarNota = function(indexNota, nuevaNota) {
            $scope.registrarAccion("Nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].nota = nuevaNota;
            // fecha creacion esta vacia cuando la nota aun no se encuentra
            // en la base de dats
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            };
            $scope.notasCambios = true;
        };
        $scope.modificarReferencia = function(indexNota, nuevaReferencia) {
            $scope.registrarAccion("Referencia de nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].referencia = nuevaReferencia;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;

        };


        // Palabras claves
        $scope.palabrasClaves = {}
        // Para borrar palabras claves
        $scope.palabrasClaves.modificarBorrarPalabra = function(indexEditada, palabra) {
            if (palabra == "") {
                var palabraEliminada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if (palabraEliminada != "") {
                    $scope.registrarAccion("palabra clave <strong>" + palabraEliminada + "</strong> eliminada");
                    $scope.datosPrincipales.editado = true;
                }
                $scope.datosPrincipales.palabrasClaves.splice(indexEditada, 1);
            } else {
                var palabraModificada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if (palabra != palabraModificada) {
                    $scope.registrarAccion("palabra clave <strong>" + palabraModificada + "</strong> Modificada a <strong>" + palabra + "</strong>");
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
                $scope.registrarAccion("palabra clave <strong>" + palabra + "</strong> agregada");
                $scope.datosPrincipales.editado = true;
            }
            $scope.palabrasClaves.palabraNueva.mensaje = "+ Agregar";
        }
        
        // Cargar Listado personajes
        $scope.hayPersonajes = false;
        $scope.personajes = [];
        $scope.cargarPersonajes = function () {
            $scope.personajes = [];
            var personajesIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefPersonajes',
                          { params:{
                              documentoID: doc.documentoID
                            }
                }).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        listaReferencias.forEach (function (referencia) {
                            var personajeID = referencia.personajeID;
                            if (!personajesIDs.includes(personajeID)) {
                                personajesIDs.push(personajeID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes',
                                          { params:{
                                              personajeID: personajeID
                                            }
                                }).then(function(data) {
                                    if (!String(data.data).startsWith("[WARNING]")) {
                                        var personaje = data.data[0];
                                        personaje.documentosReferencias = [doc.documentoID];
                                        $scope.personajes.push(personaje);
                                        $scope.hayPersonajes = true;
                                    }
                                });
                            } else {
                                // Add the reference to this document
                                $scope.personajes.forEach (function (personaje) {
                                    if (!personaje.documentosReferencias.includes[doc.documentoID])
                                        personaje.documentosReferencias = [doc.documentoID];
                                });
                            }
                        });
                    }
                });
            });
        };
        $scope.abrirPersonaje = function (personajeSel) {
            console.log("Abriendo documento" + personajeSel);
            //TODO Enviar varios seleccionados
            //TODO Preguntar si desea guardar cambios
            $window.localStorage.setItem("archivoID", $scope.archivoID);
            $window.localStorage.setItem("personajeID", personajeSel);
            $window.location.href = "#!/personaje";
        };
        // Cargar Listado Embarcaciones
        $scope.hayEmbarcaciones = false;
        $scope.embarcaciones = [];
        $scope.cargarEmbarcaciones = function () {
            $scope.embarcaciones = [];
            var embarcacionesIDs = [];
            $scope.documentos.forEach(function (doc) {
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefEmbarcacion?documentoID=' + doc.documentoID).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var embarcacionID = referencia.embarcacionID;
                            if (!embarcacionesIDs.includes(embarcacionID)) {
                                embarcacionesIDs.push(embarcacionID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones?embarcacionID=' + embarcacionID).then(function(data) {
                                    if (!String(data.data).startsWith("[WARNING]")) {
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
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefLugares?documentoID=' + doc.documentoID).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var lugarID = referencia.lugarID;
                            if (!lugaresIDs.includes(lugarID)) {
                                lugaresIDs.push(lugarID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Lugares?lugarID=' + lugarID).then(function(data) {
                                if (!String(data.data).startsWith("[WARNING]")) {
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
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefActividades?documentoID=' + doc.documentoID).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var actividadID = referencia.actividadID;
                            if (!actividadesIDs.includes(actividadID)) {
                                actividadesIDs.push(actividadID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Actividades?actividadID=' + actividadID).then(function(data) {
                                    if (!String(data.data).startsWith("[WARNING]")) {
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
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefEventos?documentoID=' + doc.documentoID).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var eventoID = referencia.eventoID;                          
                            if (!fechasSucesosIDs.includes(eventoID)) {
                                fechasSucesosIDs.push(eventoID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Eventos?eventoID=' + eventoID).then(function(data) {
                                    if (!String(data.data).startsWith("[WARNING]")) {
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
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefInstituciones?documentoID=' + doc.documentoID).then(function(data) {
                    if (!String(data.data).startsWith("[WARNING]")) {
                        var listaReferencias = data.data;
                        lstaReferencias.forEach (function (referencia) {
                            var institucionID = referencia.institucionID;
                            if (!institucionesIDs.includes(institucionID)) {
                                institucionesIDs.push(institucionID);
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Instituciones?institucionID=' + institucionID).then(function(data) {
                                    if (!String(data.data).startsWith("[WARNING]")) {
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
        
        
        // Para guardar borrar y barra de estado
        $scope.ultimaAccion = $sce.trustAsHtml("Ninguna");
        // Log
        $scope.registrarAccion = function(mensaje) {
            $scope.ultimaAccion = $sce.trustAsHtml(mensaje);
            console.log(mensaje)
        }
        // Button functions
        $scope.borrarCambios = function() {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                $scope.registrarAccion("Los cambios han sido borrados");
                init();
            }
        };
        $scope.datosGuardados = false;
        $scope.guardarCambios = function() {
            var conexiones = {};
            if ($scope.notasCambios) {
                $scope.registrarAccion("Actualizando BD notasArchivo");
                $scope.notasCambios = false;
                $scope.notas.forEach(function(nota) {
                    // Insertamos notas nuevas
                    if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                        conexiones['notasCambiosCreacion'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/ArchivosNotas?ArchivoID=' + $scope.archivoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"');
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        conexiones['notasCambiosModificada'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/ArchivosNotas?idUnico2=archivoID&idUnico=notaID&notaID=' + nota.notaID + ' &archivoID=' + $scope.archivoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"');
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function(nota) {
                    conexiones['notasCambiosEliminadas'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/ArchivosNotas?idUnico=archivoID&idUnico2=notaID&notaID=' + nota.notaID + '&archivoID=' + $scope.archivoID);
                });

            }
            //Revisamos datos principales editados
            if ($scope.datosPrincipales.editado) {
                $scope.registrarAccion("Actualizando BD Archivos");
                conexiones['datosPrincipalesCambionsModificados'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/Archivos?idUnico=archivoID&archivoID=' + $scope.archivoID +
                    '&titulo="' + $scope.datosPrincipales.archivoTitulo +
                    '"&institucionFondo="' + $scope.datosPrincipales.institucionFondo +
                    '"&numRefDentroFondo="' + $scope.datosPrincipales.numRefDentroFondo +
                    //'"&fechaInicial="' + $scope.datosPrincipales.fechaInicial +
                    //'"&fechaFinal="' + $scope.datosPrincipales.fechaFinal +
                    '"&seccion="' + $scope.datosPrincipales.seccion +
                    '"&fondo="' + $scope.datosPrincipales.archivoFondo +
                    '"&legajo="' + $scope.datosPrincipales.legajo +
                    '"&numOrden="' + $scope.datosPrincipales.numOrden +
                    '"&folioInicial="' + $scope.datosPrincipales.folioInicial +
                    '"&folioFinal="' + $scope.datosPrincipales.folioFinal +
                    '"&numPaginas="' + $scope.datosPrincipales.numPaginas +
                    '"&palabrasClaves="' + $scope.datosPrincipales.palabrasClaves.join(', ') +
                    '"&disponibilidad="' + $scope.datosPrincipales.disponibilidad + '"'
                );
            }
            // Revisamos documentos
            if ($scope.documentosCambio) {
                $scope.documentosNuevos.forEach(function (docNuevo) {
                    $scope.registrarAccion("Actualizando BD Documentos")
                    conexiones['documentosCambiosInsertados'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Documentos?archivoID=' + $scope.archivoID + 
                            '&tipoDocumento="' + docNuevo.tipoDocumento +
                            '"&formatoDisponible="' + docNuevo.formatoDisponible +
                            '"&listaTemas="' + docNuevo.listaTemas +'"'
                    );
                });
                $scope.documentosAEliminar.forEach(function (docABorrar) {
                    $scope.registrarAccion("Eliminando documento de la base de datos")
                    conexiones['documentosCambiosEliminados'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/Documentos',
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
                        console.log(res.data);
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
 
  