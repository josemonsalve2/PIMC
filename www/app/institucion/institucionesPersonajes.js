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
         'pimcComentarios',
         function ($http, $q, pimcService, pimcBarraEstadoService, pimcBaseDatosService, pimcComentarios) {
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
            instPersonajeNuevo.personaje.contenido = {};
            instPersonajeNuevo.personaje.estado = pimcService.datosEstados.VACIO;
            instPersonajeNuevo.institucion = {};
            instPersonajeNuevo.institucion.contenido = {};
            instPersonajeNuevo.institucion.estado = pimcService.datosEstados.VACIO;
            instPersonajeNuevo.funcionario = {};
            instPersonajeNuevo.funcionario.contenido = {};
            instPersonajeNuevo.funcionario.estado = pimcService.datosEstados.VACIO;
            instPersonajeNuevo.notas = [];

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
                    var conexiones = [];
                    // Revisamos si se recibio algo 
                    if (Object.keys(valores).length != 0) {
                        angular.forEach(valores, function(instPersonaje) {
                            var consultasAdicionales = {}

                            consultasAdicionales['personaje'] = pimcBaseDatosService.consultarPorID("Personajes", instPersonaje.personajeID);
                            consultasAdicionales['institucion'] = pimcBaseDatosService.consultarPorID("Instituciones", instPersonaje.institucionID);
                            consultasAdicionales['funcionario'] = pimcBaseDatosService.consultarPorID("InstitucionesFuncionarios", instPersonaje.funcionarioID)
                            consultasAdicionales['notas'] = pimcComentarios.cargarNotas('InstitucionesPersonajes',instPersonaje.empleoID);

                            conexiones.push($q.all(consultasAdicionales).then(
                                function(datos) {
                                    var nuevoInstPersonaje = {}
                                    // Contenido, datos de embarcacion en la base de datos
                                    nuevoInstPersonaje.contenido = instPersonaje;

                                    // Agregamos el personaje
                                    nuevoInstPersonaje.personaje = {};
                                    nuevoInstPersonaje.personaje.contenido = datos.personaje[0];
                                    nuevoInstPersonaje.personaje.estado = pimcService.datosEstados.LIMPIO;
                                    
                                    // Agregamos la institucion
                                    nuevoInstPersonaje.institucion = {};
                                    nuevoInstPersonaje.institucion.contenido = datos.institucion[0];
                                    nuevoInstPersonaje.institucion.estado = pimcService.datosEstados.LIMPIO;

                                    // Agregamos el funcionario
                                    nuevoInstPersonaje.funcionario = {};
                                    nuevoInstPersonaje.funcionario.contenido = datos.funcionario[0];
                                    nuevoInstPersonaje.funcionario.estado = pimcService.datosEstados.LIMPIO;                                    
                                    
                                    // Agregamos las notas 
                                    nuevoInstPersonaje.notas = datos.notas;

                                    // Estado!
                                    nuevoInstPersonaje.estado = pimcService.datosEstados.LIMPIO;
                                    
                                    return nuevoInstPersonaje;
                                }
                            ))
                            
                        })
                    }
                    return $q.all(conexiones).then(
                        function(instPersonajes) {
                            return instPersonajes;
                        },
                        function(error){
                            pimcBarraEstadoService.registrarAccion("ERROR Cargando institucion personajes");
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

        pimcInstPersonajesServicioCtrl.revisarDatos = function(instPersonajes) {
            var todoEstaBien = true;
            angular.forEach(instPersonajes, function(instPersonaje) {
                if (instPersonaje.personaje.estado == pimcService.datosEstados.VACIO ||
                    instPersonaje.funcionario.estado == pimcService.datosEstados.VACIO ||
                    instPersonaje.institucion.estado == pimcService.datosEstados.VACIO)
                todoEstaBien = false;
            });
            return todoEstaBien;
        }; // fin revisarDatos

        pimcInstPersonajesServicioCtrl.guardarInstPersonajes = function (instPersonajes) {
            var conexiones = [];
            angular.forEach(instPersonajes, function(instPersonaje){
                // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
                if (instPersonaje.estado != pimcService.datosEstados.LIMPIO) {
                    var conexionesAdicionales = [];
                    // Revisamos si hay que crear el personaje y el funcionario
                    if (instPersonaje.personaje.estado == pimcService.datosEstados.INSERTADO) {
                        // Agregamos un nuevo personaje
                        conexionesAdicionales.push(
                            pimcBaseDatosService.insertarElemento('Personajes', instPersonaje.personaje.contenido).then( 
                                function(personajeCreado) {
                                    instPersonaje.personaje.contenido = personajeCreado;
                                }, 
                                function (error) {
                                    pimcService.debug("ERROR = " + error);
                                }
                            ));
                    }
                    if (instPersonaje.funcionario.estado == pimcService.datosEstados.INSERTADO) {
                        instPersonaje.funcionario.contenido.institucionID = instPersonaje.institucion.contenido.institucionID;
                        // Agregamos un nuevo funcionario
                        conexionesAdicionales.push(
                            pimcBaseDatosService.insertarElemento('InstitucionesFuncionarios', instPersonaje.funcionario.contenido).then( 
                                function(funcionarioCreado) {
                                    instPersonaje.funcionario.contenido = funcionarioCreado;
                                }, 
                                function (error) {
                                    pimcService.debug("ERROR = " + error);
                                }
                            ));
                    }
                    conexionesAdicionales.push(pimcComentarios.guardarNotas('InstitucionesPersonajes', instPersonaje.contenido.empleoID, instPersonaje.notas))
                    
                    conexiones.push(
                        $q.all(conexionesAdicionales).then( 
                            function() {
                                pimcBarraEstadoService.registrarAccion("Actualizando BD InstitucionesPersonajes");
                                var modificarInstitucionesPersonajesURL = pimcService.crearURLOperacion('Modificar', 'InstitucionesPersonajes');
                                // Preparamos personaje ID y funcioario ID
                                instPersonaje.contenido.personajeID = instPersonaje.personaje.contenido.personajeID;
                                instPersonaje.contenido.funcionarioID = instPersonaje.funcionario.contenido.funcionID;
                                if (instPersonaje.estado == pimcService.datosEstados.INSERTADO) {
                                    return pimcBaseDatosService.insertarElemento('InstitucionesPersonajes', instPersonaje.contenido);
                                } else if (instPersonaje.estado == pimcService.datosEstados.MODIFICADO) {
                                    return pimcBaseDatosService.modificarElemento('InstitucionesPersonajes', instPersonaje.contenido);
                                } else if (instPersonaje.estado == pimcService.datosEstados.ELIMINADO) {
                                    return pimcBaseDatosService.eliminarElemento('InstitucionesPersonajes', instPersonaje.contenido);
                                } else {
                                    return $q.reject("Error, estado desconocido");
                                }   
                            }
                        ))
                    }
                }); // fin forEach
            return $q.all(conexiones);
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

        // Institucion
        instPersonajesCtrl.institucionInt = undefined;

        // Para actualizar los elementos internos en caso de que sea necesario
        instPersonajesCtrl.$onChanges = function (changes) { 
            if (changes.institucion) {
                instPersonajesCtrl.institucionInt = angular.copy(instPersonajesCtrl.institucion);
            }
            if (changes.activo) {
                instPersonajesCtrl.activoInt = $window.angular.copy(instPersonajesCtrl.activo);
            }
            if (changes.personajes) {
                instPersonajesCtrl.instPersonajesInt = $window.angular.copy(instPersonajesCtrl.personajes); // Datos principales
            }          
          } 
        // Funcion para datos editados
        instPersonajesCtrl.datoEditado = function (instPersonaje, campo, valorNuevo) {
            if (instPersonaje.personaje.nombre) {
                pimcBarraEstadoService.registrarAccion("Cambio personaje " + instPersonaje.personaje.nombre + " campo " + campo + " cambio a " + valorNuevo);
            } else {
                pimcBarraEstadoService.registrarAccion("Cambio personaje campo " + campo + " cambio a " + valorNuevo);                
            }
            // Si es insertado debe permancer insertado
            if (instPersonaje.estado != pimcService.datosEstados.INSERTADO) {
                instPersonaje.estado = pimcService.datosEstados.MODIFICADO;
            }
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});
        };

        instPersonajesCtrl.cambioCampoPersonaje = function(elementoSeleccionado, estado, instPersonaje) {
            instPersonaje.personaje = {};
            instPersonaje.personaje.contenido = elementoSeleccionado;
            instPersonaje.personaje.estado = estado;
            if (instPersonaje.estado != pimcService.datosEstados.INSERTADO) {
                instPersonaje.estado = pimcService.datosEstados.MODIFICADO;
            }
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});
        }

        instPersonajesCtrl.cambioCampoFuncionario = function(elementoSeleccionado, estado, instPersonaje) {
            instPersonaje.funcionario = {};
            instPersonaje.funcionario.contenido = elementoSeleccionado;
            instPersonaje.funcionario.estado = estado;
            if (instPersonaje.estado != pimcService.datosEstados.INSERTADO) {
                instPersonaje.estado = pimcService.datosEstados.MODIFICADO;
            }
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});            
        }
        // Reportar Cambio fechas
        instPersonajesCtrl.fechaEditada = function (fecha, formato, instPersonaje, campoFecha) {
            var campoFormato = campoFecha + "Formato";
            instPersonaje.contenido[campoFecha] = fecha;
            instPersonaje.contenido[campoFormato] = formato;
            instPersonajesCtrl.datoEditado(instPersonaje, campoFecha, fecha);
        }
        // Reportar cambio de notas
        instPersonajesCtrl.notasEditadas = function (notas, instPersonaje) {
            instPersonaje.notas = notas;
            if (instPersonaje.estado != pimcService.datosEstados.INSERTADO) {
                instPersonaje.estado = pimcService.datosEstados.MODIFICADO;
            }
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});
        }
        // Abrir personaje
        instPersonajesCtrl.abrirInstPersonaje = function(personaje) {
            if (personaje.estado == pimcService.datosEstados.INSERTADO)
                pimcBarraEstadoService.registrarAccion("Personaje nuevo abrierto ");
            else 
                pimcBarraEstadoService.registrarAccion("Personaje " + personaje.personaje.nombre + " abrierto ");
            personaje.abierto = true;
        }
        
        // Cerrar personaje
        instPersonajesCtrl.cerrarInstPersonaje = function(instPersonaje) {
            if (instPersonaje.estado == pimcService.datosEstados.INSERTADO)
                pimcBarraEstadoService.registrarAccion("Personaje nuevo cerrado ");
            else 
                pimcBarraEstadoService.registrarAccion("Personaje " + instPersonaje.personaje.nombre + " cerrado ");
            instPersonaje.abierto = false;
        }
        
        // agregar personaje
        instPersonajesCtrl.agregarInstPersonaje = function() {
            pimcBarraEstadoService.registrarAccion("Personaje agregado");
            var nuevoInstPersonaje = pimcInstPersonajesServicio.crearVacio();
            nuevoInstPersonaje.institucion.contenido = instPersonajesCtrl.institucionInt.contenido;
            nuevoInstPersonaje.contenido.institucionID = instPersonajesCtrl.institucionInt.contenido.institucionID;
            nuevoInstPersonaje.institucion.estado = pimcService.datosEstados.LIMPIO;
            nuevoInstPersonaje.abierto = true;
            instPersonajesCtrl.instPersonajesInt.push(nuevoInstPersonaje);
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});            
        }

        // Eliminar personaje
        instPersonajesCtrl.eliminarInstPersonaje = function(instPersonaje) {
            if (instPersonajesCtrl.instPersonajesInt.estado == pimcService.datosEstados.INSERTADO) {
                var indexof = instPersonajesCtrl.instPersonajesInt.indexof(instPersonaje);
                instPersonajesCtrl.instPersonajesInt.splice(indexof, 1);
                instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});                
                return;
            }
            pimcBarraEstadoService.registrarAccion("Personaje " + instPersonaje.contenido.nombre + " eliminado");
            instPersonaje.estado = pimcService.datosEstados.ELIMINADO;
            instPersonaje.abierto = false;
            instPersonajesCtrl.reportarCambio({instPersonajes: instPersonajesCtrl.instPersonajesInt});            
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
            institucion: '<',
            personajes: '<',
            activo: '<',
            reportarCambio:'&'
        },
        controller: 'instPersonajesController',
        controllerAs: 'instPersonajesCtrl',
        templateUrl: 'views/institucion/institucionesPersonajes.html'
    });

})(window.angular);