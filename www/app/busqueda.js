/////////////////////////////////////////////////////////////////
// DOCUMENTOS BUSQUEDA MODULE
/////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var documentosBusqueda = angular.module("documentosBusqueda", [
      "ngAnimate",
      "ngSanitize",
      "ui.bootstrap",
      "ui.grid",
      "ngTouch",
      "ui.grid.edit",
      "ui.grid.autoResize",
      "ui.grid.resizeColumns",
      "ui.grid.selection",
      "ui.grid.cellNav"
    ]);
    documentosBusqueda.controller('documentosBusquedaController', 
        ['pimcService', 
        'pimcMenuService', 
        '$scope', 
        '$http', 
        '$filter', 
        'uiGridConstants',
        'i18nService', 
        function(pimcService, pimcMenuService, $scope, $http,
             $filter, uiGridConstants, i18nService) {

        // Entreda de busquedas y botones
        $scope.valorBusqueda = "";
        $scope.realizarBusqueda = function () {
            $scope.tablaResultadosGridApi.grid.refresh();
        };

        // Cargando los datos
        $scope.cargandoDatos = true;

        // Numero de filas 
        $scope.numeroFilasVisibles = 0;
        $scope.numeroFilasTotales = 0;

        //Tabla de resultados
        $scope.tablaResultados = {
            enableRowSelection: true,
            enableSelectAll: true,
            multiSelect: true,
            enableFiltering: true,
            enableColumnResizing: true,  
            data: {}
        };
        $scope.tablaResultados.columnDefs = [
            {field: 'institucionFondo', name: 'institucionFondo', displayName: 'Institución' },
            {field: 'numRefDentroFondo', name: 'numRefDentroFondo', displayName: 'Referencia' },
            {field: 'fondo', name: 'fondo', displayName: 'Fondo' },
            {field: 'seccion', name: 'seccion', displayName: 'Sección' },
            {field: 'titulo', name: 'titulo', displayName: 'Titulo', minWidth: 350},
            {field: 'legajo', name: 'legajo', displayName: 'Legajo', maxWidth: 75 },
            {field: 'folioInicial', name: 'folioInicial', displayName: 'Folio inicial' , maxWidth: 75 },
            {field: 'folioFinal', name: 'folioFinal', displayName: 'Folio final' , maxWidth: 75  },
            {field: 'fechaInicial', name: 'fechaInicial', displayName: 'Fecha'}
        ];
        $scope.tablaResultados.onRegisterApi = function (gridApi) {
            $scope.tablaResultadosGridApi = gridApi;
            $scope.tablaResultadosGridApi.core.on.rowsRendered( $scope, function (){
                $scope.numeroFilasVisibles = $scope.tablaResultadosGridApi.core.getVisibleRows().length;
            });
        };
        
        $scope.init = function() {
            var consultaTodosDocumentos = pimcService.crearURLOperacion('ConsultarTodos', 'Documentos');
            // Cargamos los Documentos
            return $http.get(consultaTodosDocumentos).then(function (data) {
                $scope.numeroFilasTotales = data.data.length;
                data.data.forEach(function changeDates(row, index) {
                    if (row.fechaInicial !== null) {
                        row.fechaInicial = (row.fechaInicial && row.fechaInicial.length != 0) ? $filter('date')(new Date(row.fechaInicial), String(row.fechaInicialFormato).toLowerCase(), 'UTC') : null;
                        row.fechaFinal =  (row.fechaFinal && row.fechaFinal.length != 0) ? $filter('date')(new Date(row.fechaFinal), String(row.fechaFinalFormato).toLowerCase(), 'UTC') : null;
                    }
                });
                $scope.tablaResultados.data = data.data;
                pimcService.debug("Documentos Cargados", data);
                $scope.cargandoDatos = false;
            });
        };

        // Para redirección a la página de perfil del documento
        $scope.abrirDocumentosSeleccionados = function () {
            var seleccionados = $scope.tablaResultadosGridApi.selection.getSelectedRows();
            pimcService.debug("Documentos seleccionados = " + seleccionados);
            angular.forEach(seleccionados, function (seleccionado) {
               pimcMenuService.abrirElemento("Documentos", seleccionado.documentoID, seleccionado.titulo, true); 
            });
        };

        $scope.reportarDatosAgregados = function(datosAgregados) {
            if (datosAgregados) {
                $scope.cargandoDatos = true;
                $scope.init();
            }
        }

        $scope.init();

    }]);

})(window.angular);
