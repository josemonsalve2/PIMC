(function (angular) {

  'use strict';    

  var actividadPerfil = angular.module('actividadPerfil');


  // Service para comentarios. Cargar y guardar datos principales de la embarcacion
  actividadPerfil.service('pimcActividadService', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function($http, $q, pimcService, pimcBarraEstadoService, ) {
    var actividadServiceCtrl = this;

    // Funcion para cargar datos principales de la embarcacion
    actividadServiceCtrl.cargarDatosPrincipales = function(actividadID) {
      var consultaActividadDatosPrincipales = pimcService.crearURLOperacion('Consulta', 'Actividades');
      var config = {
        params: {
          actividadID: actividadID
        }
      } 
      // Cargamos los datos principales
      return $http.get(consultaActividadDatosPrincipales, config).then( function(data) {
        //Obtener los datos JSON
        var actividadDatosPrincipales = data.data;
        var datosPrincipales = {
          contenido: {},
          estado: pimcService.datosEstados.LIMPIO
        };
        // Revisamos si se recibio algo 
        if (Object.keys(actividadDatosPrincipales).length != 0) {
          try {
            // Contenido, datos de embarcacion en la base de datos
            datosPrincipales.contenido = actividadDatosPrincipales[0];
          }
          catch(err) {
            console.log("Problema cargando los valores de datos principales de la actividad " + err.message);
          }
        }

      });
    }; //Fin de cargar datos principales

    actividadServiceCtrl.guardarDatosPrincipales = function(datosPrincipales) {

      // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
      if (datosPrincipales.estado != pimcService.datosEstados.LIMPIO) {
        pimcBarraEstadoService.registrarAccion("Actualizando BD Actividad");
        var modificarActividadesURL = pimcService.crearURLOperacion('Modificar', 'Actividades');
        var parametros = datosPrincipales.contenido;
        parametros.idUnico = 'actividadID';
        var config = {
          params: parametros
        }
        return $http.get(modificarActividadesURL, config).then( 
          // funcion conexion exitosa
          function (data) {
            if (data.data[0] != 0) {
              return true;

            } else {
              pimcService.debug("ERROR no se modificó la base de datos guardando datos principales de actividades", data);
              return false;
            }
          }, function (dataError) {
            // funcion error de conexion
            pimcService.debug("ERROR guardando actividades", dataError);
            return $q.resolve(false);
          }
        );
      }
    }; // Fin de guardar datos principales
    
    actividadServiceCtrl.crearActividad = function(actividadNueva) {
      pimcBarraEstadoService.registrarAccion("Actualizando BD Actividad");
        var crearActividadesURL = pimcService.crearURLOperacion('Insertar', 'Actividades');
        var parametros = actividadNueva;
        var config = {
          params: parametros
        }
        return $http.get(crearActividadesURL, config).then( 
          // funcion conexion exitosa
          function (data) {
            if (data.data[0] != 0) {
              return true;
            } else {
              pimcService.debug("ERROR no se modificó la base de datos guardando datos principales de actividades", data);
              return false;
            }
          }, function (dataError) {
            // funcion error de conexion
            pimcService.debug("ERROR guardando actividades", dataError);
            return $q.resolve(false);
          }
        );
      }
    }
  ]);

})(window.angular);
