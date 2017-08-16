/////////////////////////////////////////////////////////////////
// ARCHIVOS BUSQUEDA MODULE
/////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
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
