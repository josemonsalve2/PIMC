(function(angular) {
	'use strict';
	angular.module('embarcacionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
			.controller('embarcacionPerfilController', ['$scope', function($scope) {
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
