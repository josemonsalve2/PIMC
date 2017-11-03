(function (angular) {

    'use strict';

    var comentariosModule = angular.module('comentariosModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);

    // Service para comentarios. Cargar y guardar notas
    comentariosModule.service('pimcComentarios', ['$http', '$q', 'pimcService', function($http, $q, pimcService){
        var comentariosController = this;

        comentariosController.cargarNotas = function(elementoRelacional, elementoID) {
            // Obtenemos URL de consulta
            var consultaComentarios = pimcService.crearURLOperacion('ConsultarTodos', elementoRelacional + "Notas")

            // Organizamos el ID del elementoRelacional
            var parametros = {};
            parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoID;

            // Realizamos la consulta en la base de datos
            return $http.get(consultaComentarios, {params:parametros}).then(function(data) {
                if (Object.keys(data.data).length != 0) {
                    var resultadoConsulta = data.data;
                    var notas = [];
                    if (Object.keys(resultadoConsulta).length != 0) {
                        resultadoConsulta;
                        angular.forEach(resultadoConsulta, function(notaDB, key) {
                            var nuevaNota = {};
                            nuevaNota.estado = pimcService.datosEstados.LIMPIO;
                            nuevaNota.contenido = notaDB;
                            notas.push(nuevaNota);
                        });
                        // LOG
                        pimcService.debug(notas);
                    }
                    return notas;
                } else {
                    return [];
                }
            });

        };

        comentariosController.guardarNotas = function(elementoRelacional, idElementoRelaciona, notas) {
            var conexiones = [];
            // Realizamos cambios de acuerdo al estado
            notas.forEach(function(nota) {
                // Limpiamos la nota, quitamos elementos no usados
                angular.forEach(nota.contenido, function(val, key) {
                    if (!val || val.length === 0) {
                        delete nota.contenido[key];
                    }
                });
                // Insertamos notas nuevas
                if (nota.estado === pimcService.datosEstados.INSERTADO) {
                    // Evitar notas vacias
                    if (Object.keys(nota.contenido).length === 0) {
                        return;
                    }
                    var idNombre = pimcService.idElementoRelaciona[elementoRelacional];
                    nota.contenido[idNombre] = idElementoRelaciona;
                    // Obtenemos URL de consulta
                    var URLInsertar = pimcService.crearURLOperacion('Insertar', elementoRelacional + "Notas");
                    conexiones.push($http.post(URLInsertar, nota.contenido));
                } else if (nota.estado === pimcService.datosEstados.MODIFICADO) {
                    // No deberiamos modificar la fecha de creacion
                    delete nota.contenido['fechaCreacion'];
                    // Modificamos notas viejas
                    // Obtenemos URL de consulta
                    var URLModificar = pimcService.crearURLOperacion('Modificar', elementoRelacional + "Notas");
                    var parametros = nota.contenido;
                    conexiones.push($http.post(URLModificar, parametros));
                } else if (nota.estado === pimcService.datosEstados.ELIMINADO) {
                    // Obtenemos URL de consulta
                    var URLEliminar = pimcService.crearURLOperacion('Eliminar', elementoRelacional + "Notas");
                    var config = {
                        params: {
                            notaID: nota.contenido.notaID
                        }
                      }
                    conexiones.push($http.delete(URLEliminar, config));
                };
            });
            return $q.all(conexiones).then( function(responses) {
                    for (var res in responses) {
                        pimcService.debug(res + ' = ' + responses[res].data);
                    }
                }, function(responses) {
                for (var res in responses) {
                        pimcService.debug("[ERROR]" + res + ' = ' + responses[res]);
                    }
            });
        };

    }]);

    comentariosModule.controller('comentariosComponentController',['pimcService', 'pimcBarraEstadoService','$window', function(pimcService, pimcBarraEstadoService, $window) {
        var controladorComentarios = this;
        controladorComentarios.notasInt = [];

        // Para actualizar los elementos internos en caso de que sea necesario
        controladorComentarios.$onChanges = function (changes) {
            if (changes.notas) {
                controladorComentarios.notasInt = $window.angular.copy(controladorComentarios.notas); // Notas
            }
        } 

        // Agregar una nota nueva
        controladorComentarios.agregarNotaVacia = function() {
            pimcBarraEstadoService.registrarAccion("Nota vacia agregada");
            controladorComentarios.notasInt.push({
                estado: pimcService.datosEstados.INSERTADO,
                contenido: {
                    nota: "",
                    tipoNota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: ""
                }
            });
            controladorComentarios.reportarCambio({notas: controladorComentarios.notasInt});
        }
        
        // Elminar una nota
        controladorComentarios.eliminarNota = function(nota) {
            var indexNota = controladorComentarios.notasInt.indexOf(nota);
            pimcBarraEstadoService.registrarAccion("Nota <strong>" + indexNota + "</strong> eliminada");
            if (controladorComentarios.notasInt[indexNota].estado === pimcService.datosEstados.INSERTADO) {
                controladorComentarios.notasInt.splice(indexNota, 1);
            } else {
                controladorComentarios.notasInt[indexNota].estado = pimcService.datosEstados.ELIMINADO;
            }
            controladorComentarios.reportarCambio({notas: controladorComentarios.notasInt});
        };

        // Modificar una nota
        controladorComentarios.modificarNota = function(nota, elementoModificado) {
            var indexNota = controladorComentarios.notasInt.indexOf(nota);
            pimcBarraEstadoService.registrarAccion("Nota <strong>" + indexNota + "</strong> modificada");
            if (controladorComentarios.notasInt[indexNota].estado != pimcService.datosEstados.INSERTADO) {
                controladorComentarios.notasInt[indexNota].estado = pimcService.datosEstados.MODIFICADO;
            }
            controladorComentarios.reportarCambio({notas: controladorComentarios.notasInt});
        };
        
    }]);

    comentariosModule.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
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
    
    comentariosModule.component('pimcComentariosAnotaciones', {
        bindings:{
            notas:'<', // Input
            reportarCambio:'&' // Output
        },
        controller: 'comentariosComponentController',
        controllerAs: 'controladorComentarios',
        templateUrl: 'views/global/comentarios/comentariosTemplate.html'
    });


})(window.angular);