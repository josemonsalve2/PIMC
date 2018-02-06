(function (angular) {
    
    'use strict';

    var institucionPerfil = angular.module('institucionPerfil');


    // Service para comentarios. Cargar y guardar funcionarios de la institucion
    institucionPerfil.service('pimcInstFuncionariosServicio', ['$http', '$q', 'pimcService', 'pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
        var pimcInstFuncionariosServicioCtrl = this;

        pimcInstFuncionariosServicioCtrl.crearVacio = function () {
            var funcionarioNuevo = {};
            funcionarioNuevo.contenido = {
                nombre: "",
                dependencia: "",
                cantidad: 0,
                funciones: "",
            };
            funcionarioNuevo.estado = pimcService.datosEstados.INSERTADO;
            return funcionarioNuevo;
        }

        // Funcion para cargar funcionarioss de la institucion
        pimcInstFuncionariosServicioCtrl.cargarFuncionarios = function (institucionID) {
            var consultaInstitucionesFuncionariosURL = pimcService.crearURLOperacion('ConsultarTodos', 'InstitucionesFuncionarios');
            var config = {
                params: {
                    institucionID: institucionID
                }
            }
            // Cargamos los funcionarios
            return $http.get(consultaInstitucionesFuncionariosURL, config).then(function (data) {
                //Obtener los datos JSON
                var institucionesFuncionarios = data.data;
                var funcionarios = [];
                // Revisamos si se recibio algo 
                if (Object.keys(institucionesFuncionarios).length != 0) {
                    angular.forEach(institucionesFuncionarios, function(funcionario) {
                        var nuevoFuncionario = {}
                        try {
                            // Contenido, datos de embarcacion en la base de datos
                            nuevoFuncionario.contenido = funcionario;
                            nuevoFuncionario.estado = pimcService.datosEstados.LIMPIO;
                        }
                        catch (err) {
                            pimcService.error("Problema cargando los funcionarios" + err.message);
                        }
                        funcionarios.push(nuevoFuncionario)
                    })
                    
                }
                return funcionarios;

            });
        }; //Fin de cargar datos principales

        pimcInstFuncionariosServicioCtrl.guardarFuncionarios = function (funcionarios) {
            angular.forEach(funcionarios, function(funcionario){
                // Si los datos fueron cambiados, entonces actualizamos todas las bases de datos
                if (funcionario.estado != pimcService.datosEstados.LIMPIO) {

                    pimcBarraEstadoService.registrarAccion("Actualizando BD InstitucionesFuncionarios");
                    var modificarInstitucionesFuncionariosURL = pimService.crearURLOperacion('Modificar', 'InstitucionesFuncionarios');
                    return $http.post(modificarInstitucionesFuncionariosURL, funcionario.contenido).then(
                        // funcion conexion exitosa
                        function (data) {
                            if (data.data[0] != 0) {
                                return true;

                            } else {
                                pimcService.error("ERROR no se modificó la base de datos guardando los funcionarios de la institucion ", data);
                                return false;
                            }
                        }, function (dataError) {
                            // funcion error de conexion
                            pimcService.error("ERROR guardando funcionarios de la institucion", dataError);
                            return $q.resolve(false);
                        }
                    );
                }
                return false;
            }); // fin forEach
        }; // Fin de guardar funcionarios

    }]); // fin servicio 

    // Controller para los funcionarios
    institucionPerfil.controller('instFuncionariosController', 
        ['pimcService', 
         'pimcBarraEstadoService', 
         'pimcInstFuncionariosServicio', 
         '$window', 
         function(pimcService, pimcBarraEstadoService, pimcInstFuncionariosServicio, $window) {
        var instFuncionariosCtrl = this;

        // Desactivar 
        instFuncionariosCtrl.activo = false;

        // Inicializacion de funcionarios
        instFuncionariosCtrl.funcionariosInt = [];
        instFuncionariosCtrl.funcionarioSeleccionado = undefined;
        instFuncionariosCtrl.csvHelper = "";


        // Para actualizar los elementos internos en caso de que sea necesario
        instFuncionariosCtrl.$onChanges = function (changes) { 
            if (changes.activo) {
                instFuncionariosCtrl.activoInt = $window.angular.copy(instFuncionariosCtrl.activo);
            }
            if (changes.funcionarios) {
                instFuncionariosCtrl.funcionariosInt = $window.angular.copy(instFuncionariosCtrl.funcionarios); // Datos principales
            }          
          } 
        // Funcion para datos editados
        instFuncionariosCtrl.datoEditado = function (campo, valorNuevo) {
            pimcBarraEstadoService.registrarAccion("Cambio funcionario" + instFuncionariosCtrl.funcionarioSeleccionado.contenido.nombre + " campo " + campo + " cambio a " + valorNuevo);
            instFuncionariosCtrl.funcionarioSeleccionado.estado = pimcService.datosEstados.MODIFICADO;
            instFuncionariosCtrl.reportarCambio({funcionarios: instFuncionariosCtrl.funcionariosInt});
        };

        // Abrir funcionario
        instFuncionariosCtrl.abrirFuncionario = function(funcionario) {
            pimcBarraEstadoService.registrarAccion("Funcionario " + funcionario.contenido.nombre + " abrierto ");
            instFuncionariosCtrl.funcionarioSeleccionado = funcionario;
            // Para poder actualizar la lista de funciones sin que haya problema
            instFuncionariosCtrl.csvHelper = funcionario.contenido.funciones;
        }
        
        // agregar funcionario
        instFuncionariosCtrl.agregarFuncionario = function() {
            pimcBarraEstadoService.registrarAccion("Funcionario agregado");
            var nuevoFuncionario = pimcInstFuncionariosServicio.crearVacio();
            instFuncionariosCtrl.funcionariosInt.push(nuevoFuncionario);
        }

        // Eliminar funcionario
        instFuncionariosCtrl.eliminarFuncionario = function(funcionario) {
            pimcBarraEstadoService.registrarAccion("Funcionario " + funcionario.contenido.nombre + " eliminado");
            if (instFuncionariosCtrl.funcionariosInt.estado == pimcService.datosEstados.INSERTADO) {
                var indexof = instFuncionariosCtrl.funcionariosInt.indexof(funcionario);
                instFuncionariosCtrl.funcionariosInt.splice(indexof, 1);
                return;
            }
            funcionario.estado = pimcService.datosEstados.ELIMINADO;
        }

        // Listado de funciones del funcionario
        instFuncionariosCtrl.listadoEditado = function (listado, csvString) {
            instFuncionariosCtrl.funcionariosArray = listado;
            if (csvString != instFuncionariosCtrl.funcionarioSeleccionado.contenido.funciones) {
                instFuncionariosCtrl.funcionarioSeleccionado.contenido.funciones = csvString;
                instFuncionariosCtrl.datoEditado('funciones', csvString);
                instFuncionariosCtrl.csvHelper = csvString;
            }
        };

        // Listado palabras claves
        instFuncionariosCtrl.funcionariosArray = [];


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

    institucionPerfil.component('pimcInstitucionesFuncionarios', {
        bindings: {
            funcionarios: '<',
            activo: '<',
            reportarCambio:'&'
        },
        controller: 'instFuncionariosController',
        controllerAs: 'instFuncionariosCtrl',
        templateUrl: 'views/institucion/institucionesFuncionarios.html'
    });

})(window.angular);