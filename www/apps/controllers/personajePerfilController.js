(function(angular) {
	'use strict';
	angular.module('personajePerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
		.controller('personajePerfilController', ['$scope', function($scope) {
				$scope.realizarBusqueda = function() {
						alert("Estamos trabajando en esto! No joda!");
				};
                                $scope.listadoHojaServicios = `
                                    <div id="HojaServiciosDiv"> 
                                        <table id="hojaServiciosTable">
                                            <tr ng-click="abrirElemento(0)"><th>Carrera</th><th>Clase</th><th>Instituci&oacute;n</th><th>Al mando de</th><th>Lugar</th><th>Fecha</th></tr>
                                            <tr ng-click="abrirElemento(0)"><td>Carrera de armas</td><td>Una clase</td><td>Comando General</td><td>alguien</td><td>Puerto B</td><td>Enero 2016</td></tr>
                                            <tr ng-click="abrirElemento(0)"><td>Carrera de armas</td><td>Una clase</td><td>Comando General</td><td>alguien</td><td>Puerto B</td><td>Enero 2016</td></tr>
                                            <tr ng-click="abrirElemento(0)"><td>Carrera de armas</td><td>Una clase</td><td>Comando General</td><td>alguien</td><td>Puerto B</td><td>Enero 2016</td></tr>
                                            <tr ng-click="abrirElemento(0)"><td>Carrera de armas</td><td>Una clase</td><td>Comando General</td><td>alguien</td><td>Puerto B</td><td>Enero 2016</td></tr>
                                            
                                        </table>
                                    </div>
                                `;
                                $scope.tabs = [{
                                    title: 'Listado Comisiones y trabajos',
                                    content: $scope.listadoHojaServicios,
                                    active: true
                                }];
                                
                                $scope.abrirElemento = function(ElementoId) {
                                    $scope.tabs.push( {
                                        title: 'ComisionSeleccionada' + ($scope.tabs.length + 1),
                                        content: 'Esta es la comision' + ElementoId,
                                        active: true
                                    });
                                };
                                
                }]);
})(window.angular);
