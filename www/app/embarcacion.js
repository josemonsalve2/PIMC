(function (angular) {

    'use strict';    

    var embarcacionPerfil = angular.module('embarcacionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    embarcacionPerfil.controller('embarcacionPerfilController', ['$scope', '$sce', '$q', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $q, $http, $window, $location, $filter, $timeout, uiGridConstants, i18nService ) {
        $scope.embarcacionID = -1;
        
        var init = function() {
            $scope.embarcacionID = $window.localStorage.getItem("embarcacionID");
            // If not set, redirect.
            if (!$scope.embarcacionID) {
                console.log("No hay embarcacionID");
                //TODO Enviar varios seleccionados
                $window.location.href = "#!/busqueda";
            } else {
                if (!$scope.datosGuardados) {
                    $scope.registrarAccion("Embarcacion <strong>" + $scope.embarcacionID + "</strong> ha sido cargado");
                } else {
                    $scope.registrarAccion("Embarcacion <strong>" + $scope.embarcacionID  + "</strong> ha sido guardado en la base de datos");
                    $scope.datosGuardados = false;
                }

                // Cargamoss los datos principales
                $scope.cargarDatosPrincipales();
                // Cargamos las anotaciones
                $scope.cargarNotas();
            }
        };
        
        
        //Datos principales
        $scope.datosPrincipales = {};

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipalesEditado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                //Obtener los datos JSON
                var embarcacionesDatos = data.data[0];
                
                //Log
                console.log(embarcacionesDatos);
                if (embarcacionesDatos) {
                    try {
                            
                            $scope.datosPrincipales = embarcacionesDatos;
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

                    }
                    catch(err) {
                        console.log("Problema cargando los valores de datos principales del personaje " + err.message);
                    }
                }
                //Limpiamos la bandera de editado
                $scope.datosPrincipalesEditado = false;
                
                // Funcion para datos editados
                $scope.editarDatoPrincipal = function(campo, valorNuevo) {
                    if (valorNuevo != $scope.datosPrincipales[campo]) {
                        $scope.registrarAccion(campo + "modificado");
                        $scope.datosPrincipalesEditado = true;
                    }
                };

                $scope.datosPrincipalesCargando = false;
            });
        };
        
        
        // REPARACIONES
        $scope.tablaReparaciones = {
        }
        $scope.reparacionesEditadas = false;
        $scope.tablaReparaciones.columnDefs = [{
            field: 'fecha',
            name: 'fecha',
            displayName: 'Fecha',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['editado']) {
                    classToReturn += " text-info ";
                }
                if (row.entity['reparacionID'] == -1) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'lugar',
            name: 'lugar',
            displayName: 'Lugar',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['editado']) {
                    classToReturn += " text-info ";
                }
                if (row.entity['reparacionID'] == -1) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'reparacion',
            name: 'reparacion',
            displayName: 'Nota de Reparación',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['editado']) {
                    classToReturn += " text-info ";
                }
                if (row.entity['reparacionID'] == -1) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            name: 'eliminar',
            displayName: '',
            width: 30,
            visible:false,
            cellTemplate: '<button class="btn btn-sm btn-danger" ng-click="grid.appScope.borrarReparaciones(row)">-</button>'
        }];
        $scope.tablaReparaciones.onRegisterApi = function (tablaAPI) {
            $scope.tablaReparacionesAPI = tablaAPI;
            tablaAPI.edit.on.afterCellEdit($scope, function(rowEntity,colDef) {
                if (rowEntity.reparacionID != -1) {
                    $scope.registrarAccion(colDef.name + " en reparacion <strong>" + rowEntity.reparacionID + "</strong> modificada");
                    rowEntity.editado = true;
                }
            });
        };
        $scope.cargarReparaciones = function() {
            $scope.reparacionesEditadas = false;
            $scope.reparacionesModificadas = {};
            $scope.reparacionesNuevas = {};
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesReparaciones',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                var reparaciones = data.data[0];
                if (reparaciones) {
                    $scope.tablaReparaciones.data = reparaciones;
                    for (var reparacion in $scope.tablaReparaciones.data) {
                        $scope.tablaReparaciones.data[reparacion].editado = false;
                    }
                }
            });
        };
        $scope.agregarReparacion = function () {
            $scope.reparacionesEditadas = false;
            var nuevaReparacion = {
                reparacionID: -1,
                embarcacionID: $scope.embarcacionID,
                fecha: new Date(),
                lugar: "",
                notaReparacion: "",
                editado: false
            };
            $scope.tablaReparaciones.data.push(nuevaReparacion);
            $scope.registrarAccion("Entrada agregada a tabla reparaciones");
            // We set is row selectable accordingly
            $scope.tablaReparaciones.isRowSelectable = function (row) {
                return $scope.borrarReparacionesActivado;
            }
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        };
        $scope.borrarReparaciones = function(row) {
            if (row.entity.reparacionID == -1) {
                $scope.registrarAccion("reparacion nueva eliminada");
            } else {
                $scope.registrarAccion("reparacion <strong> "+ row.entity.reparacionID +" </strong> nueva eliminada");
            }
            var index = $scope.tablaReparaciones.data.indexOf(row.entity);
            $scope.tablaReparaciones.data.splice(index,1);
        };
        $scope.cambiarBorrarReparaciones = function (esActivo) {
            $scope.tablaReparaciones.columnDefs[3].visible = esActivo;
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        
        // PARA LISTADOS
        $scope.listados = {mensaje:"+ Agregar"};
        // Para borrar listaNombres
        $scope.listados.modificarBorrar = function(listadoNombre, lista, indexEditado, valor) {
            if (valor == "") {
                var valorAEliminar = lista[indexEditado];
                if (valorAEliminar != "") {
                    $scope.registrarAccion(listadoNombre + "<strong>" + valorAEliminar + "</strong> eliminado");
                    $scope.datosPrincipalesEditado = true;
                }
                lista.splice(indexEditado, 1);
            } else {
                var valorModificado = lista[indexEditado];
                if (valor != valorModificado) {
                    $scope.registrarAccion(listadoNombre + "<strong>" + valorModificado + "</strong> Modificado a <strong>" + valor + "</strong>");
                    lista[indexEditado] = valor;
                    $scope.datosPrincipalesEditado = true;
                }
            }
        }
        $scope.listados.agregarALista = function(listadoNombre, lista, elemento) {
            if (!lista.includes(elemento) && elemento.length != 0) {
                lista.push(elemento);
                $scope.registrarAccion(listadoNombre + "<strong>" + elemento + "</strong> agregado");
                $scope.datosPrincipalesEditado = true;
            }
        }
        $scope.listados.borrarOnShow = function() {
            $scope.listados.mensaje = "";
        };
        $scope.listados.volverPrincipal = function(listadoNombre, lista, indice) {
            var tmp = lista[0];
            lista[0] = lista[indice];
            lista[indice] = tmp;
            $scope.registrarAccion(listadoNombre + "<strong>" + lista[0] + "</strong> principal");
            $scope.datosPrincipalesEditado = true;
        }
        
        // Definiciones de las pestañas de la aplicación. 
        $scope.tabs = new Map();
        $scope.tabsArray = [];

        // Estas funciones son para agregar y quitar pestañas
        $scope.abrirElemento = function(ElementoId) {
            if (!$scope.tabs.has(ElementoId)) {
            $scope.tabs.set(ElementoId, {
                title: 'ComisionSeleccionada' + ($scope.tabs.size + 1),
                tabIndex: ($scope.tabs.size + 1),
                content: 'Esta es la ruta' + ElementoId,
                active: true
            });
            }
            $scope.tabsArray = Array.from($scope.tabs);
        };
        $scope.cerrarElemento = function(ElementoId) {
            if ($scope.tabs.has(ElementoId)) {
            $scope.tabs.delete(ElementoId);
            }
            $scope.tabsArray = Array.from($scope.tabs);
        }



        // Tabla datos secundarios
        $scope.filtroDropdownContenido = ['Todos', 'Velámen', 'Arboladura y otras piezas', 'Armas, municiones y artefactos de fuego']; //TODO fill this whenever the data arrives to the application
        $scope.valorFiltroCategoria = "Todos";
        $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
            return 'header-filtered';
            } else {
            return '';
            }
        };

        $scope.tablaDatosSecundarios = {};
        $scope.tablaDatosSecundarios.onRegisterApi = function(gridApi) {
            $scope.DatosSecundariosGridApi = gridApi;
            $scope.DatosSecundariosGridApi.grid.registerRowsProcessor($scope.filtroCategorias, 200);
        };
        $scope.tablaDatosSecundarios.columnDefs = [{
            field: 'categoria',
            name: 'categoria',
            displayName: 'Categoria'
        }, {
            field: 'elemento',
            name: 'elemento',
            displayName: 'Elemento'
        }, {
            field: 'cantidad',
            name: 'cantidad',
            displayName: 'Cantidad',
            type: 'number'
        }, {
            field: 'unidades',
            name: 'unidades',
            displayName: 'Unidades'
        }, {
            field: 'fechaAdicion',
            name: 'fechaAdicion',
            displayName: 'Fecha Adicion',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"'
        }, {
            field: 'fechaRemocion',
            name: 'fechaRemocion',
            displayName: 'Fecha Remocion',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"'
        }];
        $scope.tablaDatosSecundarios.data = [{
            "categoria": "Armas, municiones y artefactos de fuego",
            "elemento": "Cañón",
            "cantidad": "3",
            "unidades": "Cañones",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }, {
            "categoria": "Velámen",
            "elemento": "Palo de mesana",
            "cantidad": "3",
            "unidades": "Palos",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }, {
            "categoria": "Arboladura y otras piezas",
            "elemento": "Cañón",
            "cantidad": "3",
            "unidades": "Cañones",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }, {
            "categoria": "Armas, municiones y artefactos de fuego",
            "elemento": "Cañón",
            "cantidad": "3",
            "unidades": "Cañones",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }, {
            "categoria": "Velámen",
            "elemento": "Palo de mesana",
            "cantidad": "3",
            "unidades": "Palos",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }, {
            "categoria": "Arboladura y otras piezas",
            "elemento": "Cañón",
            "cantidad": "3",
            "unidades": "Cañones",
            "fechaAdicion": "02-04-1990",
            "fechaRemocion": "04-02-1990"
        }];

        $scope.filtrar = function(valorSeleccionado) {
            $scope.valorFiltroCategoria = valorSeleccionado;
            $scope.DatosSecundariosGridApi.grid.refresh();
        };
        $scope.filtroCategorias = function(renderableRows) {
            if ($scope.valorFiltroCategoria == "Todos") {
            renderableRows.forEach(function(row) {
                row.visible = true;
            });
            return renderableRows;
            }
            var matcher = new RegExp($scope.valorFiltroCategoria);
            renderableRows.forEach(function(row) {
            if (!row.entity['categoria'].match(matcher)) {
                row.visible = false;
            }
            });
            return renderableRows;
        };
        

        // Tabla hoja de servicio y personal
        $scope.tablaHojaServicioPersonal = {};
        $scope.tablaHojaServicioPersonal.columnDefs = [{
            field: 'id',
            name: "id",
            display: "id",
            hidden: true
        }, {
            field: 'lugarPartida',
            name: 'Lugar de Partida',
            displayName: 'Lugar de Partida'
        }, {
            field: 'fechaPartida',
            name: 'Fecha de Partida',
            displayName: 'Fecha de Partida',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"'
        }, {
            field: 'lugarLlegada',
            name: 'Lugar de Llegada',
            displayName: 'Lugar de Llegada'
        }, {
            field: 'fechaLlegada',
            name: 'Fecha de Llegada',
            displayName: 'Fecha de Llegada',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"'
        }];
        $scope.tablaHojaServicioPersonal.enableRowSelection = true;
        $scope.tablaHojaServicioPersonal.multiSelect = false;
        $scope.tablaHojaServicioPersonal.noUnselect = true;
        $scope.tablaHojaServicioPersonal.enableRowHeaderSelection = false;
        $scope.tablaHojaServicioPersonal.onRegisterApi = function(gridApi) {
            $scope.hojaServicioGridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            var id = row.entity["id"];
            $scope.abrirElemento(id);
            });
        }

        // Para guardar borrar y barra de estado
        $scope.ultimaAccion = $sce.trustAsHtml("Ninguna");
        // Log
        $scope.registrarAccion = function(mensaje) {
            $scope.ultimaAccion = $sce.trustAsHtml(mensaje);
            console.log(mensaje)
        }
        // Button functions
        $scope.borrarCambios = function() {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                $scope.registrarAccion("Los cambios han sido borrados");
                init();
            }
        };
        
        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesNotas', 
            {
                params:{
                    embarcacionID:$scope.embarcacionID
                }
            }).then(function(data) {
                if (!String(data.data).startsWith("[WARNING]")) {
                    $scope.notas = data.data;
                    $scope.notas.forEach(function(nota) {
                        nota.modificada = false;
                    });
                    // LOG
                    console.log($scope.notas);
                }
            });

        };
        $scope.agregarNotaVacia = function() {
            $scope.registrarAccion("Nota vacia agregada");
            // Una nota que no tiene fecha de creacion es una nota que no existe en la base de datos aun
            if ($scope.notas === "") {
                $scope.notas = [{
                    nota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: "",
                    modificada: false
                }];
            } else {
                $scope.notas.push({
                    nota: "",
                    referencia: "",
                    fechaCreacion: "",
                    fechaHistorica: "",
                    fechaHistFormato: "",
                    modificada: false
                });
            }
            $scope.notasCambios = true;
        }
        $scope.eliminarNota = function(indexNota) {
            $scope.registrarAccion("Nota <strong>" + indexNota + "</strong> eliminada");
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notasAEliminar.push($scope.notas[indexNota]);
            }
            $scope.notas.splice(indexNota, 1);
            $scope.notasCambios = true;
        };
        $scope.modificarNota = function(indexNota, nuevaNota) {
            $scope.registrarAccion("Nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].nota = nuevaNota;
            // fecha creacion esta vacia cuando la nota aun no se encuentra
            // en la base de dats
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            };
            $scope.notasCambios = true;
        };
        $scope.modificarReferencia = function(indexNota, nuevaReferencia) {
            $scope.registrarAccion("Referencia de nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].referencia = nuevaReferencia;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;
        };
        $scope.modificarFechaHistorica = function(indexNota, nuevaFechaHistorica) {
            $scope.registrarAccion("Fecha Historica de nota <strong>" + indexNota + "</strong> modificada");
            $scope.notas[indexNota].fechaHistorica = nuevaFechaHistorica;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;
        };


        //TODO DELETE THIS
        $scope.tablaHojaServicioPersonal.data = [{
            "id": "0",
            "lugarPartida": "cartagena",
            "fechaPartida": "02-04-1990",
            "lugarLlegada": "españa",
            "fechaLlegada": "02-04-2000"
        }, {
            "id": "1",
            "lugarPartida": "cartagena",
            "fechaPartida": "02-04-1990",
            "lugarLlegada": "españa",
            "fechaLlegada": "02-04-2000"
        }, {
            "id": "2",
            "lugarPartida": "cartagena",
            "fechaPartida": "02-04-1990",
            "lugarLlegada": "españa",
            "fechaLlegada": "02-04-2000"
        }, {
            "id": "3",
            "lugarPartida": "cartagena",
            "fechaPartida": "02-04-1990",
            "lugarLlegada": "españa",
            "fechaLlegada": "02-04-2000"
        }];

        // Para guardar borrar y barra de estado
        $scope.ultimaAccion = $sce.trustAsHtml("Ninguna");
        // Log
        $scope.registrarAccion = function(mensaje) {
            $scope.ultimaAccion = $sce.trustAsHtml(mensaje);
            console.log(mensaje)
        }
        // Button functions
        $scope.borrarCambios = function() {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                $scope.registrarAccion("Los cambios han sido borrados");
                init();
            }
        };
        
        $scope.datosGuardados = false;
        $scope.guardarCambios = function() {
            var conexiones = {};
            //Revisamos datos principales editados
            if ($scope.datosPrincipalesEditado) {
                $scope.registrarAccion("Actualizando BD Embarcaciones");
                var request = 'http://monsalvediaz.com:5000/PIMC0.1/Modificar/Embarcaciones'
                var parametros = {
                    idUnico:'embarcacionID',
                    embarcacionID:$scope.embarcacionID
                }
                
                var agregado = false;
                for (var key in $scope.datosPrincipales) {
                    var value = $scope.datosPrincipales[key];
                    if ((key == 'nombres' || key == 'alias' || key == 'usos')  && value.length != 0) {
                        parametros[key] = "'" + value.join(", ") + "'";
                        agregado = true;
                    } else if (value != null && value != "" ) {
                        if (typeof value === 'string') {
                            parametros[key] = "'" + value + "'";
                        } else {
                            parametros[key] = value;
                        }
                        agregado = true;
                    }                          
                };
                
                if (agregado) {
                    conexiones['datosPrincipalesModificados'] = $http.get(request,{params:parametros});
                }
            }
            // Anotaciones
            if ($scope.notasCambios) {
                $scope.registrarAccion("Actualizando BD notasEmbarcaciones");
                $scope.notasCambios = false;
                $scope.notas.forEach(function(nota) {
                    // Insertamos notas nuevas
                    if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                        conexiones['notasCambiosInsertar'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/EmbarcacionesNotas',
                                    {params:{
                                        embarcacionID: $scope.embarcacionID,
                                        nota: "'" + nota.nota + "'",
                                        referencia:"'" + nota.referencia + "'"
                                    }}
                        );
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        conexiones['notasCambiosModificar'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/EmbarcacionesNotas',
                                    {params:{
                                        idUnico2:'embarcacionID',
                                        idUnico:'notaID',
                                        notaID:nota.notaID,
                                        embarcacionID:$scope.embarcacionID,
                                        nota:"'" + nota.nota + "'",
                                        referencia:"'" + nota.referencia + "'"
                                    }}
                        );
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function(nota) {
                    conexiones['notasCambiosEliminar'] = $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/EmbarcacionesNotas',
                                {params:{
                                idUnico2:'embarcacionID',
                                idUnico:'notaID',
                                notaID:nota.notaID,
                                embarcacionID:$scope.embarcacionID
                                }}
                    );
                });
            }
            
            // Incializamos todo
            if (Object.keys(conexiones).length != 0) {
                $scope.datosPrincipalesCargando = true;
                $scope.datosGuardados = true;
                $q.all(conexiones).then( function(responses) {
                    for (var res in responses) {
                        console.log(res + ' = ' + responses[res].data);
                    }
                    init();
                });
            }
        };
        
        // Initializacion inicial
        init();
        
    }]);

})(window.angular);