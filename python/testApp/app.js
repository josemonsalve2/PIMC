(function (angular) {
  
  'use strict';
  
  var testAPI = angular.module('testAPI',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
  testAPI.controller('testAPICtrl', ['$scope', '$http', function($scope, $http) {
    $scope.testOutput = "Nothing";
    var testInsertar = function () {
      var data = {
          nombre: "Personaje de Prueba"
        }
      $http.post("http://monsalvediaz.com:5000/PIMC0.2/Insertar/Personajes",data).then(function(data, status) {
        $scope.testOutput = data.data;
      }, function(error) {
        $scope.errorOutput = error.data.message;
      });
    };
    var testConsulta = function () {
      var config = {
        params: {
          personajeID: 51 
        }
      }
      $http.get("http://monsalvediaz.com:5000/PIMC0.2/Consulta/Personajes",config).then(function(data, status) {
        $scope.testOutput = data.data;
      }, function(error) {
        $scope.errorOutput = error.data.message;
      });
    };
    var testEliminar = function () {
        var config = {
          params: {
            personajeID: 51
          }
        }
      $http.delete("http://monsalvediaz.com:5000/PIMC0.2/Eliminar/Personajes",config).then(function(data, status) {
        $scope.testOutput = data.data;
      }, function(error) {
        $scope.errorOutput = error.data.message;
      });
    };
    var testModificar = function () {
      var data = {
          personajeID: 48,
          nombre: "fdsafdasfdas"
        }
      $http.post("http://monsalvediaz.com:5000/PIMC0.2/Modificar/Personajes",data).then(function(data, status) {
        $scope.testOutput = data.data;
      }, function(error) {
        $scope.errorOutput = error.data.message;
      });
    };
    
    //testInsertar();
    //testConsulta();
    //testEliminar();
    //testModificar();
  }]);
  
})(window.angular);
