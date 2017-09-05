(function (angular) {

  'use strict';    

  var embarcacionPerfil = angular.module('embarcacionPerfil');


  // Service para comentarios. Cargar y guardar datos principales de la embarcacion
  embarcacionPerfil.service('pimcEmbarcacionDatosPrincipalesService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', 'pimcLugarTerritorioService', function($http, $q, pimcService, pimcBarraEstadoService, pimcLugarTerritorioService) {
    var embarcacionDatosPrincipalesServiceCtrl = this;

    // Funcion para cargar datos principales de la embarcacion
    embarcacionDatosPrincipalesServiceCtrl.cargarDatosPrincipales = function(embarcacionID) {
      var consultaEmbarcacionDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Embarcaciones');
      var config = {
        params: {
          embarcacionID: embarcacionID
        }
      } 
      // Cargamos los datos principales
      return $http.get(consultaEmbarcacionDatosPrincipales, config).then( function(data) {
        //Obtener los datos JSON
        var embarcacionesDatosPrincipales = data.data;
        var datosPrincipales = {
          contenido: {},
          datosLugarTerritorioConstruccion: {},
          datosLugarTerritorioDesercion: {},
          estado: pimcService.datosEstados.LIMPIO
        };
        // Revisamos si se recibio algo 
        if (Object.keys(embarcacionesDatosPrincipales).length != 0) {
          try {
            // Contenido, datos de embarcacion en la base de datos
            datosPrincipales.contenido = embarcacionesDatosPrincipales[0];

            // Para lugar de construccion
            // Obtenemos el nombre del lugar o territorio de construccion
            pimcLugarTerritorioService.obtenerLugarOTerritorio(
              datosPrincipales.contenido.lugarConstruccion, 
              datosPrincipales.contenido.territorioConstruccion
            ).then( function (lugarOTerritorio) {
              datosPrincipales.datosLugarTerritorioConstruccion = lugarOTerritorio;
            });

            // Para lugar de desercion
            // Obtenemos el nombre del lugar o territorio de desercion
            pimcLugarTerritorioService.obtenerLugarOTerritorio(
              datosPrincipales.contenido.lugarDesercion, 
              datosPrincipales.contenido.territorioDesercion
            ).then( function (lugarOTerritorio) {
              datosPrincipales.datosLugarTerritorioDesercion = lugarOTerritorio;
            });
          }
          catch(err) {
            console.log("Problema cargando los valores de datos principales del personaje " + err.message);
          }
        }

      });
    }; //Fin de cargar datos principales

    embarcacionDatosPrincipalesServiceCtrl.guardarDatosPrincipales = function(datosPrincipales) {

      // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
      if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {

        pimcBarraEstadoService.registrarAccion("Actualizando BD Embarcaciones");
        var modificarEmbarcacionesURL = pimcService.crearURLOperacion('Modificar', 'Embarcaciones');
        var parametros = datosPrincipales.contenido;
        parametros.idUnico = 'embarcacionID';
        var config = {
          params: parametros
        }
        return $http.get(modificarEmbarcacionesURL, config).then( 
          // funcion conexion exitosa
          function (data) {
            if (data.data[0] != 0) {
              return true;

            } else {
              pimcService.debug("ERROR no se modificó la base de datos guardando datos principales de embarcaciones", data);
              return false;
            }
          }, function (dataError) {
            // funcion error de conexion
            pimcService.debug("ERROR guardando embarcaciones", dataError);
            return $q.resolve(false);
          }
        );
      }
    }; // Fin de guardar datos principales

  }]);

  // CONTROLLERS
  embarcacionPerfil.controller('embarcacionDatosPrincipalesHeaderController',['pimcService', 'pimcBarraEstadoService', function(pimcService, pimcBarraEstadoService) {
    var embarcacionDatosPrincipalesCtrl = this;


  }]);

  embarcacionPerfil.controller('embarcacionDatosPrincipalesController',['pimcService', 'pimcBarraEstadoService', function(pimcService, pimcBarraEstadoService) {
    var embarcacionDatosPrincipalesCtrl = this;


    // Funcion para datos editados
    embarcacionDatosPrincipalesCtrl.editarDatoPrincipal = function(campo, valorNuevo) {
      
    };


  }]);

  // COMPONENTS
  embarcacionPerfil.component('pimcEmbarcacionDatosPrincipalesHeader', {
    bindings:{
      datosPrincipales:'=',
      banderas:'=',
      reportarCambio:'&'
    },
    controller: 'embarcacionDatosPrincipalesController',
    controllerAs: 'embarcacionDatosPrincipalesCtrl',
    templateUrl: 'views/global/comentarios/comentariosTemplate.html'
  });

  embarcacionPerfil.component('pimcEmbarcacionDatosPrincipales', {
    bindings:{
      datosPrincipales:'=',
      reportarCambio:'&'
    },
    controller: 'embarcacionDatosPrincipalesController',
    controllerAs: 'embarcacionDatosPrincipalesCtrl',
    templateUrl: 'views/global/comentarios/comentariosTemplate.html'
  });


})(window.angular);