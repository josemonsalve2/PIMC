(function (angular) {

  'use strict';

  var fechaConFormatoModule = angular.module('fechaConFormatoModule', ['ngAnimate', 'ngSanitize', 'xeditable', 'ui.bootstrap']);

  fechaConFormatoModule.controller('pimcFechaConFormatoController', ['pimcService', '$filter', '$window', function (pimcService, $filter, $window) {
    var pimcFechaConFormatoCtrl = this;
  
    this.callMeTest =function() {
      var a = 'here';
    };
    // Lista de formatos
    pimcFechaConFormatoCtrl.listaFormatosPosibles = [
      {
        value: 0,
        template: "",
        templateVisualizacion:"",
        texto: "Sin Fecha"
      },
      {
        value: 1,
        template: "YYYY",
        templateVisualizacion: "yyyy",        
        texto: "1990"
      },
      // {
      //   value: 2,
      //   template: "MMMM",
      //   templateVisualizacion: "MMMM",        
      //   texto: "Abril"
      // },
      {
        value: 3,
        template: "MMMM, YYYY",
        templateVisualizacion: "MMMM, yyyy",        
        texto: "Abril, 1990"
      },
      {
        value: 4,
        template: "DD/MMMM",
        templateVisualizacion: "dd/MMMM",
        texto: "02/Abril"
      },
      {
        value: 5,
        template: "D-M-YYYY",
        templateVisualizacion: "d-M-yyyy",
        texto: "2/4/1990"
      },
      {
        value: 6,
        template: "DD-MM-YYYY",
        templateVisualizacion: "dd-MM-yyyy",
        texto: "02/04/1990"
      },
      {
        value: 7,
        template: "h:mm A",
        templateVisualizacion: "h:mm a",
        texto: "4:00 PM"
      },
      {
        value: 8,
        template: "DD/MM/YYYY hh:mm A",
        templateVisualizacion: "dd/MM/yyyy hh:mm a",
        texto: "02/07/1990 4:00 PM",
      }
    ];


    // Valores internos
    pimcFechaConFormatoCtrl.fechaInt = null;
    pimcFechaConFormatoCtrl.fechaFormatoInt = "";
    pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[0];

    pimcFechaConFormatoCtrl.$onInit = function () {
      pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[0];
      pimcFechaConFormatoCtrl.listaFormatosPosibles.forEach(function (e) {
        if (e.template === pimcFechaConFormatoCtrl.formato) {
          pimcFechaConFormatoCtrl.formatoSeleccionado = e;
        }
      });
    };

    pimcFechaConFormatoCtrl.$onChanges = function (changes) {
      // Revisamos si el formato cambio
      if (changes.formato) {
        pimcFechaConFormatoCtrl.fechaFormatoInt = $window.angular.copy(pimcFechaConFormatoCtrl.formato);
        pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[0];
        pimcFechaConFormatoCtrl.listaFormatosPosibles.forEach(function (e) {
          if (e.template === pimcFechaConFormatoCtrl.fechaFormatoInt) {
            pimcFechaConFormatoCtrl.formatoSeleccionado = e;
          }
        });
      }
      // Cambios en la fecha
      if (changes.fecha) {
        // Revisamos que haya algun valor en la fecha. de lo contrario asignamos null 
        if (!pimcFechaConFormatoCtrl.fecha || pimcFechaConFormatoCtrl.fecha.length === 0 ) {
          pimcFechaConFormatoCtrl.fechaInt = null;
        } else {
          // Si hay fecha hacemos el parsing
          pimcFechaConFormatoCtrl.fechaInt = moment.utc($window.angular.copy(pimcFechaConFormatoCtrl.fecha)).toDate();
        }
      }
    };


    // Cuando se cambia el formato se le reporta a la unidad externa 
    pimcFechaConFormatoCtrl.cambiarFormato = function () {
      var formatDate = "";

      // Revisamos si sin fecha fue seleccionado
      if (pimcFechaConFormatoCtrl.formatoSeleccionado.value == 0) {
        pimcFechaConFormatoCtrl.fechaInt = null;
        pimcFechaConFormatoCtrl.reportarCambio({
          fecha: null,
          formato: ""
        });
      }
      if (pimcFechaConFormatoCtrl.fechaInt)
        formatDate = (pimcFechaConFormatoCtrl.fechaInt instanceof Date) ?
                  pimcFechaConFormatoCtrl.fechaInt.toISOString().split("T")[0] :
                  pimcFechaConFormatoCtrl.fechaInt.split("T")[0];
      pimcFechaConFormatoCtrl.reportarCambio({
        fecha: formatDate,
        formato: pimcFechaConFormatoCtrl.formatoSeleccionado.template
      });
    };
    pimcFechaConFormatoCtrl.fechaCambio = function () {
      var formatDate = "";
      // xeditable retorna un string, hay que pasarlo a date. 
      if (!(pimcFechaConFormatoCtrl.fechaInt instanceof Date)) {
        pimcFechaConFormatoCtrl.fechaInt = moment.utc(pimcFechaConFormatoCtrl.fechaInt).toDate();
      }
      if (pimcFechaConFormatoCtrl.fechaInt)
        // cambiamos fecha para soporte de database
        formatDate = pimcFechaConFormatoCtrl.fechaInt.toISOString().split("T")[0];
        pimcFechaConFormatoCtrl.reportarCambio({
        fecha: formatDate,
        formato: pimcFechaConFormatoCtrl.formatoSeleccionado.template
      });
    }
  }]);

  // COMPONENTS
  fechaConFormatoModule.component('pimcFechaConFormato', {
    bindings: {
      fecha: "<",
      formato: "<",
      reportarCambio: "&"
    },
    controller: 'pimcFechaConFormatoController',
    controllerAs: 'pimcFechaConFormatoCtrl',
    templateUrl: 'views/global/fechaConFormato/fechaConFormatoTemplate.html'
  });
})(window.angular);