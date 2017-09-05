(function (angular) {

  'use strict';

  var pimcListadoModule = angular.module('pimcListadoModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);

  pimcListadoModule.controller('pimcListadoController', ['$scope', 'pimcService', 'pimcBarraEstadoService', function($scope, pimcService, pimcBarraEstadoService) {
    var listadoCtrl = this;
    // Init function
    listadoCtrl.$onInit = function () {
      listadoCtrl.agregarNuevo = {mensaje:"+ Agregar"}; // Elemento de ayuda para agregar
      if(!listadoCtrl.nombre) listadoCtrl.nombre = "";
      if(!listadoCtrl.listado) listadoCtrl.listado = [];
      if(!listadoCtrl.csvString) listadoCtrl.csvString = ""; // Elementos separados por coma
      if(!listadoCtrl.ignorarPrimeroActivado) listadoCtrl.ignorarPrimeroActivado = false; // permite ignorar el primer elemento en caso de querer mostrarlo diferente
      if(!listadoCtrl.volverPrincipalActivado) listadoCtrl.volverPrincipalActivado = false; // Agrega un boton al lado de cada elemento para volver ese elemento principal
      if (listadoCtrl.listado.length != 0) {
        listadoCtrl.actualizarCsvString();
      } else if (listadoCtrl.csvString != "") {
        listadoCtrl.listado = listadoCtrl.csvString.split(",");
        listadoCtrl.listado = listadoCtrl.listado.map(function(e) {
          return e.trim();
        });
      }
    }

    // Para borrar listaNombres
    listadoCtrl.modificarBorrar = function(indexEditado, valor) {
      if (valor === "") {
        var valorAEliminar = listadoCtrl.listado[indexEditado];
        if (valorAEliminar != "") {
          pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + valorAEliminar + " </strong>  eliminado");
        }
        listadoCtrl.listado.splice(indexEditado, 1);
        listadoCtrl.reportarCambio();
      } else {
        var valorModificado = listadoCtrl.listado[indexEditado];
        if (valor != valorModificado) {
          pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + valorModificado + " </strong>  Modificado a <strong>" + valor + "</strong>");
          listadoCtrl.listado[indexEditado] = valor;
          listadoCtrl.reportarCambio();
        }
      }
      listadoCtrl.actualizarCsvString();
    }

    // funcion para agregar valores a la list
    listadoCtrl.agregarALista = function(elemento) {
      if (!listadoCtrl.listado.includes(elemento) && elemento.length != 0) {
        listadoCtrl.listado.push(elemento);
        pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + elemento + " </strong> agregado");
        listadoCtrl.reportarCambio();
      }
      listadoCtrl.actualizarCsvString();
    }

    // Funcion de ayuda para borrar el mensaje de +Agregar
    listadoCtrl.borrarOnShow = function() {
      listadoCtrl.agregarNuevo.mensaje = "";
    };

    // Funcion para volver cualquier elemento el elemento principal
    listadoCtrl.volverPrincipal = function(indice) {
      var tmp = listadoCtrl.listado[0];
      listadoCtrl.listado[0] = listadoCtrl.listado[indice];
      listadoCtrl.listado[indice] = tmp;
      pimcBarraEstadoService.registrarAccion(listadoCtrl.nombre + " <strong> " + listadoCtrl.listado[0] + " </strong>  principal");
      listadoCtrl.actualizarCsvString();
      listadoCtrl.reportarCambio();
    }

    // Funcion de ayuda para mantener el csvString actualizado
    listadoCtrl.actualizarCsvString = function() {
      listadoCtrl.csvString = listadoCtrl.listado.join(", ");
    }
  }]);

  // COMPONENTS
  pimcListadoModule.component('pimcListado', {
    bindings: {
      nombre: '@',
      listado: '=',
      csvString: '=',
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
      } else {
        // Capsula es por defecto
        urlTemplate = urlTemplate + "listadoCapsulaTemplate.html";
      }
      return urlTemplate;
    }
  });


})(window.angular);
