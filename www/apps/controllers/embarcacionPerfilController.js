(function(angular) {
  'use strict';
  angular.module('embarcacionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav'])
    .controller('embarcacionPerfilController', ['$scope', 'uiGridConstants', function($scope, uiGridConstants) {
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

})(window.angular);