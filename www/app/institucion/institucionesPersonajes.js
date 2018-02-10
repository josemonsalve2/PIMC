(function (angular) {
    
    'use strict';

    var institucionPerfil = angular.module('institucionPerfil');


    // Service para comentarios. Cargar y guardar personajes de la institucion
    institucionPerfil.service('pimcInstPersonajesServicio', 
        ['$http', 
         '$q',
         'pimcService',
         'pimcBarraEstadoService',
         'pimcBaseDatosService',
         function ($http, $q, pimcService, pimcBarraEstadoService, pimcBaseDatosService) {
        var pimcInstPersonajesServicioCtrl = this;

        pimcInstPersonajesServicioCtrl.crearVacio = function () {
            var instPersonajeNuevo = {};
            instPersonajeNuevo.contenido = {
                tipoEmpleo: "",
                fechaInicial: "",
                fechaInicialFormato: "",
                fechaFinal: "",
                fechaFinalFormato: "",
                salario: 0,
                salarioUnidades: ""
            };
            instPersonajeNuevo.personaje = {};
            instPersonajeNuevo.institucion = {};
            instPersonajeNuevo.funcionario = {};

            instPersonajeNuevo.estado = pimcService.datosEstados.INSERTADO;
            return instPersonajeNuevo;
        }

        // Funcion para cargar personajess de la institucion
        pimcInstPersonajesServicioCtrl.cargarInstPersonajes = function (institucionID) {
            var params = { institucionID: institucionID };
            // Cargamos los personajes
            return pimcBaseDatosService.consultarBaseDatosParametros("InstitucionesPersonajes", params).then(
                function (valores) {
                    //Obtener los datos JSON
                    var institucionesPersonajes = [];
                    var conexiones = [];
                    // Revisamos si se recibio algo 
                    if (Object.keys(valores).length != 0) {
                        angular.forEach(valores, function(instPersonaje) {
                            var nuevoInstPersonaje = {}
                            // Contenido, datos de embarcacion en la base de datos
                            nuevoInstPersonaje.contenido = instPersonaje;
                            conexiones.push(pimcBaseDatosService.consultarPorID("Personajes", instPersonaje.personajeID).then(
                                function(personaje) {
                                    nuevoInstPersonaje.personaje = personaje;
                                }, 
                                function(error) {
                                    pimcService.debug(error);                                    
                                }
                            ));
                            conexiones.push(pimcBaseDatosService.consultarPorID("Institucion", instPersonaje.institucionID).then(
                                function(institucion) {
                                    nuevoInstPersonaje.institucion = institucion;
                                }, 
                                function(error) {
                                    pimcService.debug(error);                                    
                                }
                            ));
                            conexiones.push(pimcBaseDatosService.consultarPorID("InstitucionesFuncionarios", instPersonaje.funcionID).then(
                                function(funcionario) {
                                    nuevoInstPersonaje.funcionario = funcionario;
                                }, 
                                function(error) {
                                    pimcService.debug(error);                                    
                                }
                            ));
                            nuevoInstPersonaje.estado = pimcService.datosEstados.LIMPIO;
                            // Encontramos el resto de la informacion
                        })
                    }
                    return $q.all(conexiones).then(
                        function() {
                            return institucionesPersonajes;
                        },
                        function(error){
                            pimcService.debug(error);                            
                        }
                    )
                }, 
                function (error) {
                    pimcService.debug(error);
                    return [];
                }
            );
        }; //Fin de cargar datos principales

        pimcInstPersonajesServicioCtrl.guardarInstPersonajes = function (personajes) {
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
        instPersonajesCtrl.instPersonajesInt = [];

        // Para actualizar los elementos internos en caso de que sea necesario
        instPersonajesCtrl.$onChanges = function (changes) { 
            if (changes.activo) {
                instPersonajesCtrl.activoInt = $window.angular.copy(instPersonajesCtrl.activo);
            }
            if (changes.personajes) {
                instPersonajesCtrl.instPersonajesInt = $window.angular.copy(instPersonajesCtrl.personajes); // Datos principales
            }          
          } 
        // Funcion para datos editados
        instPersonajesCtrl.datoEditado = function (personaje, campo, valorNuevo) {
            pimcBarraEstadoService.registrarAccion("Cambio personaje" + instPersonajesCtrl.personajeSeleccionado.contenido.nombre + " campo " + campo + " cambio a " + valorNuevo);
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});
        };

        // Abrir personaje
        instPersonajesCtrl.abrirInstPersonaje = function(personaje) {
            if (personaje.estado == pimcService.datosEstados.INSERTADO)
                pimcBarraEstadoService.registrarAccion("Personaje nuevo abrierto ");
            else 
                pimcBarraEstadoService.registrarAccion("Personaje " + personaje.personaje.nombre + " abrierto ");
            personaje.abierto = true;
        }
        // Cerrar personaje
        instPersonajesCtrl.cerrarInstPersonaje = function(personaje) {
            if (personaje.estado == pimcService.datosEstados.INSERTADO)
                pimcBarraEstadoService.registrarAccion("Personaje nuevo cerrado ");
            else 
                pimcBarraEstadoService.registrarAccion("Personaje " + personaje.personaje.nombre + " cerrado ");
            personaje.abierto = false;
        }
        
        // agregar personaje
        instPersonajesCtrl.agregarInstPersonaje = function() {
            pimcBarraEstadoService.registrarAccion("Personaje agregado");
            var nuevoInstPersonaje = pimcInstPersonajesServicio.crearVacio();
            nuevoInstPersonaje.abierto = true;
            instPersonajesCtrl.instPersonajesInt.push(nuevoInstPersonaje);
        }

        // Eliminar personaje
        instPersonajesCtrl.eliminarInstPersonaje = function(personaje) {
            if (instPersonajesCtrl.instPersonajesInt.estado == pimcService.datosEstados.INSERTADO) {
                var indexof = instPersonajesCtrl.instPersonajesInt.indexof(personaje);
                instPersonajesCtrl.instPersonajesInt.splice(indexof, 1);
                return;
            }
            pimcBarraEstadoService.registrarAccion("Personaje " + personaje.contenido.nombre + " eliminado");
            personaje.estado = pimcService.datosEstados.ELIMINADO;
            personaje.abierto = false;
        }

    }]);

    institucionPerfil.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
        return function (personajes) {
            if (!personajes) return [];
            var filtrados = [];
            angular.forEach(personajes, function(val, key) {
                if (val.estado != pimcService.datosEstados.ELIMINADO) {
                    filtrados.push(val);
                }
            });
            return filtrados;
        }
    }]);

    institucionPerfil.filter('filtrarAbiertos',['pimcService' ,function(pimcService) {
        return function (personajes) {
            if (!personajes) return [];
            var filtrados = [];
            angular.forEach(personajes, function(val, key) {
                if (val.abierto) {
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