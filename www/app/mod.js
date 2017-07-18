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
      };

      //Datos principales
      $scope.archivoDatos = {};
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

      $scope.cargarDatosPrincipales = function() {
          $http.get('http://monsalvediaz.com:5000/PIMC0.1/ConsultaArchivo?archivoID=' + $scope.archivoID).then(function(data) {
              //Obtener los datos JSON
              $scope.archivoDatos = data.data[0];
              //Log
              console.log($scope.archivoDatos);

              //Llenamos los datos del archivo
              $scope.datosPrincipales.archivoTitulo = $scope.archivoDatos.titulo;
              $scope.datosPrincipales.archivoFondo = $scope.archivoDatos.fondo;
              $scope.datosPrincipales.institucionFondo = $scope.archivoDatos.institucionFondo;
              $scope.datosPrincipales.seccion = $scope.archivoDatos.seccion;
              $scope.datosPrincipales.numRefDentroFondo = $scope.archivoDatos.numRefDentroFondo;
              $scope.datosPrincipales.fechaInicial = $filter('date')(new Date($scope.archivoDatos.fechaInicial), String($scope.archivoDatos.fechaInicialFormato).toLowerCase());
              $scope.datosPrincipales.fechaFinal = $filter('date')(new Date($scope.archivoDatos.fechaFinal), String($scope.archivoDatos.fechaFinalFormato).toLowerCase());
              $scope.datosPrincipales.folioInicial = $scope.archivoDatos.folioInicial;
              $scope.datosPrincipales.folioFinal = $scope.archivoDatos.folioFinal;
              $scope.datosPrincipales.legajo = $scope.archivoDatos.legajo;
              $scope.datosPrincipales.numOrden = $scope.archivoDatos.numOrden;
              $scope.datosPrincipales.numPaginas = $scope.archivoDatos.numPaginas;
              $scope.datosPrincipales.palabrasClaves = $scope.archivoDatos.palabrasClaves.split(",");
              $scope.datosPrincipales.palabrasClaves = $scope.datosPrincipales.palabrasClaves.map(function(e) {
                  return e.trim();
              });
              $scope.datosPrincipales.disponibilidad = $scope.archivoDatos.disponibilidad;

              //Limpiamos la bandera de editado
              $scope.datosPrincipales.editado = false;

              //Para palabras claves
              $scope.palabrasClaves.palabraNueva = {
                  mensaje: "+ Agregar"
              };

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
  // PERSONAJE PERFIL MODULE
  ////////////////////////////////////////////////////////////////////////////////////

  var personajePerfil = angular.module('personajePerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
  personajePerfil.controller('personajePerfilController', ['$scope', function($scope) {
      $scope.realizarBusqueda = function() {
        alert("Función en construcción. Gracias por su paciencia.");
      };
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


})(window.angular);