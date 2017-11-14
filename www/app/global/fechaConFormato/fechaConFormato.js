(function (angular) {

  'use strict';

  var fechaConFormatoModule = angular.module('fechaConFormatoModule', ['ngAnimate', 'ngSanitize', 'xeditable', 'ui.bootstrap']);

  fechaConFormatoModule.controller('pimcFechaConFormatoController', ['pimcService', '$filter', '$window', function (pimcService, $filter, $window) {
    var pimcFechaConFormatoCtrl = this;

    // Lista de formatos
    pimcFechaConFormatoCtrl.listaFormatosPosibles = [
      {
        value: 1,
        template: "YYYY",
        formatoFecha: "yyyy",
        formatoHora: "",
        texto: "1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'year',
          formatYear: 'yyyy',
          minMode: 'year',
          yearRows: 5,
          yearColumns: 7
        }
      },
      {
        value: 2,
        template: "MMMM",
        formatoFecha: "MMMM",
        formatoHora: "",
        texto: "Abril",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'month',
          formatMonth: 'MMMM',
          minMode: 'month',
          maxMode: 'month'
        }
      },
      {
        value: 3,
        template: "MMMM, YYYY",
        formatoFecha: "MMMM, yyyy",
        formatoHora: "",
        texto: "Abril, 1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'month',
          formatYear: 'MMMM',
          formatYear: 'yyyy',
          minMode: 'month',
          maxMode: 'year'
        }
      },
      {
        value: 4,
        template: "DD-MMMM",
        formatoFecha: "dd/MMMM",
        formatoHora: "",
        texto: "02/Abril",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'month',
          formatDay: 'dd',
          formatYear: 'yyyy',
          minMode: 'day',
          maxMode: 'month'
        }
      },
      {
        value: 5,
        template: "D-M-YYYY",
        formatoFecha: "d/M/yyyy",
        formatoHora: "",
        texto: "2/4/1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay: 'd',
          formatMonth: 'M',
          formatYear: 'yyyy',
          minMode: 'day',
          maxMode: 'year'
        }
      },
      {
        value: 6,
        template: "DD-MM-YYYY",
        formatoFecha: "dd/MM/yyyy",
        formatoHora: "",
        texto: "02/04/1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay: 'dd',
          formatMonth: 'MM',
          formatYear: 'yyyy',
          minMode: 'day',
          maxMode: 'year'
        }
      },
      {
        value: 7,
        template: "h:mm A",
        formatoFecha: "",
        formatoHora: "h:mm a",
        texto: "4:00 PM",
        fechaActivado: false,
        horaActivado: true,
        datepickerOptions: {}
      },
      {
        value: 8,
        template: "DD-MM-YYYY HH:mm",
        formatoFecha: "dd-MM-yyyy",
        formatoHora: "hh:mm",
        texto: "4:00 - 02/07/1990",
        fechaActivado: true,
        horaActivado: true,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay: 'dd',
          formatMonth: 'MM',
          formatYear: 'yyyy',
          minMode: 'day',
          maxMode: 'year'
        }
      }
    ];


    // Valores internos
    pimcFechaConFormatoCtrl.fechaInt = "";
    pimcFechaConFormatoCtrl.fechaFormatoInt = "";
    pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[7];

    pimcFechaConFormatoCtrl.$onInit = function () {
      pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[7];
      pimcFechaConFormatoCtrl.listaFormatosPosibles.forEach(function (e) {
        if (e.template === pimcFechaConFormatoCtrl.formato) {
          pimcFechaConFormatoCtrl.formatoSeleccionado = e;
        }
      });
    };

    pimcFechaConFormatoCtrl.$onChanges = function (changes) {
      if (changes.fecha) {
        pimcFechaConFormatoCtrl.fechaInt = $window.angular.copy(pimcFechaConFormatoCtrl.fecha);
        if (!pimcFechaConFormatoCtrl.fechaInt || pimcFechaConFormatoCtrl.fechaInt.lenght === 0 ) {
          pimcFechaConFormatoCtrl.fechaInt = "0";
        }
      }
      if (changes.formato) {
        pimcFechaConFormatoCtrl.fechaFormatoInt = $window.angular.copy(pimcFechaConFormatoCtrl.formato);
        pimcFechaConFormatoCtrl.formatoSeleccionado = pimcFechaConFormatoCtrl.listaFormatosPosibles[7];
        pimcFechaConFormatoCtrl.listaFormatosPosibles.forEach(function (e) {
          if (e.template === pimcFechaConFormatoCtrl.fechaFormatoInt) {
            pimcFechaConFormatoCtrl.formatoSeleccionado = e;
          }
        });
      }
    };


    // Cuando se cambia el formato se le reporta a la unidad externa 
    pimcFechaConFormatoCtrl.cambiarFormato = function (nuevoFormato) {
      pimcFechaConFormatoCtrl.reportarCambio({
        fecha: pimcFechaConFormatoCtrl.fechaInt,
        formato: pimcFechaConFormatoCtrl.formatoSeleccionado.template
      });
    };
    pimcFechaConFormatoCtrl.fechaCambio = function () {
      pimcFechaConFormatoCtrl.reportarCambio({
        fecha: pimcFechaConFormatoCtrl.fechaInt,
        formato: pimcFechaConFormatoCtrl.formatoSeleccionado.template
      });
    }

    pimcFechaConFormatoCtrl.opened = {};
    pimcFechaConFormatoCtrl.open = function ($event, elementOpened) {
      $event.preventDefault();
      $event.stopPropagation();

      pimcFechaConFormatoCtrl.opened[elementOpened] = !pimcFechaConFormatoCtrl.opened[elementOpened];
    };

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

  fechaConFormatoModule.run(function(editableOptions, editableThemes) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    editableOptions.buttons = 'no';
});

})(window.angular);