(function (angular) {
  
  'use strict';

  ////////////////////////////////////////////////////////////////////////////////////
  // INDEX MODULE
  ////////////////////////////////////////////////////////////////////////////////////

  var indexModule = angular.module('indexModule', []);
  indexModule.controller('indexController', [function($scope) {}]);

  ////////////////////////////////////////////////////////////////////////////////////
  // ARCHIVO PERFIL MODULE
  ////////////////////////////////////////////////////////////////////////////////////

  var archivoPerfil = angular.module('archivoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
  archivoPerfil.controller('archivoPerfilController', ['$scope', '$sce', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function($scope, $sce, $http, $window, $location, $filter, i18nService, uiGridConstants) {
      var init = function() {
          $scope.archivoID = $window.localStorage.getItem("archivoID");
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
              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefPersonajes?documentoID=' + doc.documentoID).then(function(data) {
                  if (!String(data.data).startsWith("[WARNING]")) {
                      var listaReferencias = data.data;
                      listaReferencias.forEach (function (referencia) {
                          var personajeID = referencia.personajeID;
                          if (!personajesIDs.includes(personajeID)) {
                              personajesIDs.push(personajeID);
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes?personajeID=' + personajeID).then(function(data) {
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
          if ($scope.notasCambios) {
              $scope.registrarAccion("Actualizando BD notasArchivo");
              $scope.notasCambios = false;
              $scope.notas.forEach(function(nota) {
                  // Insertamos notas nuevas
                  if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/ArchivosNotas?ArchivoID=' + $scope.archivoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  // Modificamos notas viejas
                  if (nota.modificada == true) {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/ArchivosNotas?idUnico2=archivoID&idUnico=notaID&notaID=' + nota.notaID + ' &archivoID=' + $scope.archivoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  }
              });
              // Eliminamos notas eliminadas
              $scope.notasAEliminar.forEach(function(nota) {
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/ArchivosNotas?idUnico=archivoID&idUnico2=notaID&notaID=' + nota.notaID + '&archivoID=' + $scope.archivoID).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              });

          }
          //Revisamos datos principales editados
          if ($scope.datosPrincipales.editado) {
              $scope.registrarAccion("Actualizando BD Archivos");
              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/Archivos?idUnico=archivoID&archivoID=' + $scope.archivoID +
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
              ).then(function(data) {
                  $scope.datosGuardados = true;
                  console.log(data);
              });
          }
          // Revisamos documentos
          if ($scope.documentosCambio) {
              $scope.documentosNuevos.forEach(function (docNuevo) {
                  $scope.registrarAccion("Actualizando BD Documentos")
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Documentos?archivoID=' + $scope.archivoID + 
                        '&tipoDocumento="' + docNuevo.tipoDocumento +
                        '"&formatoDisponible="' + docNuevo.formatoDisponible +
                        '"&listaTemas="' + docNuevo.listaTemas +'"'
                  ).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              });
              $scope.documentosAEliminar.forEach(function (docABorrar) {
                  $scope.registrarAccion("Eliminando documento de la base de datos")
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/Documentos',
                            {params: {idUnico:'documentoID',
                                      documentoID: docABorrar.documentoID}}
                  ).then (function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
                  
              });
          }
          init();
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



  ////////////////////////////////////////////////////////////////////////////////////
  // DOCUMENTO PERFIL MODULE
  ////////////////////////////////////////////////////////////////////////////////////

  var documentoPerfil = angular.module('documentoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
  documentoPerfil.controller('documentoPerfilController', ['$scope', '$sce', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', '$scope', function($scope, $sce, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
    $scope.archivoID = -1;
    $scope.documentoID = -1;
    var init = function() {
          $scope.archivoID = $window.localStorage.getItem("archivoID");
          $scope.documentoID = $window.localStorage.getItem("documentoID");
          if (!$scope.datosGuardados) {
              $scope.registrarAccion("Documento <strong>" + $scope.documentoID + "</strong> del archivo <strong>" + $scope.archivoID + " </strong> ha sido cargado");
          } else {
              $scope.registrarAccion("Documento <strong>" + $scope.archivoID + "</strong> del archivo <strong>" + $scope.archivoID + " </strong> ha sido guardado en la base de datos");
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
      $scope.datosPrincipales.editado = false;
      $scope.datosPrincipalesCargando = true;

      $scope.cargarDatosPrincipales = function() {
          $scope.datosPrincipalesCargando = true;
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Documentos?archivoID=' + $scope.archivoID + '&documentoID=' + $scope.documentoID).then(function(data) {
              //Obtener los datos JSON
              var documentoDatos = data.data[0];
              
              //Log
              console.log(documentoDatos);

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
                  console.log("Problema cargando los valores de datos principales del documento " + err.message);
              }

              //Limpiamos la bandera de editado
              $scope.datosPrincipales.editado = false;

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
                      $scope.registrarAccion("Tipo de documento modificado");
                      $scope.datosPrincipales.editado = true;
                  }
                  break;
              case "estadoConservacion":
                  if (valorNuevo != $scope.datosPrincipales.archivoFondo) {
                      $scope.registrarAccion("Estado de conservacion modificado");
                      $scope.datosPrincipales.editado = true;
                  }
                  break;
              case "formatoDisponible":
                  if (valorNuevo != $scope.datosPrincipales.institucionFondo) {
                      $scope.registrarAccion("Formato disponible modificado");
                      $scope.datosPrincipales.editado = true;
                  }
                  break;
              case "sinopsis":
                  if (valorNuevo != $scope.datosPrincipales.seccion) {
                      $scope.registrarAccion("Sinopsis modificada");
                      $scope.datosPrincipales.editado = true;
                  }
                  break;
              default:
                  $scope.registrarAccion("[ERROR] No se pueden modificar datos principales.");
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
                  $scope.registrarAccion("Tema <strong>" + temaEliminado + "</strong> eliminado");
                  $scope.datosPrincipales.editado = true;
              }
              $scope.datosPrincipales.listaTemas.splice(indexEditada, 1);
          } else {
              var temaModificado = $scope.datosPrincipales.listaTemas[indexEditada];
              if (tema != temaModificado) {
                  $scope.registrarAccion("Tema <strong>" + temaModificado + "</strong> Modificado a <strong>" + tema + "</strong>");
                  $scope.datosPrincipales.listaTemas[indexEditada] = tema;
                  $scope.datosPrincipales.editado = true;
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
              $scope.registrarAccion("Tema <strong>" + tema + "</strong> agregado");
              $scope.datosPrincipales.editado = true;
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
                    $scope.registrarAccion("Personaje emisor  <strong>" + $scope.emisorReceptor[index].emisor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "cargo":
                if (valorNuevo != $scope.emisorReceptor[index].emisor.cargo) {
                    $scope.registrarAccion("Cargo personaje emisor <strong>" + $scope.emisorReceptor[index].emisor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "institucion":
                if (valorNuevo != $scope.emisorReceptor[index].emisor.institucion) {
                    $scope.registrarAccion("Institucion emisora <strong>" + $scope.emisorReceptor[index].emisor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "nota":
                if (valorNuevo != $scope.emisorReceptor[index].emisor.nota) {
                    $scope.registrarAccion("nota emisor modificada en Emisor Receptor "+(index + 1));
                }
                break;
            default:
               $scope.registrarAccion("[ERROR] DATO EMISOR INCORRECTO!");
                break;
          }
      }
      // Para modificar el receptor de una entrada emisorReceptor
      $scope.modificarReceptor = function (index, elementoEditado, valorNuevo) {
          $scope.emisorReceptorEditado = true;
           switch(elementoEditado) {
            case "personaje":
                if (valorNuevo != $scope.emisorReceptor[index].receptor.personaje) {
                    $scope.registrarAccion("Personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "cargo":
                if (valorNuevo != $scope.emisorReceptor[index].receptor.cargo) {
                    $scope.registrarAccion("Cargo personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "institucion":
                if (valorNuevo != $scope.emisorReceptor[index].receptor.institucion) {
                    $scope.registrarAccion("Institucion receptora <strong>" + $scope.emisorReceptor[index].receptor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                }
                break;
            case "nota":
                if (valorNuevo != $scope.emisorReceptor[index].receptor.nota) {
                    $scope.registrarAccion("nota receptor modificada en Emisor Receptor "+index);
                }
                break;
            default:
               $scope.registrarAccion("[ERROR] DATO INCORRECTO!");
                break;
          }
      }
      $scope.cargarEmisorReceptor = function () {
           $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID).then(function(data) {
              if (!String(data.data).startsWith("[WARNING]")) {
                   //Obtener los datos JSON
                  var emisorReceptorDatos = data.data[0];

                  //Log
                  console.log(emisorReceptorDatos);

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
                      console.log("Problema cargando los emisores y receptores de la base de datos");
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
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosNotas?documentoID=' + $scope.documentoID).then(function(data) {
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
      $scope.modificarFechaHistorica = function(indexNota, nuevaFechaHistorica) {
          $scope.registrarAccion("Fecha Historica de nota <strong>" + indexNota + "</strong> modificada");
          $scope.notas[indexNota].fechaHistorica = nuevaFechaHistorica;
          if ($scope.notas[indexNota].fechaCreacion != "") {
              $scope.notas[indexNota].modificada = true;
          }
          $scope.notasCambios = true;
      };
      
      // PERSONAJES
      $scope.personajes = [];
      $scope.personajesNuevos = [];
      $scope.personajesAEliminar = [];
      $scope.personajesAgregarReferencia = [];
      $scope.personajesCambios = false;
      $scope.cargarPersonajes = function () {
          $scope.personajesCambios = false;
          $scope.personajes = [];
          $scope.personajesNuevos = [];
          $scope.personajesAEliminar = [];
          $scope.personajesAgregarReferencia = [];
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefPersonajes?documentoID=' + $scope.documentoID).then(function(data) {
              // revisar si existe alguno
              if (!String(data.data).startsWith("[WARNING]")) {
                  var personajesReferencias = data.data;
                  personajesReferencias.forEach(function(referencia) {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes?personajeID=' + referencia.personajeID).then(function(data) {
                            var personaje = data.data[0];
                            personaje.referenciaID = referencia.referenciaID;
                            $scope.personajes.push(personaje);
                        });
                  });
                  // LOG
                  console.log($scope.personajes);
              }
          });
      }
      $scope.agregarPersonaje = function () {
          var personajeNuevo = {
              personajeID: -1,
              nombre: "",
              ocupacion: "",
              nacionalidad: "",
              sexo: "",
              categoria: ""
          };
          $scope.personajesNuevos.push(personajeNuevo);
          $scope.personajesCambios = true;
          $scope.registrarAccion("Personaje vacío agregado")
      };
      $scope.borrarNuevoPersonaje = function (indice) {
          $scope.personajesNuevos.splice(indice,1);
          $scope.registrarAccion("Personaje nuevo borrado");
      };
      $scope.borrarPersonajeExistente = function(indice) {
          $scope.registrarAccion("Personaje " + $scope.personajes[indice].nombre + " seleccionado para eliminar")
          $scope.personajesAEliminar.push($scope.personajes[indice]);
          $scope.personajes.splice(indice,1);
          $scope.personajesCambios = true;
      }
      $scope.borrarReferenciaNuevaPersonaje = function (indice) {
          $scope.personajesAgregarReferencia.splice(indice,1);
          $scope.registrarAccion("Nueva referencia a personaje borrada");
      };
      $scope.autocompletarPersonaje = function (hintNombre) {
          return $http.get('http://monsalvediaz.com:5000/PIMC0.1/Autocompletar/Personajes?nombre=' + hintNombre).then(function(data) {
              var listaNombres = [];
              var resultados = data.data;
              var matchPerfecto = false;
              if (resultados != "0") {
                  resultados.forEach( function (valor) {
                      listaNombres.push({nombre: valor.nombre, personajeID: valor.personajeID});
                      // Revisamos si son identicos
                      // TODO cambiar acentos 
                      if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombre).toLowerCase().replace(/\s/g, ''))
                          matchPerfecto = true;
                  })
              }
              if (!matchPerfecto && listaNombres.length != 0)
                    listaNombres.unshift({nombre:hintNombre,personajeID:-1})
              return listaNombres;
          });
      };
      $scope.actualizarPersonajeNuevoExistente = function (indice,personaje) {
          var alreadyExist = false;
          // Revisamos si ya existe
          $scope.personajes.forEach(function (elemento) {
              if (personaje.personajeID == elemento.personajeID) {
                  alreadyExist = true;
                  personaje.nombre = "";
                  return;
              }
          });
          // Revisamos si la referencia fue eliminada anteriormente
          $scope.personajesAEliminar.forEach(function (elemento) {
              if (personaje.personajeID == elemento.personajeID) {
                  alreadyExist = true;
                  personaje.nombre = "";
                  return;
              }
          });
          $scope.personajesAgregarReferencia.forEach(function (elemento) {
              if (personaje.personajeID == elemento.personajeID) {
                  alreadyExist = true;
                  personaje.nombre = "";
                  return;
              }
          });
          
          if (!alreadyExist && personaje.personajeID !== -1) {
              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes', {
                params: {
                 personajeID: personaje.personajeID
                }}).then(function(data) {
                  var infoPersonaje = data.data[0];
                  if (!String(infoPersonaje).startsWith("[WARNING]")) {
                      $scope.personajesNuevos.splice(indice,1);
                      var nuevaReferencia = {
                            personajeID: infoPersonaje.personajeID,
                            nombre: infoPersonaje.nombre,
                            ocupacion: infoPersonaje.ocupacion,
                            nacionalidad: infoPersonaje.nacionalidad,
                            sexo: infoPersonaje.sexo,
                            categoria: infoPersonaje.categoria
                      }
                      $scope.personajesAgregarReferencia.push(nuevaReferencia);
                  }
              });
          }

      };
      $scope.abrirPersonajeSeleccionado = function(index, ubicacion) {
          var seleccionado = -1;
          if (ubicacion == "nuevaRef") {
              seleccionado = $scope.personajesAgregarReferencia[index].personajeID;
          } else if (ubicacion == "existente") {
              seleccionado = $scope.personajes[index].personajeID;
          }
          if (seleccionado != -1) {
              console.log("Abriendo documento" + seleccionado);
              //TODO Enviar varios seleccionados
              //TODO Preguntar si desea guardar cambios
              $window.localStorage.setItem("archivoID", $scope.archivoID);
              $window.localStorage.setItem("documentoID", $scope.documentoID);
              $window.localStorage.setItem("personajeID", seleccionado);
              $window.location.href = "#!/personaje";
          }
      };
      $scope.revisarSiPersonajeExiste = function ($value) {
          var existe = false;
          var mensaje = "";
          $scope.personajes.forEach( function(personaje) {
              if ($value == personaje.nombre) {
                  existe = true;
                  mensaje = "Este nombre ya existe";
                  return;
              }
          });
          $scope.personajesAEliminar.forEach( function(personajeEliminado){
              if ($value == personajeEliminado.nombre) {
                  existe = true;
                  mensaje = "Este nombre ya existía, fue eliminado pero los cambios no han sido guardados.";
                  return;
              }
          });
          $scope.personajesAgregarReferencia.forEach( function(personajeRefNueva) {
              if ($value == personajeRefNueva.nombre) {
                  existe = true;
                  mensaje = "Ref ya agregada";
                  return;
              }
          });
          $scope.personajesNuevos.forEach( function(personajeNuevo) {
              if ($value == personajeNuevo.nombre) {
                  existe = true;
                  mensaje = "Personaje ya agregado";
                  return;
              }
          });
          if (existe) {
              return mensaje;
          }
      }
      
      // EMBARCACIONES
      $scope.embarcaciones = [];
      $scope.embarcacionesNuevas = [];
      $scope.embarcacionesAEliminar = [];
      $scope.embarcacionesAgregarReferencia = [];
      $scope.embarcacionesCambios = false;
      $scope.cargarEmbarcaciones = function () {
          $scope.embarcacionesCambios = false;
          $scope.embarcaciones = [];
          $scope.embarcacionesNuevas = [];
          $scope.embarcacionesAEliminar = [];
          $scope.embarcacionesAgregarReferencia = [];
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefEmbarcacion',
                    { params: {
                        documentoID:$scope.documentoID
                      }
                    }
          ).then(function(data) {
              // revisar si existe alguno
              if (!String(data.data).startsWith("[WARNING]")) {
                  var embarcacionReferencias = data.data;
                  embarcacionReferencias.forEach(function(referencia) {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones',
                                  { params: {
                                      embarcacionID:referencia.embarcacionID
                                    }
                                  }
                        ).then(function(data) {
                            var embarcacion = data.data[0];
                            embarcacion.referenciaID = referencia.referenciaID;
                            embarcacion.comentario = referencia.comentario;
                            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesBanderas',
                                  { params: {
                                      embarcacionID:referencia.embarcacionID
                                    }
                                  }
                            ).then(function(data) {
                                var banderas = data.data;
                                var listaBanderas = [];
                                banderas.forEach(function(bandera) {
                                    listaBanderas.push(bandera.bandera);
                                });
                                embarcacion.banderas = listaBanderas.join(', ');
                                $scope.embarcaciones.push(embarcacion);
                               
                            });
                        });
                        
                  });
                  // LOG
                  console.log($scope.embarcaciones);
              }
          });
      }
      $scope.agregarEmbarcacion = function () {
          var embarcacionNueva = {
              embarcacionID: -1,
              nombres: "",
              alias: "",
              tipo: "",
              banderas: "",
              usos: "",
              categoria: "",
              comentario: ""
          };
          $scope.embarcacionesNuevas.push(embarcacionNueva);
          $scope.embarcacionesCambios = true;
          $scope.registrarAccion("Embarcacion vacía agregada")
      };
      $scope.borrarNuevaEmbarcacion = function (indice) {
          $scope.embarcacionesNuevas.splice(indice,1);
          $scope.registrarAccion("Embarcación nueva borrada");
      };
      $scope.borrarEmbarcacionExistente = function(indice) {
          $scope.registrarAccion("Embarcación " + $scope.embarcaciones[indice].nombres + " seleccionada para eliminar")
          $scope.embarcacionesAEliminar.push($scope.embarcaciones[indice]);
          $scope.embarcaciones.splice(indice,1);
          $scope.embarcacionesCambios = true;
      }
      $scope.borrarReferenciaNuevaEmbarcacion = function (indice) {
          $scope.embarcacionesAgregarReferencia.splice(indice,1);
          $scope.registrarAccion("Nueva referencia a embarcación borrada");
      };
      $scope.autocompletarEmbarcacion = function (hintNombre) {
          return $http.get('http://monsalvediaz.com:5000/PIMC0.1/Autocompletar/Embarcaciones',
                           { params: {
                               nombres:hintNombre
                             }
                           }
                  ).then(function(data) {
                      var listaNombres = [];
                      var resultados = data.data;
                      var matchPerfecto = false;
                      if (resultados != "0") {
                          resultados.forEach( function (valor) {
                              listaNombres.push({nombres: valor.nombres, embarcacionID: valor.embarcacionID});
                              // Revisamos si son identicos
                              // TODO cambiar acentos 
                              if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombres).toLowerCase().replace(/\s/g, ''))
                                  matchPerfecto = true;
                          })
                      }
                      if (!matchPerfecto && listaNombres.length != 0)
                            listaNombres.unshift({nombres:hintNombre,embarcacionID:-1})
                      return listaNombres;
                  });
      };
      $scope.actualizarEmbarcacionNuevaExistente = function (indice,embarcacion) {
          var alreadyExist = false;
          // Revisamos si ya existe
          $scope.embarcaciones.forEach(function (elemento) {
              if (embarcacion.embarcacionID == elemento.embarcacionID) {
                  alreadyExist = true;
                  embarcacion.nombres = "";
                  return;
              }
          });
          // Revisamos si la referencia fue eliminada anteriormente
          $scope.embarcacionesAEliminar.forEach(function (elemento) {
              if (embarcacion.embarcacionID == elemento.embarcacionID) {
                  alreadyExist = true;
                  embarcacion.nombres = "";
                  return;
              }
          });
          $scope.embarcacionesAgregarReferencia.forEach(function (elemento) {
              if (embarcacion.embarcacionID == elemento.embarcacionID) {
                  alreadyExist = true;
                  embarcacion.nombres = "";
                  return;
              }
          });
          
          if (!alreadyExist && embarcacion.embarcacionID !== -1) {
              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones', {
                params: {
                 embarcacionID: embarcacion.embarcacionID
                }}
              ).then(function(data) {
                  var infoEmbarcacion = data.data[0];
                  if (!String(infoEmbarcacion).startsWith("[WARNING]")) {
                      $scope.embarcacionesNuevas.splice(indice,1);
                      var nuevaReferencia = {
                            embarcacionID: infoEmbarcacion.embarcacionID,
                            alias: infoEmbarcacion.alias,
                            tipo: infoEmbarcacion.tipo,
                            usos: infoEmbarcacion.usos,
                            categoria: infoEmbarcacion.categoria,
                            comentario: infoEmbarcacion.comentario
                      }
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesBanderas', {
                        params: {
                         embarcacionID: embarcacion.embarcacionID
                        }}
                      ).then(function(data) {
                        if (!String(infoEmbarcacion).startsWith("[WARNING]")) {
                            var banderas = data.data;
                            var listaBanderas = [];
                            banderas.forEach(function(bandera) {
                                listaBanderas.push(bandera.bandera);
                            });
                            nuevaReferencia.banderas = listaBanderas.join(', ');
                            $scope.embarcacionesAgregarReferencia.push(nuevaReferencia);
                        }
                      });
                  }
              });
          }

      };
      $scope.abrirEmbarcacionSeleccionada = function(index, ubicacion) {
          var seleccionado = -1;
          if (ubicacion == "nuevaRef") {
              seleccionado = $scope.embarcacionesAgregarReferencia[index].embarcacionID;
          } else if (ubicacion == "existente") {
              seleccionado = $scope.embarcaciones[index].embarcacionID;
          }
          if (seleccionado != -1) {
              console.log("Abriendo documento" + seleccionado);
              //TODO Enviar varios seleccionados
              //TODO Preguntar si desea guardar cambios
              $window.localStorage.setItem("archivoID", $scope.archivoID);
              $window.localStorage.setItem("documentoID", $scope.documentoID);
              $window.localStorage.setItem("embarcacionID", seleccionado);
              $window.location.href = "#!/embarcacion";
          }
      };
      $scope.revisarSiEmbarcacionExiste = function ($value) {
          var existe = false;
          var mensaje = "";
          $scope.embarcaciones.forEach( function(embarcacion) {
              if ($value == embarcacion.nombres) {
                  existe = true;
                  mensaje = "Este nombres ya existe";
                  return;
              }
          });
          $scope.embarcacionesAEliminar.forEach( function(embarcacionEliminada){
              if ($value == embarcacionEliminada.nombres) {
                  existe = true;
                  mensaje = "Este nombres ya existía, fue eliminado pero los cambios no han sido guardados.";
                  return;
              }
          });
          $scope.embarcacionesAgregarReferencia.forEach( function(embarcacionRefNueva) {
              if ($value == embarcacionRefNueva.nombres) {
                  existe = true;
                  mensaje = "Ref ya agregada";
                  return;
              }
          });
          $scope.embarcacionesNuevas.forEach( function(embarcacionNueva) {
              if ($value == embarcacionNueva.nombres) {
                  existe = true;
                  mensaje = "Embarcación ya agregado";
                  return;
              }
          });
          if (existe) {
              return mensaje;
          }
      }
      
      
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
          //Revisamos datos principales editados
          if ($scope.datosPrincipales.editado) {
              $scope.registrarAccion("Actualizando BD Documentos");
              var request = 'http://monsalvediaz.com:5000/PIMC0.1/Modificar/Documentos?idUnico=archivoID&idUnico2=documentoID&archivoID=' + $scope.archivoID + 
                  '&documentoID=' + $scope.documentoID;
              var agregado = false;
              if ($scope.datosPrincipales.tipoDocumento != "" && $scope.datosPrincipales.tipoDocumento != null) {
                  request = request + '&tipoDocumento="' + $scope.datosPrincipales.tipoDocumento;
                  agregado = true;
              }
              if ($scope.datosPrincipales.estadoConservacion != "" && $scope.datosPrincipales.estadoConservacion != null) {
                  request = request + '"&estadoConservacion="' + $scope.datosPrincipales.estadoConservacion;
                  agregado = true;
              }
              if ($scope.datosPrincipales.formatoDisponible!= "" && $scope.datosPrincipales.formatoDisponible != null) {
                  request = request + '"&formatoDisponible="' + $scope.datosPrincipales.formatoDisponible;
                  agregado = true;
              }
              if ($scope.datosPrincipales.fechaMinima != "" && $scope.datosPrincipales.fechaMinima != null) {
                  request = request + '"&fechaMinima="' + $scope.datosPrincipales.fechaMinima;
                  agregado = true;
              }
              if ($scope.datosPrincipales.fechaMinFormato != "" && $scope.datosPrincipales.fechaMinFormato != null) {
                  request = request + '"&fechaMinFormato="' + $scope.datosPrincipales.fechaMinFormato;
                  agregado = true;
              }
              if ($scope.datosPrincipales.fechaMaxima != "" && $scope.datosPrincipales.fechaMaxima != null) {
                  request = request + '"&fechaMaxima="' + $scope.datosPrincipales.fechaMaxima;
                  agregado = true;
              }
              if ($scope.datosPrincipales.fechaMaxFormato != "" && $scope.datosPrincipales.fechaMaxFormato != null) {
                  request = request + '"&fechaMaxFormato="' + $scope.datosPrincipales.fechaMaxFormato;
                  agregado = true;
              }
              if ($scope.datosPrincipales.sinopsis != "" && $scope.datosPrincipales.sinopsis != null) {
                  request = request + '"&sinopsis="' + $scope.datosPrincipales.sinopsis;
                  agregado = true;
              }
              if ($scope.datosPrincipales.listaTemas.length != 0) {
                  request = request + '"&listaTemas="' + $scope.datosPrincipales.listaTemas.join(', ');
                  agregado = true;
              }
              if (agregado) {
                  request = request + '"';
                  $http.get(request).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              }
          }
          // Anotaciones
          if ($scope.notasCambios) {
              $scope.registrarAccion("Actualizando BD notasArchivo");
              $scope.notasCambios = false;
              $scope.notas.forEach(function(nota) {
                  // Insertamos notas nuevas
                  if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosNotas?documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  // Modificamos notas viejas
                  if (nota.modificada == true) {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/DocumentosNotas?idUnico2=documentoID&idUnico=notaID&notaID=' + nota.notaID + ' &documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  }
              });
              // Eliminamos notas eliminadas
              $scope.notasAEliminar.forEach(function(nota) {
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosNotas?idUnico2=documentoID&idUnico=notaID&notaID=' + nota.notaID + ' &documentoID=' + $scope.documentoID).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              });

          }
          
          // Emisor Receptor
          if ($scope.emisorReceptorEditado) {
              $scope.emisorReceptor.forEach( function (entrada) {
                  // Agregar a la base de datos
//                  if (entrada.emisorReceptorID == -1) {
//                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
//                          $scope.datosGuardados = true;
//                          console.log(data);
//                      });
//                  }
              });
          }
          
          // EMBARCACIONES
          if ($scope.embarcacionesCambios)  {
              // agregar referencias a embarcaciones existentes
              $scope.embarcacionesAgregarReferencia.forEach( function (embarcacion) {
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefEmbarcacion',{
                      params: {
                          documentoID: $scope.documentoID,
                          embarcacionID: embarcacion.embarcacionID,
                          comentario: '"'+embarcacion.comentario+'"'
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
              });
              // Eliminamos referencias existentes
              $scope.embarcacionesAEliminar.forEach (function (embarcacionRefABorrar) {
                  $scope.registrarAccion("Referencia a embarcacion existente eliminada");
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosRefEmbarcacion',{
                      params: {
                          idUnico: 'referenciaID',
                          referenciaID: embarcacionRefABorrar.referenciaID
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
              });
              // Creamos embarcaciones nuevas y agregamos referencia
              $scope.embarcacionesNuevas.forEach( function (embarcacion) {
                  // revisar si el personaje nombre esta vacio
                  if (embarcacion.nombres !== "") {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Embarcaciones',{
                          params: {
                                nombres: '"'+embarcacion.nombres+'"',
                                alias: '"'+embarcacion.alias+'"',
                                tipo: '"'+embarcacion.tipo+'"',
                                usos: '"'+embarcacion.usos+'"',
                                categoria: '"'+embarcacion.categoria+'"',
                          }
                      }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                          // Data contains the last insert id
                          if (!String(data.data).startsWith("[WARNING]")) {
                              // Agregamos las banderas
                              var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefEmbarcacion',{
                              params: {
                                  documentoID: $scope.documentoID,
                                  embarcacionID: lastInsertID,
                                  comentario: "'" + embarcacion.comentario + "'"
                              }
                              }).then(function(data) {
                                  $scope.datosGuardados = true;
                                  console.log(data);
                              });
                              var listaBanderas = embarcacion.banderas.split(",");
                              listaBanderas = listaBanderas.map(function(e) {
                                  return e.trim();
                              });
                              listaBanderas.forEach(function (banderaAgregar) {
                                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/EmbarcacionesBanderas',{
                                  params: {
                                      embarcacionID: lastInsertID,
                                      bandera: "'" + banderaAgregar + "'"
                                  }
                                  }).then(function(data) {
                                      $scope.datosGuardados = true;
                                      console.log(data);
                                  });
                              });
                          }
                      });
                  }
              });
          }
              
          // PERSONAJES
          if ($scope.personajesCambios) 
          {
              // agregar referencias a personajes existentes
              $scope.personajesAgregarReferencia.forEach( function (personaje) {
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefPersonajes',{
                      params: {
                          documentoID: $scope.documentoID,
                          personajeID: personaje.personajeID
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
              });
              // Eliminamos referencias existentes
              $scope.personajesAEliminar.forEach (function (personajeRefABorrar) {
                  $scope.registrarAccion("Referencia existente eliminada");
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosRefPersonajes',{
                      params: {
                          idUnico: 'referenciaID',
                          referenciaID: personajeRefABorrar.referenciaID
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
              });
              // Creamos personajes nuevos y agregamos referencia
              $scope.personajesNuevos.forEach( function (personaje) {
                  // revisar si el personaje nombre esta vacio
                  if (personaje.nombre !== "") {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Personajes',{
                          params: {
                              nombre: '"'+personaje.nombre+'"',
                              ocupacion: '"'+personaje.ocupacion+'"',
                              nacionalidad: '"'+personaje.nacionalidad+'"',
                              sexo: '"'+personaje.sexo+'"',
                              categoria: '"'+personaje.categoria+'"'
                          }
                      }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                          // Data contains the last insert id
                          if (!String(data.data).startsWith("[WARNING]")) {
                              var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefPersonajes',{
                              params: {
                                  documentoID: $scope.documentoID,
                                  personajeID: lastInsertID
                              }
                              }).then(function(data) {
                                  $scope.datosGuardados = true;
                                  console.log(data);
                              })
                          }
                      });
                  }
              });
          }
          $timeout(function () {init();},200);
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
    
    
    
  ////////////////////////////////////////////////////////////////////////////////////
  // PERSONAJE PERFIL MODULE
  ////////////////////////////////////////////////////////////////////////////////////
    
  var personajePerfil = angular.module('personajePerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
  personajePerfil.controller('personajePerfilController', ['$scope', '$sce', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
    $scope.archivoID = -1;
    $scope.documentoID = -1;
    $scope.personajeID = -1;
    
    var init = function() {
          $scope.archivoID = $window.localStorage.getItem("archivoID");
          $scope.documentoID = $window.localStorage.getItem("documentoID");
          $scope.personajeID = $window.localStorage.getItem("personajeID");
          if (!$scope.datosGuardados) {
              $scope.registrarAccion("Personaje <strong>" + $scope.personajeID + "</strong> ha sido cargado");
          } else {
              $scope.registrarAccion("Personaje <strong>" + $scope.personajeID  + "</strong> ha sido guardado en la base de datos");
              $scope.datosGuardados = false;
          }

          // Cargamoss los datos principales
          $scope.cargarDatosPrincipales();
          // Cargamos las anotaciones
          $scope.cargarNotas();
          // Cargamos parentescos 
          $scope.cargarParentescos();
        
      };
      
      //Datos principales
      $scope.datosPrincipales = {};

      //Bandera para saber cuando guardar o no
      $scope.datosPrincipalesEditado = false;
      $scope.datosPrincipalesCargando = true;

      $scope.cargarDatosPrincipales = function() {
          $scope.datosPrincipalesCargando = true;
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes',
              {params: {personajeID: $scope.personajeID}}
          ).then(function(data) {
              //Obtener los datos JSON
              var personajeDatos = data.data[0];
              
              //Log
              console.log(personajeDatos);
              try {
                    $scope.datosPrincipales = personajeDatos;
                  
                    // Editamos fecha de nacimiento y fallecimiento al formato adecuado
                    $scope.datosPrincipales.fechaNacimiento = personajeDatos.fechaNacimiento != null ? $filter('date')(new Date(personajeDatos.fechaNacimiento), String(personajeDatos.fechaNacimientoFormato).toLowerCase()) : "";
                    $scope.datosPrincipales.fechaFallecimiento = personajeDatos.fechaFallecimiento != null ? $filter('date')(new Date(personajeDatos.fechaFallecimiento), String(personajeDatos.fechaFallecimientoFormato).toLowerCase()) : "";
                  
                    // Lista de enfermedades
                    if ($scope.datosPrincipales.enfermedades != null && $scope.datosPrincipales.enfermedades != "") {
                        $scope.datosPrincipales.enfermedades = personajeDatos.enfermedades.split(",");
                        $scope.datosPrincipales.enfermedades = $scope.datosPrincipales.enfermedades.map(function(e) {
                            return e.trim();
                        });
                    } else {
                        $scope.datosPrincipales.enfermedades = [];
                    }
              }
              catch(err) {
                  console.log("Problema cargando los valores de datos principales del personaje " + err.message);
              }
              
              //Limpiamos la bandera de editado
              $scope.datosPrincipalesEditado = false;
              
              // Funcion para datos editados
              $scope.editarDatoPrincipal = function(campo, valorNuevo) {
                  if (valorNuevo != $scope.datosPrincipales[campo]) {
                      $scope.registrarAccion(campo + "modificado");
                      $scope.datosPrincipalesEditado = true;
                  }
              };

              //Para Lista de enfermedades claves
              $scope.listaEnfermedades.enfermedadNueva = {
                  mensaje: "+ Agregar"
              };
              $scope.datosPrincipalesCargando = false;
          });
      };
      
      // ENFERMEDADES
      $scope.listaEnfermedades = {}
      // Para borrar Enfermedades
      $scope.listaEnfermedades.modificarBorrarEnfermedad = function(indexEditada, enfermedad) {
          if (enfermedad == "") {
              var enfermedadEliminada = $scope.datosPrincipales.enfermedades[indexEditada];
              if (enfermedadEliminada != "") {
                  $scope.registrarAccion("Enfermedad <strong>" + enfermedadEliminada + "</strong> eliminada");
                  $scope.datosPrincipalesEditado = true;
              }
              $scope.datosPrincipales.enfermedades.splice(indexEditada, 1);
          } else {
              var enfermedadModificada = $scope.datosPrincipales.enfermedades[indexEditada];
              if (enfermedad != enfermedadModificada) {
                  $scope.registrarAccion("Enfermedad <strong>" + enfermedadModificada + "</strong> Modificada a <strong>" + enfermedad + "</strong>");
                  $scope.datosPrincipales.enfermedades[indexEditada] = enfermedad;
                  $scope.datosPrincipalesEditado = true;
              }
          }
      }
      //Para agregar enfermedades
      $scope.listaEnfermedades.enfermedadNueva = {
          mensaje: '+ Agregar'
      };
      $scope.listaEnfermedades.borrarCampo = function() {
          $scope.listaEnfermedades.enfermedadNueva.mensaje = "";
      }
      $scope.listaEnfermedades.mostrarCampo = function() {
          $scope.listaEnfermedades.enfermedadNueva.mensaje = "+ Agregar";
      }
      $scope.listaEnfermedades.agregarEnfermedadNueva = function(enfermedad) {
          if (!$scope.datosPrincipales.enfermedades.includes(enfermedad) && enfermedad.length != 0) {
              $scope.datosPrincipales.enfermedades.push(enfermedad);
              $scope.registrarAccion("Enfermedad <strong>" + enfermedad + "</strong> agregada");
              $scope.datosPrincipalesEditado = true;
          }
          $scope.listaEnfermedades.enfermedadNueva.mensaje = "+ Agregar";
      }
      
      // PARENTESCOS 
      $scope.parentescos = [];
      $scope.parentescosNuevos = [];
      $scope.parentescosAEliminar = [];
      $scope.parentescosAgregarReferencia = [];
      $scope.parentescosCambios = false;
      $scope.cargarParentescos = function () {
          $scope.parentescosCambios = false;
          $scope.parentescos = [];
          $scope.parentescosNuevos = [];
          $scope.parentescosAEliminar = [];
          $scope.parentescosAgregarReferencia = [];
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/PersonajesParentescos',
                    {params:{
                        egoID:$scope.personajeID
                    }}
          ).then(function(data) {
              // revisar si existe alguno
              if (!String(data.data).startsWith("[WARNING]")) {
                  var parentescosReferencias = data.data;
                  parentescosReferencias.forEach(function(referencia) {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes',
                                  {params: {
                                      personajeID:referencia.parienteID 
                                  }}
                        ).then(function(data) {
                            var personaje = data.data[0];
                            var pariente = {
                                parentescoID: referencia.parentescoID,
                                parienteID: referencia.parienteID,
                                nombrePersonaje: personaje.nombre,
                                relacionDirecta: referencia.parentesco
                            } 
                            $scope.parentescos.push(pariente);
                        });
                  });
                  // LOG
                  console.log($scope.parentescos);
              }
          });
      }
      $scope.agregarParentesco = function () {
          var parienteNuevo = {
              parentescoID: -1,
              parienteID: -1,
              nombrePersonaje: "",
              relacionDirecta: "",
              relacionInversa: ""
          };
          $scope.parentescosNuevos.push(parienteNuevo);
          $scope.parentescosCambios = true;
          $scope.registrarAccion("Parentesco vacío agregado")
      };
      $scope.borrarParentescoNuevo = function (indice) {
          $scope.parentescosNuevos.splice(indice,1);
          $scope.registrarAccion("Parentesco nuevo borrado");
      };
      $scope.borrarParentescoExistente = function(indice) {
          $scope.registrarAccion("Parentesco " + $scope.parentescos[indice].nombrePersonaje + " seleccionado para eliminar")
          $scope.parentescosAEliminar.push($scope.parentescos[indice]);
          $scope.parentescos.splice(indice,1);
          $scope.parentescosCambios = true;
      }
      $scope.borrarReferenciaNuevoParentesco = function (indice) {
          $scope.registrarAccion("Nueva parentesco a personaje" + $scope.parentescosAgregarReferencia[indice].nombrePersonaje + " borrada");
          $scope.parentescosAgregarReferencia.splice(indice,1);
      };
      $scope.autocompletarPersonaje = function (hintNombre) {
          return $http.get('http://monsalvediaz.com:5000/PIMC0.1/Autocompletar/Personajes?nombre=' + hintNombre).then(function(data) {
              var listaNombres = [];
              var resultados = data.data;
              var matchPerfecto = false;
              if (resultados != "0") {
                  resultados.forEach( function (valor) {
                      if(valor.nombre != $scope.datosPrincipales.nombre) {
                          listaNombres.push({nombre: valor.nombre, personajeID: valor.personajeID});
                          // Revisamos si son identicos
                          // TODO cambiar acentos 
                          if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombre).toLowerCase().replace(/\s/g, ''))
                              matchPerfecto = true;
                      }
                  })
              }
              if (!matchPerfecto && listaNombres.length != 0)
                    listaNombres.unshift({nombre:hintNombre,personajeID:-1})
              return listaNombres;
          });
      };
      $scope.actualizarParentescoNuevoExistente = function (indice, personajeBD) {
          var alreadyExist = false;
          // Revisamos si ya existe
          $scope.parentescos.forEach(function (elemento) {
              if (personajeBD.personajeID == elemento.parienteID) {
                  alreadyExist = true;
                  return;
              }
          });
          // Revisamos si la referencia fue eliminada anteriormente
          $scope.parentescosAEliminar.forEach(function (elemento) {
              if (personajeBD.personajeID == elemento.parienteID) {
                  alreadyExist = true;
                  return;
              }
          });
          $scope.parentescosAgregarReferencia.forEach(function (elemento) {
              if (personajeBD.personajeID == elemento.parienteID) {
                  alreadyExist = true;
                  return;
              }
          });
          if (!alreadyExist && personajeBD.personajeID !== -1) {
              var nuevaReferencia = {
                  parienteID: personajeBD.personajeID,
                  nombrePersonaje: personajeBD.nombre,
                  relacionDirecta: "",
                  relacionInversa: ""
              }
              $scope.parentescosNuevos.splice(indice,1);
              $scope.parentescosAgregarReferencia.push(nuevaReferencia);
           }

      };
      $scope.abrirPersonajeSeleccionado = function(index, ubicacion) {
          var seleccionado = -1;
          if (ubicacion == "nuevaRef") {
              seleccionado = $scope.parentescosAgregarReferencia[index].parienteID;
          } else if (ubicacion == "existente") {
              seleccionado = $scope.parentescos[index].parienteID;
          }
          if (seleccionado != -1) {
              console.log("Abriendo documento" + seleccionado);
              //TODO Enviar varios seleccionados
              $window.localStorage.setItem("archivoID", $scope.archivoID);
              $window.localStorage.setItem("documentoID", $scope.documentoID);
              $window.localStorage.setItem("personajeID", seleccionado);
              $window.location.reload();
          }
      };
      $scope.revisarSiParentescoExiste = function ($value) {
          var existe = false;
          var mensaje = "";
          $scope.parentescos.forEach( function(pariente) {
              if ($value == pariente.nombrePersonaje) {
                  existe = true;
                  mensaje = "Este nombre ya existe";
                  return;
              }
          });
          $scope.parentescosAEliminar.forEach( function(parienteEliminado){
              if ($value == parienteEliminado.nombrePersonaje) {
                  existe = true;
                  mensaje = "Este nombre ya existía, fue eliminado pero los cambios no han sido guardados.";
                  return;
              }
          });
          $scope.parentescosAgregarReferencia.forEach (function(parienteRefAgregada){
              if ($value == parienteRefAgregada.nombrePersonaje) {
                  existe = true;
                  mensaje = "Ref ya agregada";
                  return;
              }
          });
          $scope.parentescosNuevos.forEach (function(parienteNuevo){
              if ($value == parienteNuevo.nombrePersonaje) {
                  existe = true;
                  mensaje = "Pariente ya agregado";
                  return;
              }
          });
          if (existe) {
              return mensaje;
          }
      }
      
      
      
      // Anotaciones
      $scope.notas = "";
      $scope.notasAEliminar = [];
      $scope.notasCambio = false;
      $scope.cargarNotas = function() {
          $scope.notas = "";
          $scope.notasAEliminar = [];
          $scope.notasCambio = false;
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/PersonajesNotas', 
          {
            params:{
                personajeID:$scope.personajeID
            }
          }).then(function(data) {
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
      $scope.modificarFechaHistorica = function(indexNota, nuevaFechaHistorica) {
          $scope.registrarAccion("Fecha Historica de nota <strong>" + indexNota + "</strong> modificada");
          $scope.notas[indexNota].fechaHistorica = nuevaFechaHistorica;
          if ($scope.notas[indexNota].fechaCreacion != "") {
              $scope.notas[indexNota].modificada = true;
          }
          $scope.notasCambios = true;
      };
      
      
      // Funcionalidad para hoja de servicio
      $scope.tabs = new Map();
      $scope.tabsArray = [];
      $scope.abrirElemento = function(ElementoId) {
        if (!$scope.tabs.has(ElementoId)) {
          $scope.tabs.set(ElementoId, {
            title: 'Comision seleccionada ' + ($scope.tabs.size + 1),
            tabIndex: ($scope.tabs.size + 1),
            content: 'Esta es la comisión ' + ElementoId,
            active: true
          });
        }
        $scope.tabsArray = Array.from($scope.tabs);
      };
      $scope.cerrarElemento = function(ElementoId) {
        if ($scope.tabs.has(ElementoId)) {
          $scope.tabs.delete(ElementoId);
        }
        $scope.tabsArray = Array.from($scope.tabs);
      }
      
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
          //Revisamos datos principales editados
          if ($scope.datosPrincipalesEditado) {
              $scope.registrarAccion("Actualizando BD Personajes");
              var request = 'http://monsalvediaz.com:5000/PIMC0.1/Modificar/Personajes'
              var parametros = {
                  idUnico:'personajeID',
                  personajeID:$scope.personajeID
              }
              
              var agregado = false;
              for (var key in $scope.datosPrincipales) {
                  var value = $scope.datosPrincipales[key];
                  if (key == 'enfermedades' && value.length != 0) {
                      parametros[key] = value.join(", ");
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
                  $http.get(request,{params:parametros}).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              }
          }
          // Anotaciones
          if ($scope.notasCambios) {
              $scope.registrarAccion("Actualizando BD notasArchivo");
              $scope.notasCambios = false;
              $scope.notas.forEach(function(nota) {
                  // Insertamos notas nuevas
                  if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/PersonajesNotas',
                                {params:{
                                    personajeID: $scope.personajeID,
                                    nota: "'" + nota.nota + "'",
                                    referencia:"'" + nota.referencia + "'"
                                }}
                      ).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  // Modificamos notas viejas
                  if (nota.modificada == true) {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/PersonajesNotas',
                                {params:{
                                    idUnico2:'personajeID',
                                    idUnico:'notaID',
                                    notaID:nota.notaID,
                                    personajeID:$scope.personajeID,
                                    nota:"'" + nota.nota + "'",
                                    referencia:"'" + nota.referencia + "'"
                                }}
                      ).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                      });
                  }
              });
              // Eliminamos notas eliminadas
              $scope.notasAEliminar.forEach(function(nota) {
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/PersonajesNotas',
                            {params:{
                            idUnico2:'personajeID',
                            idUnico:'notaID',
                            notaID:nota.notaID,
                            personajeID:$scope.personajeID
                            }}
                  ).then(function(data) {
                      $scope.datosGuardados = true;
                      console.log(data);
                  });
              });

          }
          
          // PARENTESCOS
          if ($scope.parentescosCambios) 
          {
              // agregar referencias a personajes existentes
              $scope.parentescosAgregarReferencia.forEach( function (parentesco) {
                  // Guardamos la relacion directa
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/PersonajesParentescos',{
                      params: {
                          egoID: $scope.personajeID,
                          parienteID: parentesco.parienteID,
                          parentesco: "'" + parentesco.relacionDirecta + "'"
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
                  // Guardamos la relacion Inversa
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/PersonajesParentescos',{
                      params: {
                          egoID: parentesco.parienteID,
                          parienteID: $scope.personajeID,
                          parentesco: "'" + parentesco.relacionInversa + "'"
                      }
                  }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                  });
              });
              // Eliminamos referencias existentes
              $scope.parentescosAEliminar.forEach (function (personajeRefABorrar) {
                  var relacionInversaID = -1;
                  $scope.registrarAccion("Referencia existente eliminada");
                  // Buscamos la relacion inversa
                  $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/PersonajesParentescos',  {
                      params: {
                          egoID: personajeRefABorrar.parienteID,
                          parienteID: $scope.personajeID
                      }
                  }).then(function(data) {
                          console.log("relacion Inversa" + data);
                          relacionInversaID = data.data[0].parentescoID;
                          // Eliminamos relacion directa
                          $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/PersonajesParentescos',{
                              params: {
                                  idUnico: 'parentescoID',
                                  parentescoID: personajeRefABorrar.parentescoID
                              }
                          }).then(function(data) {
                                  $scope.datosGuardados = true;
                                  console.log(data);
                          });
                          // Eliminamos relacion inversa
                          if (relacionInversaID != -1) {
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/PersonajesParentescos',{
                                  params: {
                                      idUnico: 'parentescoID',
                                      parentescoID: relacionInversaID
                                  }
                              }).then(function(data) {
                                      $scope.datosGuardados = true;
                                      console.log(data);
                              });
                          }
                  });
                  
                  
              });
              // Creamos personajes nuevos y agregamos parentesco
              $scope.parentescosNuevos.forEach( function (pariente) {
                  // revisar si el personaje nombre esta vacio
                  if (pariente.nombrePersonaje !== "") {
                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Personajes',{
                          params: {
                              nombre: '"'+pariente.nombrePersonaje+'"'
                          }
                      }).then(function(data) {
                          $scope.datosGuardados = true;
                          console.log(data);
                          // Data contains the last insert id
                          if (!String(data.data).startsWith("[WARNING]")) {
                              var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                              // Guardamos la relacion directa
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/PersonajesParentescos',{
                                  params: {
                                      egoID: $scope.personajeID,
                                      parienteID: lastInsertID,
                                      parentesco: "'" + pariente.relacionDirecta + "'"
                                  }
                              }).then(function(data) {
                                      $scope.datosGuardados = true;
                                      console.log(data);
                              });
                              // Guardamos la relacion Inversa
                              $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/PersonajesParentescos',{
                                  params: {
                                      egoID: lastInsertID,
                                      parienteID: $scope.personajeID,
                                      parentesco: "'" + pariente.relacionInversa + "'"
                                  }
                              }).then(function(data) {
                                      $scope.datosGuardados = true;
                                      console.log(data);
                              });
                          }
                      });
                  }
              });
          }
          // Incializamos todo
          $timeout(function () {init();},200);                                      
        };
          
      
      
      // Incializamos todo
      $timeout(function () {init();},200);
    }]);


    /////////////////////////////////////////////////////////////////////
    // EMBARCACION PERFIL MODULE
    /////////////////////////////////////////////////////////////////////

    var embarcacionPerfil = angular.module('embarcacionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav']);
    embarcacionPerfil.controller('embarcacionPerfilController', ['$scope', 'uiGridConstants', function($scope, uiGridConstants) {
      // Definiciones de las pestañas de la aplicación. 
      $scope.tabs = new Map();
      $scope.tabsArray = [];

      // Estas funciones son para agregar y quitar pestañas
      $scope.abrirElemento = function(ElementoId) {
        if (!$scope.tabs.has(ElementoId)) {
          $scope.tabs.set(ElementoId, {
            title: 'ComisionSeleccionada' + ($scope.tabs.size + 1),
            tabIndex: ($scope.tabs.size + 1),
            content: 'Esta es la ruta' + ElementoId,
            active: true
          });
        }
        $scope.tabsArray = Array.from($scope.tabs);
      };
      $scope.cerrarElemento = function(ElementoId) {
        if ($scope.tabs.has(ElementoId)) {
          $scope.tabs.delete(ElementoId);
        }
        $scope.tabsArray = Array.from($scope.tabs);
      }

      // Definiciones para tablas.
      // Tabla reparaciones
      $scope.tablaReparaciones = {}
      $scope.tablaReparaciones.columnDefs = [{
        field: 'fecha',
        name: 'fecha',
        displayName: 'Fecha',
        type: 'date',
        cellFilter: 'date:"dd-MM-yyyy"'
      }, {
        field: 'lugar',
        name: 'lugar',
        displayName: 'Lugar'
      }, {
        field: 'reparacion',
        name: 'reparacion',
        displayName: 'Nota de Reparación'
      }];
      $scope.tablaReparaciones.data = [{
        "fecha": "Abril 1880",
        "lugar": "Florencia",
        "reparacion": "Reparacion de velas"
      }, {
        "fecha": "Enero 1870",
        "lugar": "Cartagena",
        "reparacion": "Cubierta"
      }, {
        "fecha": "Abril 1880",
        "lugar": "Santa Marta ",
        "reparacion": "velas"
      }]


      // Tabla datos secundarios
      $scope.filtroDropdownContenido = ['Todos', 'Velámen', 'Arboladura y otras piezas', 'Armas, municiones y artefactos de fuego']; //TODO fill this whenever the data arrives to the application
      $scope.valorFiltroCategoria = "Todos";
      $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
        if (col.filters[0].term) {
          return 'header-filtered';
        } else {
          return '';
        }
      };

      $scope.tablaDatosSecundarios = {};
      $scope.tablaDatosSecundarios.onRegisterApi = function(gridApi) {
        $scope.DatosSecundariosGridApi = gridApi;
        $scope.DatosSecundariosGridApi.grid.registerRowsProcessor($scope.filtroCategorias, 200);
      };
      $scope.tablaDatosSecundarios.columnDefs = [{
        field: 'categoria',
        name: 'categoria',
        displayName: 'Categoria'
      }, {
        field: 'elemento',
        name: 'elemento',
        displayName: 'Elemento'
      }, {
        field: 'cantidad',
        name: 'cantidad',
        displayName: 'Cantidad',
        type: 'number'
      }, {
        field: 'unidades',
        name: 'unidades',
        displayName: 'Unidades'
      }, {
        field: 'fechaAdicion',
        name: 'fechaAdicion',
        displayName: 'Fecha Adicion',
        type: 'date',
        cellFilter: 'date:"dd-MM-yyyy"'
      }, {
        field: 'fechaRemocion',
        name: 'fechaRemocion',
        displayName: 'Fecha Remocion',
        type: 'date',
        cellFilter: 'date:"dd-MM-yyyy"'
      }];
      $scope.tablaDatosSecundarios.data = [{
        "categoria": "Armas, municiones y artefactos de fuego",
        "elemento": "Cañón",
        "cantidad": "3",
        "unidades": "Cañones",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }, {
        "categoria": "Velámen",
        "elemento": "Palo de mesana",
        "cantidad": "3",
        "unidades": "Palos",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }, {
        "categoria": "Arboladura y otras piezas",
        "elemento": "Cañón",
        "cantidad": "3",
        "unidades": "Cañones",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }, {
        "categoria": "Armas, municiones y artefactos de fuego",
        "elemento": "Cañón",
        "cantidad": "3",
        "unidades": "Cañones",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }, {
        "categoria": "Velámen",
        "elemento": "Palo de mesana",
        "cantidad": "3",
        "unidades": "Palos",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }, {
        "categoria": "Arboladura y otras piezas",
        "elemento": "Cañón",
        "cantidad": "3",
        "unidades": "Cañones",
        "fechaAdicion": "02-04-1990",
        "fechaRemocion": "04-02-1990"
      }];

      $scope.filtrar = function(valorSeleccionado) {
        $scope.valorFiltroCategoria = valorSeleccionado;
        $scope.DatosSecundariosGridApi.grid.refresh();
      };
      $scope.filtroCategorias = function(renderableRows) {
        if ($scope.valorFiltroCategoria == "Todos") {
          renderableRows.forEach(function(row) {
            row.visible = true;
          });
          return renderableRows;
        }
        var matcher = new RegExp($scope.valorFiltroCategoria);
        renderableRows.forEach(function(row) {
          if (!row.entity['categoria'].match(matcher)) {
            row.visible = false;
          }
        });
        return renderableRows;
      };
      

      // Tabla hoja de servicio y personal
      $scope.tablaHojaServicioPersonal = {};
      $scope.tablaHojaServicioPersonal.columnDefs = [{
        field: 'id',
        name: "id",
        display: "id",
        hidden: true
      }, {
        field: 'lugarPartida',
        name: 'Lugar de Partida',
        displayName: 'Lugar de Partida'
      }, {
        field: 'fechaPartida',
        name: 'Fecha de Partida',
        displayName: 'Fecha de Partida',
        type: 'date',
        cellFilter: 'date:"dd-MM-yyyy"'
      }, {
        field: 'lugarLlegada',
        name: 'Lugar de Llegada',
        displayName: 'Lugar de Llegada'
      }, {
        field: 'fechaLlegada',
        name: 'Fecha de Llegada',
        displayName: 'Fecha de Llegada',
        type: 'date',
        cellFilter: 'date:"dd-MM-yyyy"'
      }];
      $scope.tablaHojaServicioPersonal.enableRowSelection = true;
      $scope.tablaHojaServicioPersonal.multiSelect = false;
      $scope.tablaHojaServicioPersonal.noUnselect = true;
      $scope.tablaHojaServicioPersonal.enableRowHeaderSelection = false;
      $scope.tablaHojaServicioPersonal.onRegisterApi = function(gridApi) {
        $scope.hojaServicioGridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          var id = row.entity["id"];
          $scope.abrirElemento(id);
        });
      }


      //TODO DELETE THIS
      $scope.tablaHojaServicioPersonal.data = [{
        "id": "0",
        "lugarPartida": "cartagena",
        "fechaPartida": "02-04-1990",
        "lugarLlegada": "españa",
        "fechaLlegada": "02-04-2000"
      }, {
        "id": "1",
        "lugarPartida": "cartagena",
        "fechaPartida": "02-04-1990",
        "lugarLlegada": "españa",
        "fechaLlegada": "02-04-2000"
      }, {
        "id": "2",
        "lugarPartida": "cartagena",
        "fechaPartida": "02-04-1990",
        "lugarLlegada": "españa",
        "fechaLlegada": "02-04-2000"
      }, {
        "id": "3",
        "lugarPartida": "cartagena",
        "fechaPartida": "02-04-1990",
        "lugarLlegada": "españa",
        "fechaLlegada": "02-04-2000"
      }];

    }]);


    /////////////////////////////////////////////////////////////////
    // ARCHIVOS BUSQUEDA MODULE
    /////////////////////////////////////////////////////////////////

    var archivosBusqueda = angular.module('archivosBusqueda',  ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav']);
    archivosBusqueda.controller('archivosBusquedaController', ['$scope', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function ($scope, $http, $window, $location, $filter, i18nService, uiGridConstants) {

      // Entreda de busquedas y botones
      $scope.valorBusqueda = "";
      $scope.realizarBusqueda = function () {
        $scope.tablaResultadosGridApi.grid.refresh();
      };

      //Tabla de resultados
      $scope.tablaResultados = {
        enableRowSelection: true,
        enableSelectAll: true,
        multiSelect: false
      };
      $scope.tablaResultados.columnDefs = [
        {field: 'institucionFondo', name: 'institucionFondo', displayName: 'Institución Fondo' },
        {field: 'fondo', name: 'fondo', displayName: 'Fondo' },
        {field: 'titulo', name: 'titulo', displayName: 'Titulo'},
        {field: 'fechaInicial', name: 'fechaInicial', displayName: 'Fecha Inicial'},
        {field: 'fechaFinal', name: 'fechaFinal', displayName: 'Fecha Final' }
      ];
      $scope.tablaResultados.onRegisterApi = function (gridApi) {
        $scope.tablaResultadosGridApi = gridApi;
        // Para filtrar los resultados
        $scope.tablaResultadosGridApi.grid.registerRowsProcessor($scope.filtrarBusquedas, 200);
      };

      $http.get('http://monsalvediaz.com:5000/PIMC0.1/ConsultaArchivo').then(function (data) {
        data.data.forEach(function changeDates(row, index) {
          if (row.fechaInicial !== null) {
            row.fechaInicial = $filter('date')(new Date(row.fechaInicial), String(row.fechaInicialFormato).toLowerCase());
            row.fechaFinal = $filter('date')(new Date(row.fechaFinal), String(row.fechaInicialFormato).toLowerCase());
          }
        });
        $scope.tablaResultados.data = data.data;
        console.log(data);
      });

      //Funcion que se registra en el API
      $scope.filtrarBusquedas = function (renderableRows) {
        if ($scope.valorBusqueda === "") {
          renderableRows.forEach(function (row) {
            row.visible = true;
          });
          return renderableRows;
        }
        var matcher = new RegExp($scope.valorBusqueda.toLowerCase());
        renderableRows.forEach(function (row) {
          try {
            row.visible = false;
            if (row.entity['titulo'].toLowerCase().match(matcher)) {
              row.visible = true;
            }
            if (String(row.entity['fechaInicial']).toLowerCase().match(matcher)) {
              row.visible = true;
            }
            if (String(row.entity['fechaFinal']).toLowerCase().match(matcher)) {
              row.visible = true;
            }
          } catch (error) {
            console.log(error);
          }
        });
        return renderableRows;
      };
      
      // Para redirección a la página de perfil de archivo
      $scope.abrirArchivosSeleccionados = function () {
        var seleccionados = $scope.tablaResultadosGridApi.selection.getSelectedRows();
        console.log(seleccionados);
        //TODO Enviar varios seleccionados
        $window.localStorage.setItem("archivoID", seleccionados[0].archivoID);
        $window.location.href = "#!/archivo";
      };

    }]);

          
// TOMADO DE
// https://alistapart.com/article/accent-folding-for-auto-complete
var accentMap = {
  'á':'a', 'é':'e', 'í':'i','ó':'o','ú':'u'
};function accent_fold (s) {
  if (!s) { return ''; }
  var ret = '';
  for (var i = 0; i < s.length; i++) {
    ret += accent_map[s.charAt(i)] || s.charAt(i);
  }
  return ret;
}; 

})(window.angular);
