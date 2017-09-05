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


    // Lista de nombres
    if ($scope.datosPrincipales.nombres != null && $scope.datosPrincipales.nombres != "") {
      $scope.datosPrincipales.nombres = embarcacionesDatos.nombres.split(",");
      $scope.datosPrincipales.nombres = $scope.datosPrincipales.nombres.map(function(e) {
        return e.trim();
      });
    } else {
      $scope.datosPrincipales.nombres = [];
    }
    // Lista de alias
    if ($scope.datosPrincipales.alias != null && $scope.datosPrincipales.alias != "") {
      $scope.datosPrincipales.alias = embarcacionesDatos.alias.split(",");
      $scope.datosPrincipales.alias = $scope.datosPrincipales.alias.map(function(e) {
        return e.trim();
      });
    } else {
      $scope.datosPrincipales.alias = [];
    }
    // Lista de usos
    if ($scope.datosPrincipales.usos != null && $scope.datosPrincipales.usos != "") {
      $scope.datosPrincipales.usos = embarcacionesDatos.usos.split(",");
      $scope.datosPrincipales.usos = $scope.datosPrincipales.usos.map(function(e) {
        return e.trim();
      });
    } else {
      $scope.datosPrincipales.usos = [];
    }

    // Editamos fecha de nacimiento y fallecimiento al formato adecuado
    $scope.datosPrincipales.fechaConstruccion = embarcacionesDatos.fechaConstruccion != null ? $filter('date')(new Date(embarcacionesDatos.fechaConstruccion), String(embarcacionesDatos.fechaConstFormato).toLowerCase()) : "";
    $scope.datosPrincipales.fechaDesercion = embarcacionesDatos.fechaDesercion != null ? $filter('date')(new Date(embarcacionesDatos.fechaDesercion), String(embarcacionesDatos.fechaDesercionFormato).toLowerCase()) : "";



    // Funcion para datos editados
    $scope.editarDatoPrincipal = function(campo, valorNuevo) {
      if (campo == 'lugarTerritorioConstruccionNombre') {
        if (valorNuevo != $scope.datosPrincipales.lugarTerritorioConstruccion.nombre) {
          pimcBarraEstadoService.registrarAccion($scope.datosPrincipales.lugarTerritorioConstruccion.lugarOTerritorio + " modificado");
          $scope.datosPrincipalesEditado = true;
        }
      } else if (campo == 'lugarTerritorioConstruccionTipo') {
        if (valorNuevo != $scope.datosPrincipales.lugarTerritorioConstruccion.lugarOTerritorio) {
          pimcBarraEstadoService.registrarAccion($scope.datosPrincipales.lugarTerritorioConstruccion.lugarOTerritorio + " construccion modificado a " + valorNuevo + " construccion");
          $scope.datosPrincipalesEditado = true;
        }
      } else if (campo == 'lugarTerritorioDesercionNombre') {
        if (valorNuevo != $scope.datosPrincipales.lugarTerritorioDesercion.nombre) {
          pimcBarraEstadoService.registrarAccion($scope.datosPrincipales.lugarTerritorioDesercion.lugarOTerritorio + "  modificado");
          $scope.datosPrincipalesEditado = true;
        }
      } else if (campo == 'lugarTerritorioDesercionTipo') {
        if (valorNuevo != $scope.datosPrincipales.lugarTerritorioDesercion.lugarOTerritorio) {
          pimcBarraEstadoService.registrarAccion($scope.datosPrincipales.lugarTerritorioDesercion.lugarOTerritorio + " construccion modificado a " + valorNuevo + " construccion");
          $scope.datosPrincipalesEditado = true;
        }
      } else if (valorNuevo != $scope.datosPrincipales[campo]) {
        pimcBarraEstadoService.registrarAccion(campo + " modificado");
        $scope.datosPrincipalesEditado = true;
      }
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