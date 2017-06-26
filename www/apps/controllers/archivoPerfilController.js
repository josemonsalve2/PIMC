(function (angular) {
    'use strict';
    var archivoPerfilControllerApp = angular.module('archivoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable'])
    .controller('archivoPerfilController', ['$scope', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function ($scope, $http, $window, $location, $filter, i18nService, uiGridConstants) {
        var init = function () {
            $scope.archivoID = $window.localStorage.getItem("archivoID");
            // DATOS PRINCIPALES
            $scope.cargarDatosPrincipales();
        };
        $scope.archivoDatos = {};
        $scope.datosPrincipales = {};
        $scope.datosPrincipales.archivoTitulo = "";
        $scope.datosPrincipales.archivoNombre = "";
        $scope.datosPrincipales.institucionFondo = "";
        $scope.datosPrincipales.seccion = "";
        $scope.datosPrincipales.numRefDentroFondo = "";
        $scope.datosPrincipales.archivoFecha = "";
        $scope.datosPrincipales.folioInicial = "";
        $scope.datosPrincipales.folioFinal = "";
        $scope.datosPrincipales.legajo = "";
        $scope.datosPrincipales.numOrden = "";
        $scope.datosPrincipales.numPaginas = "";
        $scope.datosPrincipales.palabrasClaves = {};
        $scope.datosPrincipales.disponibilidad = "";

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipales.editado = false;
        $scope.guardarDatos = false;
        

        $scope.cargarDatosPrincipales = function () {
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/ConsultaArchivo?archivoID=' + $scope.archivoID).then(function (data) {
                //Obtener los datos JSON
                $scope.archivoDatos = data.data[0];
                //Log
                console.log($scope.archivoDatos);

                //Llenamos los datos del archivo
                $scope.datosPrincipales.archivoTitulo = $scope.archivoDatos.titulo;
                $scope.datosPrincipales.archivoNombre = $scope.archivoDatos.fondo;
                $scope.datosPrincipales.institucionFondo = $scope.archivoDatos.institucionFondo;
                $scope.datosPrincipales.seccion = $scope.archivoDatos.seccion;
                $scope.datosPrincipales.numRefDentroFondo = $scope.archivoDatos.numRefDentroFondo;
                $scope.datosPrincipales.archivoFecha = $filter('date')(new Date($scope.archivoDatos.fechaInicial), String($scope.archivoDatos.fechaInicialFormato).toLowerCase()) + " - " + $filter('date')(new Date($scope.archivoDatos.fechaFinal), String($scope.archivoDatos.fechaFinalFormato).toLowerCase());
                $scope.datosPrincipales.folioInicial = $scope.archivoDatos.folioInicial;
                $scope.datosPrincipales.folioFinal = $scope.archivoDatos.folioFinal;
                $scope.datosPrincipales.legajo = $scope.archivoDatos.legajo;
                $scope.datosPrincipales.numOrden = $scope.archivoDatos.numOrden;
                $scope.datosPrincipales.numPaginas = $scope.archivoDatos.numPaginas;
                $scope.datosPrincipales.palabrasClaves = $scope.archivoDatos.palabrasClaves.split(",");
                $scope.datosPrincipales.disponibilidad = $scope.archivoDatos.disponibilidad;

                //Limpiamos la bandera de editado
                $scope.datosPrincipales.editado = false;


            });


        };

        // Initialization fucntion
        init();
        
        // Button functions
        $scope.borrarCambios = function () {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                init();
            }
        };
        $scope.guardarCambios = function () {
            if($scope.guardarDatos) {
                
                //Revisamos datos principales editados
                if ($scope.datosPrincipales.editado) {
                    
                }
            }
        };
    }]);
    archivoPerfilControllerApp.run(function (editableOptions,editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
    });
    })(window.angular);

