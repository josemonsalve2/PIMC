(function (angular) {

    'use strict';    

    var embarcacionPerfil = angular.module('embarcacionPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    
    embarcacionPerfil.controller('embarcacionPerfilController', ['$scope', 'pimcMenuService', '$q', '$http', '$window', '$filter', 'uiGridConstants', 'i18nService', 'crearLugarTerritorio','pimcService', 'pimcComentarios', 'pimcBarraEstadoService', function($scope, pimcMenuService, $q, $http, $window, $filter,  uiGridConstants, i18nService, crearLugarTerritorio, pimcService, pimcComentarios, pimcBarraEstadoService  ) {
        $scope.embarcacionID = -1;
        
        $scope.datosEstados = {
            LIMPIO: 0,
            MODIFICADO: 1,
            INSERTADO: 2,
            ELIMINADO: 3,
            propiedades: {
                0: {nombre:'Limpia', value: 0, code: 'L'},
                1: {nombre:'Modificada', value: 1, code: 'M'},
                2: {nombre:'Insertada', value: 2, code: 'I'},
                3: {nombre:'Eliminada', value: 3, code: 'E'}
            }
        };
        $scope.valorDatoNuevo = "<<Nuevo>>";
        
        var init = function() {
            var embarcacionSeleccionada = pimcMenuService.obtenerElementoSeleccionado("Embarcaciones");
            // If not set, redirect.
            if (!embarcacionSeleccionada) {
              pimcService.debug("No hay una embarcacion seleccionado");
              //TODO Enviar varios seleccionados
              $window.location.href = "#!/";
            } else {
              $scope.embarcacionID = embarcacionSeleccionada.id;
                if (!$scope.datosGuardados) {
                    pimcBarraEstadoService.registrarAccion("Embarcacion <strong>" + $scope.embarcacionID + "</strong> ha sido cargado");
                } else {
                    pimcBarraEstadoService.registrarAccion("Embarcacion <strong>" + $scope.embarcacionID  + "</strong> ha sido guardado en la base de datos");
                    $scope.datosGuardados = false;
                }

                // Cargamoss los datos principales
                $scope.cargarDatosPrincipales();
                // Cargamos las anotaciones
                $scope.cargarNotas();
                // Cargamos las reparaciones
                $scope.cargarReparaciones();
                // Cargamos datos secundarios
                $scope.cargarDatosSecundarios();
            }
        };
        
        // Funcion para lugares y territorios
        $scope.autocompletarLugarTerritorio = function (hintLugarTerritorio) {
            var promiseLugar = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Autocompletar/Lugares', {
                params: {
                    nombre: hintLugarTerritorio
                }
            });
            var promiseTerritorios = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Autocompletar/Territorios', {
                params: {
                    nombre: hintLugarTerritorio,
                    otrosNombres: hintLugarTerritorio
                }
            });
            
            return $q.all([promiseLugar, promiseTerritorios]).then( function(responses) {
                var listaLugaresTerritorios = [];
                var matchPerfecto = false;
                for (var res in responses) {
                    var resultados = responses[res].data;
                    if (resultados != "0") {
                        resultados.forEach( function (valor) {
                            var elementoAInsertar = {nombre: '',nombreMostrar: '',lugarTerritorioID: -1, lugarOTerritorio: ''}

                            // Para el nombre
                            if (valor.nombre) {
                                elementoAInsertar.nombre = valor.nombre;
                            } else if (valor.otrosNombres && valor.otrosNombres != "") {
                                var listaOtrosNombres = valor.otrosNombres.split(",");
                                listaOtrosNombres = listaOtrosNombres.map(function(e) {
                                    var nombre = e.trim();
                                    var matcher = new RegExp(hintLugarTerritorio);
                                    if (nombre.match(matcher)) {
                                        elementoAInsertar.nombre = nombre;
                                    }
                                });
                            }

                            // Para el lugarTerritorioID
                            if (valor.lugarID) {
                                elementoAInsertar.lugarTerritorioID = valor.lugarID;
                                elementoAInsertar.lugarOTerritorio = 'lugar';
                                elementoAInsertar.nombreMostrar = '(L) ' + elementoAInsertar.nombre;
                            } else if (valor.territorioID) {
                                elementoAInsertar.lugarTerritorioID = valor.territorioID;
                                elementoAInsertar.lugarOTerritorio = 'territorio';                               elementoAInsertar.nombreMostrar = '(T) ' + elementoAInsertar.nombre;
                            }
                            listaLugaresTerritorios.push(elementoAInsertar);
                        });
                    }
                }
                listaLugaresTerritorios.push({nombre: hintLugarTerritorio, nombreMostrar: "(Insertar) " + hintLugarTerritorio, lugarTerritorioID: -1, lugarOTerritorio: 'insertar'});
                return listaLugaresTerritorios;
            }); 
        };
        
        $scope.seleccionarLugarTerritorio = function(lugarTerritorio, elementoSeleccionado) {
            if (elementoSeleccionado.lugarOTerritorio === 'insertar') {
                // Lugar es por defecto
                crearLugarTerritorio.show(elementoSeleccionado.nombre).then(function (resultado){
                    lugarTerritorio.lugarOTerritorio = resultado.lugarOTerritorio;
                    lugarTerritorio.lugarTerritorioID = resultado.lugarID;
                    lugarTerritorio.lugarTerritorioNombre = resultado.nombre;
                }, function () {
                    lugarTerritorio.lugarOTerritorio = ''
                    lugarTerritorio.lugarTerritorioID = -1;
                    lugarTerritorio.lugarTerritorioNombre = "";
                });
                
            } else {
                lugarTerritorio.lugarOTerritorio = elementoSeleccionado.lugarOTerritorio;
                lugarTerritorio.lugarTerritorioID = elementoSeleccionado.lugarTerritorioID;
                lugarTerritorio.lugarTerritorioNombre = elementoSeleccionado.nombre;
            }
        }
        
        //Datos principales
        $scope.datosPrincipales = {};

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipalesEditado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Embarcaciones',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                //Obtener los datos JSON
                var embarcacionesDatos = data.data[0];
                
                //Log
                console.log(embarcacionesDatos);
                if (embarcacionesDatos) {
                    try {
                        $scope.datosPrincipales = embarcacionesDatos;
                        // Obtenemos el nombre del lugar o territorio de construccion
                        var lugarTerritorioConstruccion = {
                            lugarTerritorioNombre: "",
                            lugarTerritorioID: -1,
                            lugarOTerritorio: ""
                        }
                        $scope.datosPrincipales.lugarTerritorioConstruccion = lugarTerritorioConstruccion;
                        if ($scope.datosPrincipales.lugarConstruccion) {
                            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Lugares',{
                                params: {
                                    lugarID: $scope.datosPrincipales.lugarConstruccion
                                }
                            }).then(function(data) {
                                var lugar = data.data[0];
                                var lugarTerritorioConstruccion = {
                                    lugarTerritorioNombre: lugar.nombre,
                                    lugarTerritorioID: lugar.lugarID,
                                    lugarOTerritorio: "lugar"
                                }
                                $scope.datosPrincipales.lugarTerritorioConstruccion = lugarTerritorioConstruccion;
                            });
                        } else if ($scope.datosPrincipales.territorioConstruccion) {
                            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Territorios',{
                                params: {
                                    territorioID: $scope.datosPrincipales.territorioConstruccion
                                }
                            }).then(function(data) {
                                var territorio = data.data[0];
                                lugarTerritorioConstruccion = {
                                    lugarTerritorioNombre: territorio.nombrePrincipal,
                                    lugarTerritorioID: territorio.territorioID,
                                    lugarOTerritorio: "territorio"
                                }
                                $scope.datosPrincipales.lugarTerritorioConstruccion = lugarTerritorioConstruccion;
                            });
                        }
                        
                        // Obtenemos el nombre del lugar o territorio de construccion
                        var lugarTerritorioDesercion = {
                            lugarTerritorioNombre: "",
                            lugarTerritorioID: -1,
                            lugarOTerritorio: ""
                        }
                        $scope.datosPrincipales.lugarTerritorioDesercion = lugarTerritorioDesercion;
                        
                        if ($scope.datosPrincipales.lugarDesercion) {
                            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Lugares',{
                                params: {
                                    lugarID: $scope.datosPrincipales.lugarDesercion
                                }
                            }).then(function(data) {
                                var lugar = data.data[0];
                                var lugarTerritorioDesercion = {
                                    lugarTerritorioNombre: lugar.nombre,
                                    lugarTerritorioID: lugar.lugarID,
                                    lugarOTerritorio: "lugar"
                                }
                                $scope.datosPrincipales.lugarTerritorioDesercion = lugarTerritorioDesercion;
                            });
                        } else if ($scope.datosPrincipales.territorioDesercion) {
                            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Territorios',{
                                params: {
                                    territorioID: $scope.datosPrincipales.territorioDesercion
                                }
                            }).then(function(data) {
                                var territorio = data.data[0];
                                lugarTerritorioDesercion = {
                                    lugarTerritorioNombre: territorio.nombre,
                                    lugarTerritorioID: territorio.territorioID,
                                    lugarOTerritorio: "territorio"
                                }
                                $scope.datosPrincipales.lugarTerritorioDesercion = lugarTerritorioDesercion;
                            });
                        }

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

                $scope.datosPrincipalesCargando = false;
            });
        };
        
        
        // REPARACIONES
        $scope.tablaReparaciones = {
            data:[]
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
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
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
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'notaReparacion',
            name: 'notaReparacion',
            displayName: 'Nota de Reparación',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            name: 'eliminar',
            displayName: '',
            width: 30,
            visible:false,
            enableCellEdit: false,
            cellTemplate: '<button class="btn btn-sm btn-danger" ng-click="grid.appScope.borrarReparaciones(row)">-</button>'
        }];
        $scope.tablaReparaciones.onRegisterApi = function (tablaAPI) {
            $scope.tablaReparacionesAPI = tablaAPI;
            tablaAPI.edit.on.afterCellEdit($scope, function(rowEntity,colDef, newValue, oldValue) {
                if (newValue != oldValue && rowEntity.estadoActual != $scope.datosEstados.INSERTADO) {
                    $scope.reparacionesEditadas = true;
                    pimcBarraEstadoService.registrarAccion(colDef.name + " en reparacion <strong>" + rowEntity.reparacionID + "</strong> modificada");
                    rowEntity.estadoActual = $scope.datosEstados.MODIFICADO;
                    $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }   
            });
            tablaAPI.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
                if (rowEntity[colDef.name] === $scope.valorDatoNuevo) {
                    rowEntity[colDef.name] = "";
                    $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }
            });
            tablaAPI.grid.registerRowsProcessor(function (renderableRows){
                    renderableRows.forEach(function(row) {
                        if (row.entity.estadoActual === $scope.datosEstados.ELIMINADO)
                            row.visible = false;
                        else 
                            row.visible = true;
                    });
                    return renderableRows;
            }, 200);
        };
        $scope.cargarReparaciones = function() {
            $scope.reparacionesEditadas = false;
            $scope.tablaReparaciones.data = [];
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/EmbarcacionesReparaciones',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                if (Object.keys(data.data).length != 0) {
                    $scope.tablaReparaciones.data = data.data;
                    for (var reparacion in $scope.tablaReparaciones.data) {
                        $scope.tablaReparaciones.data[reparacion].estadoActual = $scope.datosEstados.LIMPIO;
                    }
                }
            });
        };
        $scope.agregarReparacion = function () {
            $scope.reparacionesEditadas = true;
            var nuevaReparacion = {
                reparacionID: -1,
                embarcacionID: $scope.embarcacionID,
                fecha: new Date(),
                lugar: $scope.valorDatoNuevo,
                notaReparacion: $scope.valorDatoNuevo,
                estadoActual: $scope.datosEstados.INSERTADO
            };
            $scope.tablaReparaciones.data.push(nuevaReparacion);
            pimcBarraEstadoService.registrarAccion("Entrada agregada a tabla reparaciones");
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        };
        $scope.borrarReparaciones = function(row) {
            $scope.reparacionesEditadas = true;
            if (row.entity.estadoActual == $scope.datosEstados.INSERTADO) {
                pimcBarraEstadoService.registrarAccion("reparacion nueva eliminada");
                var index = $scope.tablaReparaciones.data.indexOf(row.entity);
                $scope.tablaReparaciones.data.splice(index,1);
            } else {
                pimcBarraEstadoService.registrarAccion("reparacion <strong> "+ row.entity.reparacionID +" </strong> eliminada");
                row.entity.estadoActual = $scope.datosEstados.ELIMINADO;
                $scope.tablaReparacionesAPI.grid.refresh();
            }

        };
        $scope.cambiarBorrarReparaciones = function (esActivo) {
            $scope.tablaReparaciones.columnDefs[3].visible = esActivo;
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            $scope.tablaReparacionesAPI.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        
        // DATOS SECUNDARIOS
        $scope.filtroDropdownContenido = ['Mostrar Todos'];
        $scope.llenarFiltro = function () {
            $scope.filtroDropdownContenido = ["Mostrar Todos"];
            $scope.tablaDatosSecundarios.data.forEach(function(row) {
                if (!$scope.filtroDropdownContenido.includes(row.categoria) && row.categoria != $scope.valorDatoNuevo) {
                    $scope.filtroDropdownContenido.push(row.categoria);
                }
            });
        }
        $scope.valorFiltroCategoria = "Mostrar Todos";
        $scope.datosSecundariosEditados = false;
        $scope.tablaDatosSecundarios = {
            data: []
        };
        $scope.tablaDatosSecundarios.columnDefs = [{
            field: 'categoria',
            name: 'categoria',
            displayName: 'Categoria',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'descripcion',
            name: 'descripcion',
            displayName: 'Descripcion del elemento',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'cantidad',
            name: 'cantidad',
            displayName: 'Cantidad',
            type: 'number',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'unidades',
            name: 'unidades',
            displayName: 'Unidades',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'fechaAdicion',
            name: 'fechaAdicion',
            displayName: 'Fecha Adicion',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'fechaRemocion',
            name: 'fechaRemocion',
            displayName: 'Fecha Remocion',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            name: 'eliminar',
            displayName: '',
            width: 30,
            visible:false,
            enableCellEdit: false,
            cellTemplate: '<button class="btn btn-sm btn-danger" ng-click="grid.appScope.borrarDatosSecundarios(row)">-</button>'
        }];
        
        $scope.tablaDatosSecundarios.onRegisterApi = function(tablaAPI) {
            $scope.tablasDatosSecundariosAPI = tablaAPI;
            $scope.tablasDatosSecundariosAPI.grid.registerRowsProcessor(function(renderableRows) {
                if ($scope.valorFiltroCategoria == "Mostrar Todos") {
                    renderableRows.forEach(function(row) {
                        if (row.entity.estadoActual === $scope.datosEstados.ELIMINADO)
                            row.visible = false;
                        else
                            row.visible = true;
                    });
                    return renderableRows;
                }
                var matcher = new RegExp($scope.valorFiltroCategoria);
                renderableRows.forEach(function(row) {
                    if ((!row.entity['categoria'].match(matcher) && row.entity.estadoActual != $scope.datosEstados.INSERTADO) || row.entity.estadoActual === $scope.datosEstados.ELIMINADO) {
                        row.visible = false;
                    } else {
                        row.visible = true;
                    }
                });
                return renderableRows;
            }, 200);
            tablaAPI.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
                if (rowEntity[colDef.name] === $scope.valorDatoNuevo) {
                    rowEntity[colDef.name] = "";
                    $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }
            });
            tablaAPI.edit.on.afterCellEdit($scope, function(rowEntity,colDef, newValue, oldValue) {
                if (newValue != oldValue && rowEntity.estadoActual != $scope.datosEstados.INSERTADO) {
                        $scope.datosSecundariosEditados = true;
                        pimcBarraEstadoService.registrarAccion(colDef.name + " en datos Secundarios <strong>" + rowEntity.elementoID + "</strong> modificado");
                        rowEntity.estadoActual = $scope.datosEstados.MODIFICADO;
                        $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }
                $scope.llenarFiltro();
            });
        };
        
        $scope.filtrarDatosSecundarios = function(valorSeleccionado) {
            $scope.valorFiltroCategoria = valorSeleccionado;
            $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
            $scope.tablasDatosSecundariosAPI.grid.refresh();
        };
        
        $scope.cargarDatosSecundarios = function() {
            $scope.datosSecundariosEditados = false;
            $scope.tablaDatosSecundarios.data = [];
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/EmbarcacionesElementos',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                if (Object.keys(data.data).length != 0) {
                    $scope.tablaDatosSecundarios.data = data.data;
                    for (var datoSecundario in $scope.tablaDatosSecundarios.data) {
                        $scope.tablaDatosSecundarios.data[datoSecundario].estadoActual = $scope.datosEstados.LIMPIO;
                    }
                    $scope.llenarFiltro();
                }
            });
        };
        $scope.agregarDatoSecundario = function () {
            $scope.datosSecundariosEditados = true;
            var nuevoDatoSecundario = {
                embarcacionID: $scope.embarcacionID,
                categoria: $scope.valorDatoNuevo,
                descripcion: $scope.valorDatoNuevo,
                cantidad: 0,
                unidades: $scope.valorDatoNuevo,
                fechaAdicion: new Date(),
                fechaAdicionFormato: "",
                fechaRemocion: new Date(),
                fechaRemocionFormato: "",
                estadoActual: $scope.datosEstados.INSERTADO
            };
            $scope.tablaDatosSecundarios.data.push(nuevoDatoSecundario);
            pimcBarraEstadoService.registrarAccion("Entrada agregada a tabla datos secundarios");
            $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        };
        $scope.borrarDatosSecundarios = function(row) {
            $scope.datosSecundariosEditados = true;
            if (row.entity.estadoActual == $scope.datosEstados.INSERTADO) {
                pimcBarraEstadoService.registrarAccion("datoSecundario nuevo eliminada");
                var index = $scope.tablaDatosSecundarios.data.indexOf(row.entity);
                $scope.tablaDatosSecundarios.data.splice(index,1);
            } else {
                pimcBarraEstadoService.registrarAccion("dato Secundario <strong> "+ row.entity.elementoID +" </strong> eliminado");
                row.entity.estadoActual = $scope.datosEstados.ELIMINADO;
                $scope.tablasDatosSecundariosAPI.grid.refresh();
            }

        };
        $scope.cambiarBorrarDatosSecundarios = function (esActivo) {
            var lastCol = $scope.tablaDatosSecundarios.columnDefs.length - 1;
            $scope.tablaDatosSecundarios.columnDefs[lastCol].visible = esActivo;
            $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            $scope.tablasDatosSecundariosAPI.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        
        // HOJAS DE SERVICIO Y PERSONAL
        // Definiciones de las pestañas de la aplicación. 
        $scope.tabs = new Map();
        $scope.tabsArray = [];

        // Estas funciones son para agregar y quitar pestañas
        $scope.abrirElemento = function(ElementoId) {
            if (!$scope.tabs.has(ElementoId)) {
                $scope.tabs.set(ElementoId, {
                    title: 'ComisionSeleccionada' + ($scope.tabs.size + 1),
                    tabIndex: ($scope.tabs.size + 1),
                    data: 'Esta es la ruta' + ElementoId,
                    active: true,
                    editada: false
                });
            }
            $scope.tabsArray = Array.from($scope.tabs);
        };
        $scope.cerrarElemento = function(ElementoId) {
            if ($scope.tabs.has(ElementoId)) {
                if ($scope.tabs[ElementoId].editada) {
                    if (window.confirm("Hay cambios sin guardar, esta seguro que quiere cerrar?") === true) {
                        pimcBarraEstadoService.registrarAccion("Los cambios en la comisión no han sido guardados");
                        $scope.tabs.delete(ElementoId);
                    }
                } else {
                    $scope.tabs.delete(ElementoId);
                }
            }
            $scope.tabsArray = Array.from($scope.tabs);
        }
        
        $scope.tablaHojaServicioPersonal = {
            enableRowSelection: true,
            multiSelect: false,
            noUnselect: true,
            enableRowHeaderSelection: false,
            data: []
        };
        $scope.hojaServicioPersonalEditado = false;
        $scope.tablaHojaServicioPersonal.columnDefs = [
        {
            field: 'lugarTerritorioPartida',
            name: 'lugarTerritorioPartida',
            displayName: 'Lugar o territorio de Partida',
            cellTemplate: 'views/global/lugarTerritorio/lugarTerritorioSelectCell.html',
            editableCellTemplate: 'views/global/lugarTerritorio/lugarTerritorioSelectEdit.html',
            cargarLugaresTypeahead: $scope.autocompletarLugarTerritorio,
            onSelectLugaresTypeahead: $scope.seleccionarLugarTerritorio,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'fechaPartida',
            name: 'fechaPartida',
            displayName: 'Fecha de Partida',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'lugarTerrotorioLlegada',
            name: 'lugarTerrotorioLlegada',
            displayName: 'Lugar o territorio de Llegada',
            cellTemplate: 'views/global/lugarTerritorio/lugarTerritorioSelectCell.html',
            editableCellTemplate: 'views/global/lugarTerritorio/lugarTerritorioSelectEdit.html',
            cargarLugaresTypeahead: $scope.autocompletarLugarTerritorio,
            onSelectLugaresTypeahead: $scope.seleccionarLugarTerritorio,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            field: 'fechaLlegada',
            name: 'fechaLlegada',
            displayName: 'Fecha de Llegada',
            type: 'date',
            cellFilter: 'date:"dd-MM-yyyy"',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                var classToReturn = "";
                if (row.entity['estadoActual'] == $scope.datosEstados.MODIFICADO) {
                    classToReturn += " text-info ";
                }
                if (row.entity['estadoActual'] == $scope.datosEstados.INSERTADO) {
                    classToReturn += " text-success ";
                }
                return classToReturn;
            }
        }, {
            name: 'eliminar',
            displayName: '',
            width: 30,
            visible:false,
            enableCellEdit: false,
            cellTemplate: '<button class="btn btn-sm btn-danger" ng-click="grid.appScope.borrarDatosSecundarios(row)">-</button>'
        }];
        
        $scope.tablaHojaServicioPersonal.onRegisterApi = function(tablaAPI) {
            $scope.tablaHojaServicioAPI = tablaAPI;
            tablaAPI.selection.on.rowSelectionChanged($scope, function(row) {
                var id = row.entity["rutaID"];
                // Abrimos solamente si no es nuevo. 
                if (row.entity.estadoActual != $scope.datosEstados.INSERTADO)
                    $scope.abrirElemento(id);
            });
            tablaAPI.edit.on.afterCellEdit($scope, function(rowEntity,colDef, newValue, oldValue) {
                if (newValue != oldValue && rowEntity.estadoActual != $scope.datosEstados.INSERTADO) {
                    $scope.hojaServicioPersonalEditado = true;
                    pimcBarraEstadoService.registrarAccion(colDef.name + " en hoja de servicio y personal <strong>" + rowEntity.reparacionID + "</strong> modificada");
                    rowEntity.estadoActual = $scope.datosEstados.MODIFICADO;
                    $scope.tablaHojaServicioAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }   
            });
            tablaAPI.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
                if ((colDef.name === 'lugarTerritorioPartida' || colDef.name === 'lugarTerrotorioLlegada')
                    && rowEntity[colDef.name].lugarTerritorioNombre === $scope.valorDatoNuevo) {
                    rowEntity[colDef.name].lugarTerritorioNombre = "";
                    $scope.tablaHojaServicioAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }
            });
            tablaAPI.grid.registerRowsProcessor(function (renderableRows){
                    renderableRows.forEach(function(row) {
                        if (row.entity.estadoActual === $scope.datosEstados.ELIMINADO)
                            row.visible = false;
                        else 
                            row.visible = true;
                    });
                    return renderableRows;
            }, 200);
        }
        $scope.cargarHojaServicioPersonal  = function() {
            $scope.hojaServicioPersonalEditado = true;
            $scope.tablaHojaServicioPersonal.data = [];
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/EmbarcacionesRutas',
                {params: {embarcacionID: $scope.embarcacionID}}
            ).then( function(data) {
                if (Object.keys(data.data).length != 0) {
                    $scope.tablaHojaServicioPersonal.data = data.data;
                    for (var ruta in $scope.tablaHojaServicioPersonal.data) {
                        // Para Lugar o territorio de partida
                        // Lugar tiene prioridad sobre territorio
                        if ($scope.tablaHojaServicioPersonal.data[ruta].lugarPartidaID) {
                            $scope.tablaHojaServicioPersonal.data[ruta].lugarTerritorioPartida = {lugarOTerritorio:'lugar', 
                                                                                                  lugarTerritorioID: $scope.tablaHojaServicioPersonal.data[ruta].lugarPartidaID,
                                                                                                  lugarTerritorioNombre: ''};
                            // Cargamos el lugar para obtener el nombre
                        } else {
                            $scope.tablaHojaServicioPersonal.data[ruta].lugarTerritorioPartida = {lugarOTerritorio:'territorio', 
                                                                                                  lugarTerritorioID: $scope.tablaHojaServicioPersonal.data[ruta].territorioPartidaID,
                                                                                                  lugarTerritorioNombre: ''};
                            // Cargamos el lugar para obtener el nombre
                        }
                        // Para Lugar o territorio de partida
                        // Lugar tiene prioridad sobre territorio
                        if ($scope.tablaHojaServicioPersonal.data[ruta].lugarLlegadaID) {
                            $scope.tablaHojaServicioPersonal.data[ruta].lugarTerrotorioLlegada = {lugarOTerritorio:'lugar', 
                                                                                                  lugarTerritorioID: $scope.tablaHojaServicioPersonal.data[ruta].lugarLlegadaID,
                                                                                                  lugarTerritorioNombre: ''};
                            // Cargamos el lugar para obtener el nombre
                        } else {
                            $scope.tablaHojaServicioPersonal.data[ruta].lugarTerrotorioLlegada = {lugarOTerritorio:'territorio', 
                                                                                                  lugarTerritorioID: $scope.tablaHojaServicioPersonal.data[ruta].territorioLlegadaID,
                                                                                                  lugarTerritorioNombre: ''};
                            // Cargamos el lugar para obtener el nombre
                        }
                    }
                }
            });
        };
        $scope.agregarHojaServicioPersonal = function () {
            $scope.hojaServicioPersonalEditado = true;
            var nuevaHojaServicioPersonal = {
                embarcacionID: $scope.embarcacionID,
                lugarTerrotorioLlegada: { lugarOTerritorio:'lugar', 
                                          lugarTerritorioID: -1,
                                          lugarTerritorioNombre: $scope.valorDatoNuevo},
                lugarTerritorioPartida: { lugarOTerritorio:'lugar', 
                                          lugarTerritorioID: -1,
                                          lugarTerritorioNombre: $scope.valorDatoNuevo},
                fechaPartida: new Date(),
                fechaLlegada: new Date(),
                estadoActual: $scope.datosEstados.INSERTADO
            };
            $scope.tablaHojaServicioPersonal.data.push(nuevaHojaServicioPersonal);
            pimcBarraEstadoService.registrarAccion("Entrada agregada a hoja de servicio y personal");
            $scope.tablaHojaServicioAPI.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
        };
        $scope.borrarHojaServicioPersonal = function(row) {
            $scope.hojaServicioPersonalEditado = true;
            if (row.entity.estadoActual == $scope.datosEstados.INSERTADO) {
                pimcBarraEstadoService.registrarAccion("Hoja de servicio y personal nueva eliminada");
                var index = $scope.tablaHojaServicioPersonal.data.indexOf(row.entity);
                $scope.tablaHojaServicioPersonal.data.splice(index,1);
            } else {
                if (window.confirm("Esta Seguro que quiere borrar una hoja de servicio? Se perderan todos los datos de esta ruta") === true) {
                    pimcBarraEstadoService.registrarAccion("Hoja de servicio y personal <strong> "+ row.entity.rutaID +" </strong> eliminada");
                    row.entity.estadoActual = $scope.datosEstados.ELIMINADO;
                    $scope.tablaHojaServicioAPI.grid.refresh();
                }
            }
        };
        $scope.cambiarBorrarHojaDeServicioPersonal = function (esActivo) {
            var lastCol = $scope.tablaHojaServicioPersonal.columnDefs.length - 1;
            $scope.tablaHojaServicioPersonal.columnDefs[lastCol].visible = esActivo;
            $scope.tablaHojaServicioAPI.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
            $scope.tablaHojaServicioAPI.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        
        
        // PARA LISTADOS
        $scope.listados = {mensaje:"+ Agregar"};
        // Para borrar listaNombres
        $scope.listados.modificarBorrar = function(listadoNombre, lista, indexEditado, valor) {
            if (valor == "") {
                var valorAEliminar = lista[indexEditado];
                if (valorAEliminar != "") {
                    pimcBarraEstadoService.registrarAccion(listadoNombre + "<strong>" + valorAEliminar + "</strong>  eliminado");
                    $scope.datosPrincipalesEditado = true;
                }
                lista.splice(indexEditado, 1);
            } else {
                var valorModificado = lista[indexEditado];
                if (valor != valorModificado) {
                    pimcBarraEstadoService.registrarAccion(listadoNombre + "<strong>" + valorModificado + "</strong>  Modificado a <strong>" + valor + "</strong>");
                    lista[indexEditado] = valor;
                    $scope.datosPrincipalesEditado = true;
                }
            }
        }
        $scope.listados.agregarALista = function(listadoNombre, lista, elemento) {
            if (!lista.includes(elemento) && elemento.length != 0) {
                lista.push(elemento);
                pimcBarraEstadoService.registrarAccion(listadoNombre + "<strong>" + elemento + "</strong> agregado");
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
            pimcBarraEstadoService.registrarAccion(listadoNombre + "<strong>" + lista[0] + "</strong> principal");
            $scope.datosPrincipalesEditado = true;
        }
        
        
        // ANOTACIONES EMBARCACIONES
        $scope.notas = [];
        $scope.notasCambios = false;
        $scope.cargarNotas = function() {
            pimcComentarios.cargarNotas('Embarcaciones',$scope.embarcacionID).then( function(notas) {
                $scope.notas = notas;
            });
        };
        $scope.notificarNotasCambios = function() {
            $scope.notasCambios = true;
        };
        

        // Button functions
        $scope.borrarCambios = function() {
                init();
        };
        
        $scope.datosGuardados = false;
        $scope.guardarCambios = function() {
            var conexiones = {};
            //Revisamos datos principales editados
            if ($scope.datosPrincipalesEditado) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD Embarcaciones");
                var request = 'http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/Embarcaciones'
                var parametros = {
                    idUnico:'embarcacionID',
                    embarcacionID:$scope.embarcacionID
                }
                
                var inserciones = {};
                for (var key in $scope.datosPrincipales) {
                    var value = $scope.datosPrincipales[key];
                    if (key === 'lugarTerritorioConstruccion' ) {
                        if (value.insertarNuevo) {
                            // Es necesario crear un lugar o territorio
                            if (value.lugarOTerritorio === 'lugar') {
                                inserciones['insertarLugarConstruccion'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Lugares',{
                                    params: {
                                        nombre:'"' + value.nombre + '"'
                                    }
                                }).then( function (data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                        parametros['lugarConstruccion'] = lastInsertID;
                                    }
                                });
                            } else if (value.lugarOTerritorio === 'territorio') {
                                inserciones['insertarTerritorioConstruccion'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Territorio',{
                                    params: {
                                        nombrePrincipal:'"' + value.nombre + '"'
                                    }
                                }).then( function (data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                        parametros['lugarConstruccion'] = lastInsertID;
                                    }
                                });
                            }
                        } else {
                            // Simplemente cambiarlo
                            if (value.lugarOTerritorio === 'lugar') {
                                parametros['lugarConstruccion'] = value.lugarTerritorioID;
                            } else if (value.lugarOTerritorio === 'territorio') {
                                parametros['territorioConstruccion'] = value.lugarTerritorioID;
                            }
                        }
                        
                    } else if (key === 'lugarTerritorioDesercion') {
                        if (value.insertarNuevo) {
                            // Es necesario crear un lugar o territorio
                            if (value.lugarOTerritorio === 'lugar') {
                                inserciones['insertarLugarDesercion'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Lugares',{
                                    params: {
                                        nombre:'"' + value.nombre + '"'
                                    }
                                }).then( function (data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                        parametros['lugarDesercion'] = lastInsertID;
                                    }
                                });
                            } else if (value.lugarOTerritorio === 'territorio') {
                                inserciones['insertarTerritorioDesercion'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Territorio',{
                                    params: {
                                        nombrePrincipal:'"' + value.nombre + '"'
                                    }
                                }).then( function (data) {
                                    if (Object.keys(data.data).length != 0) {
                                        var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                        parametros['territorioDesercion'] = lastInsertID;
                                    }
                                });
                            }                        } else {
                            // Simplemente cambiarlo
                            if (value.lugarOTerritorio === 'lugar') {
                                parametros['lugarDesercion'] = value.lugarTerritorioID;
                            } else if (value.lugarOTerritorio === 'territorio') {
                                parametros['territorioDesercion'] = value.lugarTerritorioID;
                            }
                        }  
                    } else if ((key == 'nombres' || key == 'alias' || key == 'usos')  && value.length != 0) {
                        parametros[key] = "'" + value.join(", ") + "'";
                    } else if (key != "lugarConstruccion" && key != "lugarDisercion" && key != "territorioConstruccion" && key != "territorioDisercion"  && value != null && value != "" ) {
                        if (typeof value === 'string') {
                            parametros[key] = "'" + value + "'";
                        } else {
                            parametros[key] = value;
                        }
                    }                          
                };
                
                $q.all(inserciones).then( function(responses) {
                    conexiones['datosPrincipalesModificados'] = $http.get(request,{params:parametros});
                });
            }
            // Anotaciones
            if ($scope.notasCambios) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD notasEmbarcaciones");
                $scope.notasCambios = false;
            }

            // REPARACIONES
            if ($scope.reparacionesEditadas) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD EmbarcacionesReparaciones");
                $scope.reparacionesEditadas = false;
                for (var reparacion in $scope.tablaReparaciones.data) {
                    var currentElement = $scope.tablaReparaciones.data[reparacion];

                    if (currentElement.estadoActual === $scope.datosEstados.INSERTADO) {
                        // Borramos los valores de los datos nuevos
                        for(var columna in currentElement) {
                            if (currentElement[columna] === $scope.valorDatoNuevo) {
                                currentElement[columna] = "";
                            }
                        }
                        // Check for new insertions
                        var valorAInsertar = { 
                            params: {
                                embarcacionID: $scope.embarcacionID,
                                //fecha: currentElement.fecha,
                                lugar: "'" + currentElement.lugar + "'",
                                notaReparacion: "'" + currentElement.notaReparacion + "'"
                            }
                        }
                        conexiones['reparacionesInsertar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/EmbarcacionesReparaciones', valorAInsertar);
                    } else if (currentElement.estadoActual === $scope.datosEstados.MODIFICADO) {
                        // Check for modifications
                        var valorAModificar = {
                            params: {
                                idUnico: 'reparacionID',
                                idUnico2: 'embarcacionID',
                                reparacionID: currentElement.reparacionID,
                                embarcacionID: $scope.embarcacionID,
                                //fecha: currentElement.fecha,
                                lugar: "'" + currentElement.lugar + "'",
                                notaReparacion: "'" + currentElement.notaReparacion  + "'"
                            }
                        }
                        conexiones['reparacionesModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/EmbarcacionesReparaciones', valorAModificar);
                    } else if (currentElement.estadoActual === $scope.datosEstados.ELIMINADO) {
                        // Check for modifications
                        var valorAEliminar = {
                            params: {
                                idUnico: 'reparacionID',
                                idUnico2: 'embarcacionID',
                                reparacionID: currentElement.reparacionID,
                                embarcacionID: $scope.embarcacionID
                            }
                        }
                        conexiones['reparacionesModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/EmbarcacionesReparaciones', valorAEliminar);
                    }
                }
            }
            // DATOS SECUNDARIOS
            if ($scope.datosSecundariosEditados) {
                pimcBarraEstadoService.registrarAccion("Actualizando BD EmbarcacionesElementos");
                $scope.datosSecundariosEditados = false;
                for (var elemento in $scope.tablaDatosSecundarios.data) {
                    var currentElement = $scope.tablaDatosSecundarios.data[elemento];
                    if (currentElement.estadoActual === $scope.datosEstados.INSERTADO) {
                        // Borramos los valores de los datos nuevos
                        for(var columna in currentElement) {
                            if (currentElement[columna] === $scope.valorDatoNuevo) {
                                currentElement[columna] = "";
                            }
                        }
                        // Check for new insertions
                        var valorAInsertar = { 
                            params: {
                                embarcacionID: $scope.embarcacionID,
                                categoria: "'" + currentElement.categoria + "'",
                                descripcion: "'" + currentElement.descripcion + "'",
                                cantidad: currentElement.cantidad,
                                unidades: "'" + currentElement.unidades + "'",
                                //fechaAdicion: currentElement.fechaAdicion,
                                fechaAdicionFormato: "'" + currentElement.fechaAdicionFormato + "'",
                                //fechaRemocion: currentElement.fechaRemocion,
                                fechaRemocionFormato: "'" + currentElement.fechaRemocionFormato + "'"
                            }
                        }
                        conexiones['elementosInsertar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/EmbarcacionesElementos', valorAInsertar);
                    } else if (currentElement.estadoActual === $scope.datosEstados.MODIFICADO) {
                        // Check for modifications
                        var valorAModificar = {
                            params: {
                                idUnico: 'elementoID',
                                idUnico2: 'embarcacionID',
                                elementoID: currentElement.elementoID,
                                embarcacionID: $scope.embarcacionID,
                                categoria: "'" + currentElement.categoria + "'",
                                descripcion: "'" + currentElement.descripcion + "'",
                                cantidad: currentElement.cantidad,
                                unidades: "'" + currentElement.unidades + "'",
                                //fechaAdicion: currentElement.fechaAdicion,
                                fechaAdicionFormato: "'" + currentElement.fechaAdicionFormato + "'",
                                //fechaRemocion: currentElement.fechaRemocion,
                                fechaRemocionFormato: "'" + currentElement.fechaRemocionFormato + "'"
                            }
                        }
                        conexiones['elementosModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/EmbarcacionesElementos', valorAModificar);
                    } else if (currentElement.estadoActual === $scope.datosEstados.ELIMINADO) {
                        // Check for modifications
                        var valorAEliminar = {
                            params: {
                                idUnico: 'elementoID',
                                idUnico2: 'embarcacionID',
                                elementoID: currentElement.elementoID,
                                embarcacionID: $scope.embarcacionID
                            }
                        }
                        conexiones['elementosModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/EmbarcacionesElementos', valorAEliminar);
                    }
                }
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
