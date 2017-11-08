(function (angular) {
    
        'use strict';
    
        var tablaRefElementoRelacionalModule = angular.module('tablaRefElementoRelacionalModule',['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'xeditable']);
    
        // Service para comentarios. Cargar y guardar notas
        tablaRefElementoRelacionalModule.service('pimcTablaRefElementoService', ['$http', '$q', 'pimcService', function ($http, $q, pimcService) {
            var tablaRefElementoServiceCtrl = this;

            tablaRefElementoServiceCtrl.cargarElementos = function (elementoRelacional, documentoID) {
                var UrlConsultaReferencias = pimcService.crearURLOperacion('ConsultarTodos', "DocumentosRef" + elementoRelacional);

                // filtramos por documentoID
                var parametros = {};
                parametros.documentoID = documentoID;

                // obtenemos todas las referencias
                return $http.get(UrlConsultaReferencias, { params: parametros }).then(function (data) {
                    var elementos = [];

                    // revisar si existe alguno
                    if (Object.keys(data.data).length != 0) {
                        var referenciasTodas = data.data;
                        referenciasTodas.forEach(function (referencia) {
                            var UrlConsultaElementos = pimcService.crearURLOperacion('Consulta', elementoRelacional);

                            var parametros = {};
                            var idNombre = pimcService.idElementoRelaciona[elementoRelacional];
                            parametros[idNombre] = referenciasTodas[idNombre];

                            // Obtenemos todos los datos de la referencia
                            $http.get(UrlConsultaElementos, { param: parametros }).then(function (data) {
                                // Obtenemos la informacion
                                var datosContenido = data.data[0];

                                // Creamos el nuevo elemento
                                var nuevoElemento = {};
                                nuevoElemento.referenciaID = referencia.referenciaID;
                                nuevoElemento.estado = pimcService.datosEstados.LIMPIO;
                                nuevoElemento.contenido = datosContenido;
                                elementos.push(nuevoElemento);
                            });
                        });
                        // LOG
                        pimcService.debug(elementos.toString());
                    }
                    return elementos;
                });
            };
    
            comentariosController.guardarNotas = function(elementoRelacional, idElementoRelaciona, notas) {
                
            };
    
        }]);
    
        tablaRefElementoRelacionalModule.controller('pimcRefTablaController', ['pimcService', 'pimcBarraEstadoService', '$window', function (pimcService, pimcBarraEstadoService, $window) {
            var refTablaCtrl = this;
            refTablaCtrl.valoresInt = [];
            refTablaCtrl.activarBorrarExistentes = false;
            refTablaCtrl.elementoRelacionalInt = "";
            refTablaCtrl.camposColumnasInt = [];
            refTablaCtrl.nombresColumnasInt = {};
            refTablaCtrl.autocompletarOpcionesInt = {
                minLength: 3,
                delay: 100,
                campoAutocompletar: ""
            };

            // Actualizar los datos cuando los valores cambien
            refTablaCtrl.$onChanges = function (changes) {
                if (changes.elementoRelacional) {
                    refTablaCtrl.elementoRelacionalInt = $window.angular.copy(refTablaCtrl.elementoRelacional);
                }
                if (changes.valores) {
                    refTablaCtrl.valoresInt = $window.angular.copy(refTablaCtrl.valores);
                }
                if (changes.camposColumnas) {
                    refTablaCtrl.camposColumnasInt = $window.angular.copy(refTablaCtrl.camposColumnas);
                }
                if (changes.nombresColumnas) {
                    refTablaCtrl.nombresColumnasInt = $window.angular.copy(refTablaCtrl.nombresColumnas);
                }
                if (changes.autocompletarOpciones) {
                    refTablaCtrl.autocompletarOpcionesInt = $window.angular.copy(refTablaCtrl.autocompletarOpciones);
                }
            }

            // Permite abrir elemento seleccionado
            refTablaCtrl.abrirSeleccionado = function (valor) {
                var index = refTablaCtrl.valoresInt.indexOf(valor);
                var seleccionado = -1;
                if (valor.estado != pimcService.datosEstados.INSERTADO) {
                    var idNombre = pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacional];
                    seleccionado = valor.contenido[idNombre];
                }
                if (seleccionado != -1) {
                    pimcService.debug("Abriendo " + refTablaCtrl.elementoRelacional + seleccionado);
                    //TODO Enviar varios seleccionados
                    //TODO Preguntar si desea guardar cambios
                    $window.localStorage.setItem(idNombre, seleccionado);
                    $window.location.href = "#!/"+elementoRelacional;
                }
            }
        }]);
    
        tablaRefElementoRelacionalModule.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
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
        
            tablaRefElementoRelacionalModule.component('pimcRefTablaController', {
            bindings:{
                elementoRelacional: '<',
                valores:'<', // Input
                camposColumnas: '<',
                nombresColumnas: '<',
                autocompletarOpciones: '<',
                reportarCambio:'&' // Output
            },
            controller: 'comentariosComponentController',
            controllerAs: 'refTablaCtrl',
            templateUrl: 'views/documento/tablaRefElementoRelacional.html'
        });
    
    
    })(window.angular);