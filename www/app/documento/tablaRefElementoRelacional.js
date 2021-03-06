(function (angular) {
    
        'use strict';
    
        var tablaRefElementoRelacionalModule = angular.module('documentoPerfil');
    
        // Service para comentarios. Cargar y guardar referenciasElementos
        tablaRefElementoRelacionalModule.service('pimcTablaRefElementoService', ['$http', '$q', 'pimcService','pimcBarraEstadoService', function ($http, $q, pimcService, pimcBarraEstadoService) {
            var tablaRefElementoServiceCtrl = this;

            tablaRefElementoServiceCtrl.cargarElementos = function (elementoRelacional, documentoID) {
                var UrlConsultaReferencias = pimcService.crearURLOperacion('ConsultarTodos', "DocumentosRef" + elementoRelacional);

                // filtramos por documentoID
                var parametros = {};
                parametros.documentoID = documentoID;

                // obtenemos todas las referencias
                return $http.get(UrlConsultaReferencias, { params: parametros }).then(function (data) {
                    var elementos = [];
                    var conexiones = [];
                    
                    // revisar si existe alguno
                    if (Object.keys(data.data).length != 0) {
                        var referenciasTodas = data.data;
                        referenciasTodas.forEach(function (referencia) {
                            var UrlConsultaElementos = pimcService.crearURLOperacion('Consulta', elementoRelacional);

                            var parametros = {};
                            var idNombre = pimcService.idElementoRelaciona[elementoRelacional];
                            parametros[idNombre] = referencia[idNombre];

                            // Obtenemos todos los datos de la referencia
                            conexiones.push($http.get(UrlConsultaElementos, { params: parametros }).then(function (data) {
                                // Obtenemos la informacion
                                var datosContenido = data.data[0];

                                // Creamos el nuevo elemento
                                var nuevoElemento = {};
                                nuevoElemento.referenciaID = referencia.referenciaID;
                                nuevoElemento.estado = pimcService.datosEstados.LIMPIO;
                                nuevoElemento.contenido = datosContenido;
                                nuevoElemento.referencia = "";
                                nuevoElemento.comentario = "";
                                elementos.push(nuevoElemento);
                            }));
                        }); 
                    }
                    return $q.all(conexiones).then(function (data) {
                        // LOG
                        pimcService.debug(elementos);
                        return elementos;
                    });
                });
            };
    
            tablaRefElementoServiceCtrl.guardarElementos = function(elementoRelacional, documentoID, elementos) {
                pimcService.debug("Guardando tabla de referencia para " + elementoRelacional);
                var conexiones = [];
                // Realizamos cambios de acuerdo al estado
                angular.forEach(elementos, function(elementoGuardar) {
                    // Limpiamos el contenido, quitamos informacion no subministrada
                    angular.forEach(elementoGuardar.contenido, function(val, key) {
                        if (!val || val.length === 0) {
                            delete elementoGuardar.contenido[key]; // Eliminamos valores vacios
                        }
                    });
                    // Insertamos elementos nuevos
                    if (elementoGuardar.estado === pimcService.datosEstados.INSERTADO) {
                        // Evitar elementos vacias
                        if (Object.keys(elementoGuardar.contenido).length === 0) {
                            return;
                        }
                        // Obtenemos URL de consulta
                        var URLInsertarElemento = pimcService.crearURLOperacion('Insertar', elementoRelacional);
                        conexiones.push($http.post(URLInsertarElemento, elementoGuardar.contenido).then(function (valorInsertado) {
                            // Una vez creado el elemento podemos agregar la entrada
                            if (Object.keys(valorInsertado.data).length != 0) {
                                var nuevoElemento = valorInsertado.data[0];
                                var idNombre = pimcService.idElementoRelaciona[elementoRelacional];

                                // Revisamos que si exista un ID
                                if (nuevoElemento[idNombre]) {
                                    var URLInsertarRelacion = pimcService.crearURLOperacion('Insertar', 'DocumentosRef' + elementoRelacional);
                                    var relacionContenido = {};
                                    relacionContenido['documentoID'] = documentoID;
                                    relacionContenido[idNombre] = nuevoElemento[idNombre];
                                    relacionContenido.comentario = elementoGuardar.comentario;
                                    relacionContenido.referencia = elementoGuardar.referencia;
                                    return $http.post(URLInsertarRelacion, relacionContenido);
                                }
                                return $q.reject("Error guardando la nueva referencia. El elemento fue creado"); // No deberia pasar
                            }
                        }));
                    } else if (elementoGuardar.estado === pimcService.datosEstados.MODIFICADO) {
                        // Esto quiere decir que el elemento existe en la base de datos pero 
                        // la relacion no. Hay que simplemente agregar la relacion
                        var idNombre = pimcService.idElementoRelaciona[elementoRelacional];

                        // Revisamos que si exista un ID
                        if (elementoGuardar.contenido[idNombre]) {
                            var URLInsertarRelacion = pimcService.crearURLOperacion('Insertar', 'DocumentosRef' + elementoRelacional);
                            var relacionContenido = {};
                            relacionContenido['documentoID'] = documentoID;
                            relacionContenido[idNombre] = elementoGuardar.contenido[idNombre];
                            relacionContenido.comentario = elementoGuardar.comentario;
                            relacionContenido.referencia = elementoGuardar.referencia;
                            conexiones.push($http.post(URLInsertarRelacion, relacionContenido));
                        }
                    } else if (elementoGuardar.estado === pimcService.datosEstados.ELIMINADO) {
                        // Obtenemos URL de consulta
                        var URLEliminar = pimcService.crearURLOperacion('Eliminar', 'DocumentosRef' + elementoRelacional);
                        var config = {
                            params: {
                                referenciaID: elementoGuardar.referenciaID
                            }
                          }
                        conexiones.push($http.delete(URLEliminar, config));
                    };
                });
                if (conexiones.length != 0) {
                    pimcBarraEstadoService.registrarAccion(elementoRelacional + " guardados");                    
                    return $q.all(conexiones).then(function (responses) {
                        for (var res in responses) {
                            pimcService.debug(res + ' = ' + responses[res].data);
                        }
                        return true;
                    }, function (response) {
                        pimcService.debug("[ERROR][GUARDANDO REF = " + elementoRelacional + "] " + response);
                        return $q.reject("Error en tabla referencia " +  elementoRelacional + " elementos relacional");
                    });
                } else {
                    return false;
                }
            };

            tablaRefElementoServiceCtrl.autocompletarElemento = function (elementoRelacional, campoAutocompletar, hint) {
                var urlAutocompletar = pimcService.crearURLOperacion('ConsultarTodos', elementoRelacional);
                var parametros = {};
                if (campoAutocompletar) {
                    parametros[campoAutocompletar] = hint;
                };
                return $http.get(urlAutocompletar, { params: parametros }).then(function (data) {
                    var listaElementosSimilares = [];
                    var resultados = data.data;
                    var matchPerfecto = false;
                    if (Object.keys(resultados).length != 0) {
                        resultados.forEach(function (valor) {
                            listaElementosSimilares.push(valor);
                            // Revisamos si son identicos
                            // TODO cambiar acentos 
                            if (String(hint).toLowerCase().replace(/\s/g, '') == String(valor[campoAutocompletar]).toLowerCase().replace(/\s/g, ''))
                                matchPerfecto = true;
                        })
                    }
                    // Queremos que lo que este escribiendo la persona siempre salga de primero, a no ser
                    // que ya exista en la base de datos perfectamente, para no crear duplicados
                    if (!matchPerfecto && listaElementosSimilares.length != 0) {
                        var nuevoElemento = {};
                        nuevoElemento[campoAutocompletar] = hint;
                        listaElementosSimilares.unshift(nuevoElemento)
                    }
                    return listaElementosSimilares;
                });
            }
        }]);
    
        tablaRefElementoRelacionalModule.controller('pimcRefTablaController', 
            ['pimcService', 
            'pimcBarraEstadoService',
            'pimcMenuService', 
            'pimcTablaRefElementoService', 
            '$window',
            '$filter',
            function (pimcService, pimcBarraEstadoService, pimcMenuService, pimcTablaRefElementoService, $window, $filter) {
            var refTablaCtrl = this;
            refTablaCtrl.valoresInt = [];
            refTablaCtrl.activarBorrarExistentes = false;
            refTablaCtrl.elementoRelacionalInt = "";
            refTablaCtrl.camposColumnasInt = [];
            refTablaCtrl.nombresColumnasInt = {};
            refTablaCtrl.tipoColumnasInt = {};
            refTablaCtrl.autocompletarOpcionesInt = {
                minLength: 3,
                delay: 100,
                camposAutocompletar: []
            };

            // Formatos fechas
            refTablaCtrl.formatearFecha = function(valor, campo) {
                var formato = valor.contenido[campo + "Formato"];
                formato = pimcService.fechasFormatosVisualizacion[formato];
                var fecha = moment.utc(valor.contenido[campo]).toDate();
                return $filter('date')(fecha, formato);
            };

            // Para efectos en autocompletar
            refTablaCtrl.cargandoValores = false;
            refTablaCtrl.noExistenValores = false;

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
                if (changes.tipoColumnas) {
                    refTablaCtrl.tipoColumnasInt = $window.angular.copy(refTablaCtrl.tipoColumnas);
                }
                if (changes.autocompletarOpciones) {
                    refTablaCtrl.autocompletarOpcionesInt = $window.angular.copy(refTablaCtrl.autocompletarOpciones);
                    // Nos aseguramos de que hayan valores por defecto
                    if (!refTablaCtrl.autocompletarOpcionesInt) refTablaCtrl.autocompletarOpcionesInt = {};
                    if (!refTablaCtrl.autocompletarOpcionesInt.camposAutocompletar) refTablaCtrl.autocompletarOpcionesInt.camposAutocompletar = [];
                    if (!refTablaCtrl.autocompletarOpcionesInt.delay) refTablaCtrl.autocompletarOpcionesInt.delay = 300;
                    if (!refTablaCtrl.autocompletarOpcionesInt.minLength) refTablaCtrl.autocompletarOpcionesInt.minLength = 3;
                }
            }

            // Permite abrir elemento seleccionado
            refTablaCtrl.abrirSeleccionado = function (valor) {
                // Obtenemos las columnas de ID y de nombre
                var idColumna =
                    pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacionalInt];
                var seleccionado = valor.contenido[idColumna];
                var nombreColumna =
                    pimcService.nombreColElementoRelacional[refTablaCtrl.elementoRelacionalInt];

                // Obtenemos el index del elemento seleccioando
                var index = refTablaCtrl.valoresInt.indexOf(valor);
                var seleccionado = -1;
                if (valor.estado != pimcService.datosEstados.INSERTADO) {                    
                    seleccionado = valor.contenido[idColumna];
                }
                if (seleccionado != -1) {
                    pimcService.debug("Abriendo " + refTablaCtrl.elementoRelacionalInt + " " + seleccionado);
                    pimcMenuService.abrirElemento(refTablaCtrl.elementoRelacionalInt, valor.contenido[idColumna], valor.contenido[nombreColumna], true);
                }
            }

            // Retorna si el estado es limpio o no 
            refTablaCtrl.estadoEsLimpio = function (valor) {
                // Usamos LIMPIO para elementos que simplemente estan en la base de datos
                return (valor.estado == pimcService.datosEstados.LIMPIO);
            }

            // Borrar una referencia. Marcar o eliminar de acuerdo a si existe en la 
            // base de datos o no 
            refTablaCtrl.borrar = function (valor) {
                var index = refTablaCtrl.valoresInt.indexOf(valor);
                pimcService.debug("Borrando " + refTablaCtrl.elementoRelacionalInt);
                
                // Borrar existentes. Requiere accion en la base de datos
                if (valor.estado == pimcService.datosEstados.LIMPIO) {
                    var idNombre = pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacionalInt];
                    var seleccionado = valor.contenido[idNombre];
                    // Usamos ELIMINADO para relaciones que hay que borrar de la base de datos despues
                    refTablaCtrl.valoresInt[index].estado = pimcService.datosEstados.ELIMINADO;
                    pimcBarraEstadoService.registrarAccion(" Referencia a " + refTablaCtrl.elementoRelacionalInt + " " + seleccionado + " eliminada ");
                } else if (valor.estado == pimcService.datosEstados.INSERTADO || valor.estado == pimcService.datosEstados.MODIFICADO) {
                    refTablaCtrl.valoresInt.splice(index, 1);
                    pimcBarraEstadoService.registrarAccion(" Referencia a " + refTablaCtrl.elementoRelacionalInt + " eliminada ");
                }
                refTablaCtrl.reportarCambio({valores: refTablaCtrl.valoresInt});
            }

            // revisa si el campo que se envia deberia tener autocompletar
            refTablaCtrl.validarAutocompeltar = function (campo) {
                if (refTablaCtrl.autocompletarOpcionesInt) {
                    // Si retorna -1 quiere decir que no hace parte de la lista de autocompletar
                    return refTablaCtrl.autocompletarOpcionesInt.camposAutocompletar.indexOf(campo) != -1;
                } else {
                    return false;
                }
            }

            refTablaCtrl.autocompletarElemento = function (campo, valorActual) {
                return pimcTablaRefElementoService.autocompletarElemento(refTablaCtrl.elementoRelacionalInt, campo, valorActual)
                    .then(function (posiblesValores) {
                        var valores = [];
                        var idNombre = pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacionalInt];                        
                        if (posiblesValores) {
                            angular.forEach(posiblesValores, function(valor) {
                                // Revisamos si ya existe
                                var yaExiste = false;
                                angular.forEach(refTablaCtrl.valoresInt, function (existente) {
                                    // Si esta en los elementos eliminados igual deberia aparecer en la lista
                                    if (existente.estado != pimcService.datosEstados.ELIMINADO &&
                                         valor[idNombre] && 
                                         valor[idNombre] == existente.contenido[idNombre])
                                        yaExiste = true;
                                });
                                if (!yaExiste) {
                                    valores.push(valor);
                                }
                            });
                            return valores;
                        } else {
                            return [];
                        }
                    })
            }

            // Actualizar valores
            refTablaCtrl.seleccionAutocompletar = function (valor, nuevoValor) {
                var idNombre = pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacionalInt];                        
                // Revisamos si la seleccion existe en la base de datos                
                if (nuevoValor[idNombre]) {
                    valor.contenido = nuevoValor;
                    // Usamos MODIFICADO para elementos que existen en la base de datos
                    // Pero que no tenemos que crear un nuevo personaje
                    valor.estado = pimcService.datosEstados.MODIFICADO;
                    pimcBarraEstadoService.registrarAccion(" Referencia" + valor.contenido[idNombre] + " a " + refTablaCtrl.elementoRelacionalInt + " agregada.");
                }
                refTablaCtrl.reportarCambio({valores: refTablaCtrl.valoresInt});
            }

            // Agregar nuevo
            refTablaCtrl.agregarNuevo = function () {
                var nuevoElemento = {};
                // Usamos INSERTADO para elementos que no existen en la base de datos y es necesario crear
                // una nueva entrada perimero antes de agregarlos a la base de datos
                nuevoElemento.estado = pimcService.datosEstados.INSERTADO;
                nuevoElemento.contenido = {};
                angular.forEach(refTablaCtrl.camposColumnasInt, function(val) {
                    nuevoElemento.contenido[val] = "";
                });
                nuevoElemento.referenciaID = -1;
                nuevoElemento.comentario = "";
                nuevoElemento.referencia = "";
                refTablaCtrl.valoresInt.push(nuevoElemento);
                refTablaCtrl.reportarCambio({valores: refTablaCtrl.valoresInt});                
            }

            // Reportar cambios de alguno de los datos de un elemento nuevo
            refTablaCtrl.reportarCambioNuevo = function () {
                refTablaCtrl.reportarCambio({valores: refTablaCtrl.valoresInt});                
            }

            // Para tipos de colimnas 

            // Los diferentes tipos definidos. Por defecto 
            // todo es Texto.
            refTablaCtrl.tiposColumnas = {
                TEXTO: 0,
                DATE: 1,
                LUGAR: 2,
                propiedades: {
                    0: { nombre: 'Texto', value: 0, code: 'T' },
                    1: { nombre: 'Date', value: 1, code: 'D' },
                    2: { nombre: 'Lugar', value: 2, code: 'L' },
                }
            };  

            // Clasifica el tipo de columna de acuerdo a lo que especifique el usuario
            refTablaCtrl.obtenerTipoColumna = function(campo) {
                if (refTablaCtrl.tipoColumnasInt) {
                    var tipoCol = refTablaCtrl.tipoColumnasInt[campo];
                    if (tipoCol) {
                        if (tipoCol === refTablaCtrl.tiposColumnas.DATE ||
                            tipoCol === refTablaCtrl.tiposColumnas.propiedades[1].nombre ||
                            tipoCol === refTablaCtrl.tiposColumnas.propiedades[1].code)
                            return refTablaCtrl.tiposColumnas.DATE;
                        else if (tipoCol === refTablaCtrl.tiposColumnas.LUGAR ||
                            tipoCol === refTablaCtrl.tiposColumnas.propiedades[2].nombre ||
                            tipoCol === refTablaCtrl.tiposColumnas.propiedades[2].code)
                            return refTablaCtrl.tiposColumnas.LUGAR;
                        else
                            return refTablaCtrl.tiposColumnas.TEXTO;
                    } else {
                        return refTablaCtrl.tiposColumnas.TEXTO;                        
                    }
                } else {
                    return refTablaCtrl.tiposColumnas.TEXTO;
                }

            }

            // Revisamos si la columan es texto
            refTablaCtrl.columnaEsTexto = function (campo) {
                return refTablaCtrl.obtenerTipoColumna(campo) === refTablaCtrl.tiposColumnas.TEXTO;
            }

            // Revisamos si la columna es fecha
            refTablaCtrl.columnaEsDate = function (campo) {
                return refTablaCtrl.obtenerTipoColumna(campo) === refTablaCtrl.tiposColumnas.DATE;
            }

            // Revisamos si la columna es lugar
            refTablaCtrl.columnaEsLugar = function (campo) {
                return refTablaCtrl.obtenerTipoColumna(campo) === refTablaCtrl.tiposColumnas.LUGAR;
            }

            refTablaCtrl.fechaEditada = function (fecha, formato, valor, campo) {
                valor.contenido[campo] = fecha;
                valor.contenido[campo + "Formato"] = formato;
            }

        }]);
    

        // FILTROS PARA LA LISTA
        tablaRefElementoRelacionalModule.filter('filtrosExistentesNuevasRef', ['pimcService', function (pimcService) {
            return function (elemento) {
                if (!elemento) return [];
                var filtrados = [];
                angular.forEach(elemento, function (val, key) {
                    if (val.estado == pimcService.datosEstados.LIMPIO || val.estado == pimcService.datosEstados.MODIFICADO) {
                        filtrados.push(val);
                    }
                });
                return filtrados;
            }
        }]);
        tablaRefElementoRelacionalModule.filter('filtroNuevos', ['pimcService', function (pimcService) {
            return function (elemento) {
                if (!elemento) return [];
                var filtrados = [];
                angular.forEach(elemento, function (val, key) {
                    if (val.estado == pimcService.datosEstados.INSERTADO) {
                        filtrados.push(val);
                    }
                });
                return filtrados;
            }
        }]);
        
            tablaRefElementoRelacionalModule.component('pimcTablaRefElementoRelacional', {
            bindings:{
                elementoRelacional: '<',
                valores:'<', // Input
                camposColumnas: '<',
                nombresColumnas: '<',
                tipoColumnas: '<',
                autocompletarOpciones: '<',
                reportarCambio:'&' // Output
            },
            controller: 'pimcRefTablaController',
            controllerAs: 'refTablaCtrl',
            templateUrl: 'views/documento/tablaRefElementoRelacional.html'
        });
    
    
    })(window.angular);