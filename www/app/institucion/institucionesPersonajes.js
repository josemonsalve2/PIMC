(function (angular) {
    
    'use strict';

    var institucionPerfil = angular.module('institucionPerfil');


    // Service para comentarios. Cargar y guardar personajes de la institucion
    institucionPerfil.service('pimcInstPersonajesServicio', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
        var pimcInstPersonajesServicioCtrl = this;

        pimcInstPersonajesServicioCtrl.crearVacio = function () {
            var personajeNuevo = {};
            personajeNuevo.contenido = {
                nombre: "",
                dependencia: "",
                cantidad: 0,
                funciones: "",
            };
            personajeNuevo.estado = pimcService.datosEstados.INSERTADO;
            return personajeNuevo;
        }

        // Funcion para cargar personajess de la institucion
        pimcInstPersonajesServicioCtrl.cargarPersonajes = function (institucionID) {
            var consultaInstitucionesPersonajesURL = pimcService.crearURLOperacion('ConsultarTodos', 'InstitucionesPersonajes');
            var config = {
                params: {
                    institucionID: institucionID
                }
            }
            // Cargamos los personajes
            return $http.get(consultaInstitucionesPersonajesURL, config).then(function (data) {
                //Obtener los datos JSON
                var institucionesPersonajes = data.data;
                var personajes = [];
                // Revisamos si se recibio algo 
                if (Object.keys(institucionesPersonajes).length != 0) {
                    angular.forEach(institucionesPersonajes, function(personaje) {
                        var nuevoFuncionario = {}
                        try {
                            // Contenido, datos de embarcacion en la base de datos
                            nuevoFuncionario.contenido = personaje;
                            nuevoFuncionario.estado = pimcService.datosEstados.LIMPIO;
                        }
                        catch (err) {
                            pimcService.error("Problema cargando los personajes" + err.message);
                        }
                        personajes.push(nuevoFuncionario)
                    })
                    
                }
                return personajes;

            });
        }; //Fin de cargar datos principales

        pimcInstPersonajesServicioCtrl.guardarPersonajes = function (personajes) {
            angular.forEach(personajes, function(personaje){
                // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
                if (personaje.estado != pimcService.datosEstados.LIMPIO) {

                    pimcBarraEstadoService.registrarAccion("Actualizando BD InstitucionesPersonajes");
                    var modificarInstitucionesPersonajesURL = pimService.crearURLOperacion('Modificar', 'InstitucionesPersonajes');
                    return $http.post(modificarInstitucionesPersonajesURL, personaje.contenido).then(
                        // funcion conexion exitosa
                        function (data) {
                            if (data.data[0] != 0) {
                                return true;

                            } else {
                                pimcService.error("ERROR no se modificó la base de datos guardando los personajes de la institucion ", data);
                                return false;
                            }
                        }, function (dataError) {
                            // funcion error de conexion
                            pimcService.error("ERROR guardando personajes de la institucion", dataError);
                            return $q.resolve(false);
                        }
                    );
                }
                return false;
            }); // fin forEach
        }; // Fin de guardar personajes

    }]); // fin servicio 

    // Controller para los personajes
    institucionPerfil.controller('instPersonajesController', 
        ['pimcService', 
         'pimcBarraEstadoService', 
         'pimcInstPersonajesServicio', 
         '$window', 
         function(pimcService, pimcBarraEstadoService, pimcInstPersonajesServicio, $window) {
        var instPersonajesCtrl = this;

        // Desactivar 
        instPersonajesCtrl.activo = false;

        // Inicializacion de personajes
        instPersonajesCtrl.personajesInt = [];
        instPersonajesCtrl.personajeSeleccionado = undefined;
        instPersonajesCtrl.csvHelper = "";


        // Para actualizar los elementos internos en caso de que sea necesario
        instPersonajesCtrl.$onChanges = function (changes) { 
            if (changes.activo) {
                instPersonajesCtrl.activoInt = $window.angular.copy(instPersonajesCtrl.activo);
            }
            if (changes.personajes) {
                instPersonajesCtrl.personajesInt = $window.angular.copy(instPersonajesCtrl.personajes); // Datos principales
            }          
          } 
        // Funcion para datos editados
        instPersonajesCtrl.datoEditado = function (campo, valorNuevo) {
            pimcBarraEstadoService.registrarAccion("Cambio personaje" + instPersonajesCtrl.personajeSeleccionado.contenido.nombre + " campo " + campo + " cambio a " + valorNuevo);
            instPersonajesCtrl.personajeSeleccionado.estado = pimcService.datosEstados.MODIFICADO;
            instPersonajesCtrl.reportarCambio({personajes: instPersonajesCtrl.personajesInt});
        };

        // Abrir personaje
        instPersonajesCtrl.abrirFuncionario = function(personaje) {
            pimcBarraEstadoService.registrarAccion("Funcionario " + personaje.contenido.nombre + " abrierto ");
            instPersonajesCtrl.personajeSeleccionado = personaje;
            // Para poder actualizar la lista de funciones sin que haya problema
            instPersonajesCtrl.csvHelper = personaje.contenido.funciones;
        }
        
        // agregar personaje
        instPersonajesCtrl.agregarFuncionario = function() {
            pimcBarraEstadoService.registrarAccion("Funcionario agregado");
            var nuevoFuncionario = pimcInstPersonajesServicio.crearVacio();
            instPersonajesCtrl.personajesInt.push(nuevoFuncionario);
        }

        // Eliminar personaje
        instPersonajesCtrl.eliminarFuncionario = function(personaje) {
            pimcBarraEstadoService.registrarAccion("Funcionario " + personaje.contenido.nombre + " eliminado");
            if (instPersonajesCtrl.personajesInt.estado == pimcService.datosEstados.INSERTADO) {
                var indexof = instPersonajesCtrl.personajesInt.indexof(personaje);
                instPersonajesCtrl.personajesInt.splice(indexof, 1);
                return;
            }
            personaje.estado = pimcService.datosEstados.ELIMINADO;
        }

        // Listado de funciones del personaje
        instPersonajesCtrl.listadoEditado = function (listado, csvString) {
            instPersonajesCtrl.personajesArray = listado;
            if (csvString != instPersonajesCtrl.personajeSeleccionado.contenido.funciones) {
                instPersonajesCtrl.personajeSeleccionado.contenido.funciones = csvString;
                instPersonajesCtrl.datoEditado('funciones', csvString);
                instPersonajesCtrl.csvHelper = csvString;
            }
        };

        // Listado palabras claves
        instPersonajesCtrl.personajesArray = [];


    }]);

    institucionPerfil.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
        return function (notas) {
            if (!notas) return [];
            var filtrados = [];
            angular.forEach(notas, function(val, key) {
                if (val.estado != pimcService.datosEstados.ELIMINADO) {
                    filtrados.push(val);
                }
            });
            return filtrados;
        }
    }]);

    institucionPerfil.component('pimcInstitucionesPersonajes', {
        bindings: {
            personajes: '<',
            activo: '<',
            reportarCambio:'&'
        },
        controller: 'instPersonajesController',
        controllerAs: 'instPersonajesCtrl',
        templateUrl: 'views/institucion/institucionesPersonajes.html'
    });

})(window.angular);