(function (angular) {

  'use strict';

  var fechaConFormatoModule = angular.module('fechaConFormatoModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

  fechaConFormatoModule.controller('pimcFechaConFormatoController', ['pimcService','$filter', function(pimcService, $filter,  crearLugarTerritorio, pimcLugarTerritorioService) {
    var pimcFechaConFormatoCtrl = this;
    pimcFechaConFormatoCtrl.$onInit = function () {
      pimcFechaConFormatoCtrl.formatoSeleccionado =  pimcFechaConFormatoCtrl.listaFormatosPosibles[7];
      pimcFechaConFormatoCtrl.listaFormatosPosibles.forEach( function(e) {
          if (e.template === pimcFechaConFormatoCtrl.formato) {
            pimcFechaConFormatoCtrl.formatoSeleccionado = e;
          }
      });
      
    };
    
    // Lista de formatos
    pimcFechaConFormatoCtrl.listaFormatosPosibles = [
      {value: 1,  
       template:"YYYY",
       formatoFecha:"yyyy", 
       formatoHora:"",
       texto:"1990", 
       fechaActivado: true,
       horaActivado: false,
       datepickerOptions: {
          datepickerMode: 'year',
          formatYear:'yyyy',
          minMode: 'year',
          yearRows: 5,
          yearColumns: 7
       }
      }, 
      {value: 2,
       template:"MMMM",
       formatoFecha:"MMMM",
       formatoHora:"",
       texto:"Abril",
       fechaActivado: true,
       horaActivado: false,
       datepickerOptions: {
          datepickerMode: 'month',
          formatMonth:'MMMM',
          minMode: 'month',
          maxMode: 'month'
       }
      }, 
      {value: 3,
       template:"MMMM, YYYY",
       formatoFecha:"MMMM, yyyy",
       formatoHora:"",
       texto:"Abril, 1990",
       fechaActivado: true,
       horaActivado: false,
       datepickerOptions: {
          datepickerMode: 'month',
          formatYear:'MMMM',
          formatYear:'yyyy',
          minMode: 'month',
          maxMode: 'year'
       }
      }, 
      { value: 4,
        template:"DD-MMMM",
        formatoFecha:"dd/MMMM", 
       formatoHora:"",
        texto:"02/Abril",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'month',
          formatDay:'dd',
          formatYear:'yyyy',
          minMode: 'day',
          maxMode: 'month'
       }
      }, 
      { value: 5,
        template:"D-M-YYYY",
        formatoFecha:"d/M/yyyy", 
       formatoHora:"",
        texto:"2/4/1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay:'d',
          formatMonth:'M',
          formatYear:'yyyy',
          minMode: 'day',
          maxMode: 'year'
       }
      }, 
      { value: 6,
        template:"DD-MM-YYYY",
        formatoFecha:"dd/MM/yyyy", 
       formatoHora:"",
        texto:"02/04/1990",
        fechaActivado: true,
        horaActivado: false,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay:'dd',
          formatMonth:'MM',
          formatYear:'yyyy',
          minMode: 'day',
          maxMode: 'year'
        }
      }, 
      { value: 7,
        template:"h:mm A",
        formatoFecha:"",
        formatoHora:"h:mm a", 
        texto:"4:00 PM",
        fechaActivado: false,
        horaActivado: true,
        datepickerOptions: {}
      }, 
      { value: 8,
        template:"DD-MM-YYYY HH:mm",
        formatoFecha:"dd-MM-yyyy", 
        formatoHora:"hh:mm",
        texto:"4:00 - 02/07/1990",
        fechaActivado: true,
        horaActivado: true,
        datepickerOptions: {
          datepickerMode: 'day',
          formatDay:'dd',
          formatMonth:'MM',
          formatYear:'yyyy',
          minMode: 'day',
          maxMode: 'year'
        }
      }
    ];
    
    pimcFechaConFormatoCtrl.cambiarFormato = function() {
      pimcFechaConFormatoCtrl.formato = pimcFechaConFormatoCtrl.template;
    };
    
    pimcFechaConFormatoCtrl.opened = {};
	pimcFechaConFormatoCtrl.open = function($event, elementOpened) {
		$event.preventDefault();
		$event.stopPropagation();

		pimcFechaConFormatoCtrl.opened[elementOpened] = !pimcFechaConFormatoCtrl.opened[elementOpened];
	};

  }]);

  // COMPONENTS
  fechaConFormatoModule.component('pimcFechaConFormato', {
    bindings:{
      fecha:"=",
      formato:"=",
      reportarCambio:"&"
    },
    controller: 'pimcFechaConFormatoController',
    controllerAs: 'pimcFechaConFormatoCtrl',
    templateUrl: 'views/global/fechaConFormato/fechaConFormatoTemplate.html'
  });


})(window.angular);