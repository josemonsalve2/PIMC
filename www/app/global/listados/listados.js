(function (angular) {

  'use strict';

  var pimcListadoModule = angular.module('pimcListadoModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);

  pimcListadoModule.controller('pimcListadoController', ['$scope', 'pimcService', 'pimcBarraEstadoService','$window', function($scope, pimcService, pimcBarraEstadoService, $window) {
    var listadoCtrl = this;

    listadoCtrl.nombreInt = "";
    listadoCtrl.csvStringInt = "";
    listadoCtrl.listadoInt = [];

    // Init function
    listadoCtrl.$onInit = function () {
      listadoCtrl.agregarNuevo = {mensaje:"+ Agregar"}; // Elemento de ayuda para agregar
      if(!listadoCtrl.nombre) listadoCtrl.nombreInt = "";
      else listadoCtrl.nombreInt = listadoCtrl.nombre;
      if(!listadoCtrl.csvString) listadoCtrl.csvStringInt = ""; // Elementos separados por coma
      else listadoCtrl.csvStringInt = $window.angular.copy(listadoCtrl.csvString);

      if(!listadoCtrl.ignorarPrimeroActivado) listadoCtrl.ignorarPrimeroActivado = false; // permite ignorar el primer elemento en caso de querer mostrarlo diferente
      if(!listadoCtrl.volverPrincipalActivado) listadoCtrl.volverPrincipalActivado = false; // Agrega un boton al lado de cada elemento para volver ese elemento principal

      if(listadoCtrl.csvStringInt != "") {
        listadoCtrl.listadoInt = listadoCtrl.csvString.split(",");
        listadoCtrl.listadoInt = listadoCtrl.listadoInt.map(function(e) {
          return e.trim();
        });
      }
    }

    listadoCtrl.$onChanges = function (changes) {
      if (changes.csvString) {
        if (listadoCtrl.csvStringInt != listadoCtrl.csvString) {
          listadoCtrl.csvStringInt = $window.angular.copy(listadoCtrl.csvString); // Notas
          if (listadoCtrl.csvStringInt != "") {
            listadoCtrl.listadoInt = listadoCtrl.csvString.split(",");
            listadoCtrl.listadoInt = listadoCtrl.listadoInt.map(function (e) {
              return e.trim();
            });
          } else {
            listadoCtrl.listadoInt = [];
          }
          listadoCtrl.reportarCambio({ listado: listadoCtrl.listadoInt, csvString: listadoCtrl.csvStringInt });
        }
      }
    } 

    // Para borrar listaNombres
    listadoCtrl.modificarBorrar = function(indexEditado, valor) {
      if (valor === "") {
        var valorAEliminar = listadoCtrl.listadoInt[indexEditado];
        if (valorAEliminar != "") {
          pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + valorAEliminar + " </strong>  eliminado");
        }
        listadoCtrl.listadoInt.splice(indexEditado, 1);
      } else {
        var valorModificado = listadoCtrl.listadoInt[indexEditado];
        if (valor != valorModificado) {
          pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + valorModificado + " </strong>  Modificado a <strong>" + valor + "</strong>");
          listadoCtrl.listadoInt[indexEditado] = valor;
        }
        listadoCtrl.actualizarCsvString();
        listadoCtrl.reportarCambio({ listado: listadoCtrl.listadoInt, csvString: listadoCtrl.csvStringInt });
      }      
    }

    // funcion para agregar valores a la list
    listadoCtrl.agregarALista = function(elemento) {
      if (!listadoCtrl.listadoInt.includes(elemento) && elemento.length != 0) {
        listadoCtrl.listadoInt.push(elemento);
        pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + elemento + " </strong> agregado");
        listadoCtrl.actualizarCsvString();
        listadoCtrl.reportarCambio({ listado: listadoCtrl.listadoInt, csvString: listadoCtrl.csvStringInt });
      }
    }

    // Funcion de ayuda para borrar el mensaje de +Agregar
    listadoCtrl.borrarOnShow = function() {
      listadoCtrl.agregarNuevo.mensaje = "";
    };

    // Funcion para volver cualquier elemento el elemento principal
    listadoCtrl.volverPrincipal = function(indice) {
      var tmp = listadoCtrl.listadoInt[0];
      listadoCtrl.listadoInt[0] = listadoCtrl.listadoInt[indice];
      listadoCtrl.listadoInt[indice] = tmp;
      pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + listadoCtrl.listadoInt[0] + " </strong>  principal");
      listadoCtrl.actualizarCsvString();
      listadoCtrl.reportarCambio({ listado: listadoCtrl.listadoInt, csvString: listadoCtrl.csvStringInt });
    }

    // Funcion de ayuda para mantener el csvString actualizado
    listadoCtrl.actualizarCsvString = function() {
      listadoCtrl.csvStringInt = listadoCtrl.listadoInt.join(", ");
    }
  }]);

  // COMPONENTS
  pimcListadoModule.component('pimcListado', {
    bindings: {
      nombre: '@',
      csvString: '<',
      ignorarPrimeroActivado: '<',
      volverPrincipalActivado: '<',
      reportarCambio :'&'
    },
    controller: 'pimcListadoController',
    controllerAs: 'listadoCtrl',
    templateUrl: function($element, $attrs) {
      var urlTemplate = 'views/global/listados/';
      if ($attrs.tipo == "barra") {
        urlTemplate = urlTemplate + "listadoBarraTemplate.html";
      } else if ($attrs.tipo == "pipe") {
        urlTemplate = urlTemplate + "listadoPipeTemplate.html";
      } else if ($attrs.tipo == "listado") {
        urlTemplate = urlTemplate + "listadoListaNormalTemplate.html";
      } else {
        // Capsula es por defecto
        urlTemplate = urlTemplate + "listadoCapsulaTemplate.html";
      }
      return urlTemplate;
    }
  });


})(window.angular);
