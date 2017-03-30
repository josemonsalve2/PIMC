(function(angular) {
	'use strict';
	angular.module('archivoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
		.controller('archivoPerfilController', ['$scope', function($scope) {
				$scope.realizarBusqueda = function() {
						alert('Estamos trabajando en esto! No joda!');
				};
		}]);
})(window.angular);
