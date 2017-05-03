(function(angular) {
	'use strict';
	angular.module('personajePerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
		.controller('personajePerfilController', ['$scope', function($scope) {
				$scope.realizarBusqueda = function() {
						alert("Estamos trabajando en esto! No joda!");
				};
								$scope.tabs = new Map();
								$scope.tabsArray = [];
                                $scope.abrirElemento = function(ElementoId) {
									if ( ! $scope.tabs.has(ElementoId) ) {
                                   		 $scope.tabs.set( ElementoId, {
                                   		     title: 'ComisionSeleccionada' + ($scope.tabs.size + 1),
											 tabIndex: ($scope.tabs.size+1),
                                   		     content: 'Esta es la comision' + ElementoId,
                                   		     active: true
                                   		 });
									}
									$scope.tabsArray = Array.from($scope.tabs);
                                };
								$scope.cerrarElemento = function(ElementoId) {
									if ( $scope.tabs.has(ElementoId) ) {
										$scope.tabs.delete(ElementoId);
									}
									$scope.tabsArray = Array.from($scope.tabs);
								}
                                
                }]);
})(window.angular);
