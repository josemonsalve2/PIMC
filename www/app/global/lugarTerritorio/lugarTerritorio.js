(function (angular) {

  'use strict';

  var lugarTerritorioModule = angular.module('lugarTerritorioModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

  // Service para comentarios. Cargar y guardar notas
  lugarTerritorioModule.service('pimcLugarTerritorioService', ['$http', '$q', 'pimcService', function($http, $q, pimcService) {
    var lugarTerritorioServiceCtrl = this;

    // Funcion para obtener lugar o territorio.
    lugarTerritorioServiceCtrl.obtenerLugarOTerritorio = function (lugarId, territorioId) {

      // Si no se envio ninguno de los dos
      if (!lugarId && !territorioId) {
        return  $q.resolve({lugarTerritorioNombre: "",
                            lugarTerritorioID: -1,
                            lugarOTerritorio: "" });
      }

      var conexiones = {};
      // Lugar tiene prioridad, revisamos si hay lugar ID
      if (lugarId) {
        var consultaLugar = pimcService.crearURLOperacion('Consulta', 'Lugares');
        conexiones['lugar'] = $http.get(consultaLugar,{
          params: {
            lugarID: datosPrincipales.contenido.lugarConstruccion
          }
        });
      }
      if (territorioId) {
        var consultaLugar = pimcService.crearURLOperacion('Consulta', 'Territorios');
        conexiones['territorio'] = $http.get(consultaLugar,{
          params: {
            lugarID: datosPrincipales.contenido.lugarConstruccion
          }
        });
      }

      // Revisamos las conexiones
      if (Object.keys(conexiones).length != 0) {
        // Retornamos la respuesta, dando prioridad a territorio
        return $q.all(conexiones).then(
          // funcion para conexiones exitosas
          function(responses) {
            // Lugar tiene prioridad
            if (responses['lugar']) {
              var lugarDatos = responses['lugar'].data;
              pimcService.debug('lugar = ' + lugarDatos);
              if (Object.keys(lugarDatos).length != 0) {
                lugarDatos = lugarDatos[0];
                var lugar = {
                  lugarTerritorioNombre: lugarDatos.nombre,
                  lugarTerritorioID: lugarId,
                  lugarOTerritorio: "lugar"
                };
                return lugar;
              }
            }

            // Revisamos territorio
            if (responses['territorio']) {
              var lugarDatos = responses['territorio'].data;
              pimcService.debug('territorio = ' + lugarDatos);
              if (Object.keys(lugarDatos).length != 0) {
                lugarDatos = lugarDatos[0];
                var lugar = {
                  lugarTerritorioNombre: lugarDatos.nombre,
                  lugarTerritorioID: lugarId,
                  lugarOTerritorio: "territorio"
                };
                return lugar;
              }
            } 

            // No se retorno nada
            return $q.resolve({ lugarTerritorioNombre: "",
                               lugarTerritorioID: -1,
                               lugarOTerritorio: "" });
          },
          // Funcion para conexiones fallidas
          function (responses) {
            pimcService.debug("conexion a lugar o territorio fallida", responses)
            return $q.resolve({lugarTerritorioNombre: "",
                               lugarTerritorioID: -1,
                               lugarOTerritorio: "" });
          }
        );
      } else {
        // Esto no deberia pasar
        pimcService.debug("Algo salio mal. lugar o territorio no cargado")
        return $q.resolve({lugarTerritorioNombre: "",
                           lugarTerritorioID: -1,
                           lugarOTerritorio: "" });
      }
    }

    lugarTerritorioServiceCtrl.autocompletarLugarTerritorio = function (hintLugarTerritorio) {
      var autocompletarLugaresURL = pimcService.crearURLOperacion('Autocompletar', 'Lugares');
      var promiseLugar = $http.get(autocompletarLugaresURL, {
        params: {
          nombre: hintLugarTerritorio
        }
      });
      var autocompletarTerritoriosURL = pimcService.crearURLOperacion('Autocompletar', 'Territorios');
      var promiseTerritorios = $http.get(autocompletarTerritoriosURL, {
        params: {
          nombre: hintLugarTerritorio,
          otrosNombres: hintLugarTerritorio
        }
      });

      return $q.all([promiseLugar, promiseTerritorios]).then( function(responses) {
        var listaLugaresTerritorios = [];
        var matchPerfecto = false;
        for (var res in responses) {
          var resultados = responses[res].data;
          if (resultados != "0") {
            resultados.forEach( function (valor) {
              var elementoAInsertar = {nombre: '',nombreMostrar: '',lugarTerritorioID: -1, lugarOTerritorio: ''}

              // Para el nombre
              if (valor.nombre) {
                elementoAInsertar.nombre = valor.nombre;
              } else if (valor.otrosNombres && valor.otrosNombres != "") {
                var listaOtrosNombres = valor.otrosNombres.split(",");
                listaOtrosNombres = listaOtrosNombres.map(function(e) {
                  var nombre = e.trim();
                  var matcher = new RegExp(hintLugarTerritorio);
                  if (nombre.match(matcher)) {
                    elementoAInsertar.nombre = nombre;
                  }
                });
              }

              // Para el lugarTerritorioID
              if (valor.lugarID) {
                elementoAInsertar.lugarTerritorioID = valor.lugarID;
                elementoAInsertar.lugarOTerritorio = 'lugar';
                elementoAInsertar.nombreMostrar = '(L) ' + elementoAInsertar.nombre;
              } else if (valor.territorioID) {
                elementoAInsertar.lugarTerritorioID = valor.territorioID;
                elementoAInsertar.lugarOTerritorio = 'territorio';                               elementoAInsertar.nombreMostrar = '(T) ' + elementoAInsertar.nombre;
              }
              listaLugaresTerritorios.push(elementoAInsertar);
            });
          }
        }
        listaLugaresTerritorios.push({nombre: hintLugarTerritorio, nombreMostrar: "(Insertar) " + hintLugarTerritorio, lugarTerritorioID: -1, lugarOTerritorio: 'insertar'});
        return listaLugaresTerritorios;
      }); 
    };

  }]);

  lugarTerritorioModule.controller('pimcLugarTerritorioCampoController', ['$http', '$q', 'pimcService', 'crearLugarTerritorio','pimcLugarTerritorioService', function($http, $q, pimcService, crearLugarTerritorio, pimcLugarTerritorioService) {
    var pimcLugarTerritorioCampoCtrl = this;
    // Funcion para lugares y territorios
    pimcLugarTerritorioCampoCtrl.$onInit = function () {
      if (!pimcLugarTerritorioCampoCtrl.lugarTerritorio) 
        pimcLugarTerritorioCampoCtrl.lugarTerritorio = {
          lugarTerritorioNombre: "",
          lugarTerritorioID: -1,
          lugarOTerritorio: ""
        };
    }

    // Funcion para cuando se selecciona un lugarTerritorio del autocompletar
    pimcLugarTerritorioCampoCtrl.seleccionarLugarTerritorio = function(elementoSeleccionado) {
      if (elementoSeleccionado.lugarOTerritorio === 'insertar') {
        // Lugar es por defecto
        crearLugarTerritorio.show(elementoSeleccionado.nombre).then(function (resultado){
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarOTerritorio = resultado.lugarOTerritorio;
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioID = resultado.lugarID;
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioNombre = resultado.nombre;
        }, function () {
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarOTerritorio = ''
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioID = -1;
          pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioNombre = "";
        });
        pimcLugarTerritorioCampoCtrl.reportarCambio({original: "", nuevo: elementoSeleccionado.nombre});
      } else {
        if (elementoSeleccionado.nombre != pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioNombre) {
          pimcLugarTerritorioCampoCtrl.reportarCambio(
            {original: pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioNombre,  
             nuevo: elementoSeleccionado.nombre}
          );
        }
        pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarOTerritorio = elementoSeleccionado.lugarOTerritorio;
        pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioID = elementoSeleccionado.lugarTerritorioID;
        pimcLugarTerritorioCampoCtrl.lugarTerritorio.lugarTerritorioNombre = elementoSeleccionado.nombre;
      }
      
    }
    
    pimcLugarTerritorioCampoCtrl.autocompletarLugarTerritorio = function(hint) {
      return pimcLugarTerritorioService.autocompletarLugarTerritorio(hint);
    }

  }]);

  // COMPONENTS
  lugarTerritorioModule.component('pimcLugarTerritorioCampo', {
    bindings:{
      lugarTerritorio: "=",
      reportarCambio:"&"
    },
    controller: 'pimcLugarTerritorioCampoController',
    controllerAs: 'pimcLugarTerritorioCampoCtrl',
    templateUrl: 'views/global/lugarTerritorio/lugarTerritorioCampoTemplate.html'
  });


})(window.angular);