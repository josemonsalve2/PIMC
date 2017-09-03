(function (angular) {

    'use strict';

    var comentariosModule = angular.module('comentariosModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap']);

    // Service para comentarios. Cargar y guardar notas
    comentariosModule.service('pimcComentarios', ['$http', '$q', 'pimcService', function($http, $q, pimcService){
        var cometariosController = this;

        comentariosController.cargarNotas = function(elementoRelacional, elementoID) {
            // Obtenemos URL de consulta
            var consultaComentarios = pimcService.crearURLOperacion('Consulta', elementoRelacional + "Notas")

            // Organizamos el ID del elementoRelacional
            var parametros = {};
            parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoID;

            // Realizamos la consulta en la base de datos
            return $http.get(consultaComentarios, {parametros}).then(function(data) {
                var resultadoConsulta = data.data;
                var notas = [];
                if (Object.keys(resultadoConsulta).length != 0) {
                    resultadoConsulta;
                    resultadoConsulta.forEach(function(notaDB) {
                        var nuevaNota = {};
                        nota.estado = pimcService.datosEstados.LIMPIO;
                        nota.contenido = notaDB;
                    });
                    // LOG
                    pimcService.debug(notas);
                }
                return notas;
            });

        };

        comentariosController.guardarNotas = function(elementoRelacional, notas) {
            var conexiones = [];
            // Realizamos cambios de acuerdo al estado
            notas.forEach(function(nota) {
                // Insertamos notas nuevas
                if (nota.estado === pimcService.datosEstados.INSERTADO) {
                    // Obtenemos URL de consulta
                    var URLInsertar = pimcService.crearURLOperacion('Insertar', elementoRelacional + "Notas");
                    conexiones.push($http.get(URLInsertar, {nota.contenido}));
                } else if (nota.estado === pimcService.datosEstados.MODIFICADO) {
                    // Modificamos notas viejas
                    // Obtenemos URL de consulta
                    var URLModificar = pimcService.crearURLOperacion('Modificar', elementoRelacional + "Notas");
                    var parametros = nota.contenido;
                    parametros.idUnico = "notaID";
                    conexiones.push($http.get(URLModificar, {parametros}));
                } else if (nota.estado === pimcService.datosEstados.ELIMINADO) {
                    // Obtenemos URL de consulta
                    var URLEliminar = pimcService.crearURLOperacion('Eliminar', elementoRelacional + "Notas");
                    var data = {
                        idUnico:'notaID',
                        notaID:nota.notaID
                    };
                    conexiones.push($http.get(URLEliminar, {params:data}));
                };
            });
        };

    }]);

    comentariosModule.controller('comentariosComponentController',['pimcService', function(pimcService) {
        var controladorComentarios = this;
        controladorComentarios.notas = [];
        controladorComentarios.agregarNotaVacia = function() {
            // $scope.registrarAccion("Nota vacia agregada");
            controladorComentarios.notas.push({
                estado:pimcService.datosEstados.INSERTADO,
                contenido: {
                    nota: "",
                    tipoNota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: ""
                }
            });
            controladorComentarios.reportarCambio();
        }
        controladorComentarios.eliminarNota = function(indexNota) {
            //$scope.registrarAccion("Nota <strong>" + indexNota + "</strong> eliminada");
            if (controladorComentarios.notas[indexNota].estado === pimcService.datosEstados.INSERTADO) {
                controladorComentarios.notas.splice(indexNota, 1);
            } else {
                controladorComentarios.notas[indexNota].estado = pimcService.datosEstados.ELIMINADO;
            }
            controladorComentarios.reportarCambio();
        };
        controladorComentarios.modificarNota = function(indexNota, elementoModificado) {
            //$scope.registrarAccion("Nota <strong>" + indexNota + "</strong> modificada");
            if (controladorComentarios.notas[indexNota].estado === pimcService.datosEstados.INSERTADO) {
                controladorComentarios.notas[indexNota].estado = pimcService.datosEstados.MODIFICADO;
            }
        };
        controladorComentarios.filtrarEliminados = function(item) {
            return item.estado != pimcService.datosEstados.ELIMINADO;
        }
    }]);

    comentariosModule.component('pimcComentariosAnotaciones', {
        bindings:{
            reportarCambio:'&'
        },
        controller: comentariosComponentController,
        controllerAs: controladorComentarios,
        templateUrl: 'views/global/comentarios/comentariosTemplate.html'
    });


})(window.angular);