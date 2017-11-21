/////////////////////////////////////////////////////////////////
// ARCHIVOS BUSQUEDA MODULE
/////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var archivosBusqueda = angular.module("archivosBusqueda", [
      "ngAnimate",
      "ngSanitize",
      "ui.bootstrap",
      "ui.grid",
      "ngTouch",
      "ui.grid.edit",
      "ui.grid.autoResize",
      "ui.grid.selection",
      "ui.grid.cellNav"
    ]);
    archivosBusqueda.controller('archivosBusquedaController', ['pimcService', 'pimcMenuService', '$scope', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function(pimcService, pimcMenuService, $scope, $http, $window, $location, $filter, i18nService, uiGridConstants) {

        // Entreda de busquedas y botones
        $scope.valorBusqueda = "";
        $scope.realizarBusqueda = function () {
            $scope.tablaResultadosGridApi.grid.refresh();
        };

        //Tabla de resultados
        $scope.tablaResultados = {
            enableRowSelection: true,
            enableSelectAll: true,
            multiSelect: true,
            data: {}
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
        
        $scope.init = function() {
            var consultaTodosArchivos = pimcService.crearURLOperacion('ConsultarTodos', 'Archivos');
            // Cargamos los archivos
            return $http.get(consultaTodosArchivos).then(function (data) {
                data.data.forEach(function changeDates(row, index) {
                    if (row.fechaInicial !== null) {
                        row.fechaInicial = (row.fechaInicial && row.fechaInicial.length != 0) ? $filter('date')(new Date(row.fechaInicial), String(row.fechaInicialFormato).toLowerCase(), 'UTC') : null;
                        row.fechaFinal =  (row.fechaFinal && row.fechaFinal.length != 0) ? $filter('date')(new Date(row.fechaFinal), String(row.fechaFinalFormato).toLowerCase(), 'UTC') : null;
                    }
                });
                $scope.tablaResultados.data = data.data;
                pimcService.debug("Archivos Cargados", data);
            });
        };

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
            pimcService.debug("Archivos seleccionados = " + seleccionados);
            angular.forEach(seleccionados, function (seleccionado) {
               pimcMenuService.abrirElemento("Archivos", seleccionado.archivoID, seleccionado.titulo, true); 
            });
        };

        $scope.init();

    }]);

})(window.angular);
