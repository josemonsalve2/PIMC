////////////////////////////////////////////////////////////////////////////////////
// PERSONAJE PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var personajePerfil = angular.module('personajePerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    personajePerfil.controller('personajePerfilController', ['$scope', '$sce','$q', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', function($scope, $sce, $q, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
        $scope.personajeID = -1;
        
        var init = function() {
            $scope.personajeID = $window.localStorage.getItem("personajeID");
            // If not set, redirect.
            if (!$scope.personajeID) {
                console.log("No hay personajeID");
                //TODO Enviar varios seleccionados
                $window.location.href = "#!/busqueda";
            } else {
                if (!$scope.datosGuardados) {
                    $scope.registrarAccion("Personaje <strong>" + $scope.personajeID + "</strong> ha sido cargado");
                } else {
                    $scope.registrarAccion("Personaje <strong>" + $scope.personajeID  + "</strong> ha sido guardado en la base de datos");
                    $scope.datosGuardados = false;
                }

                // Cargamoss los datos principales
                $scope.cargarDatosPrincipales();
                // Cargamos las anotaciones
                $scope.cargarNotas();
                // Cargamos parentescos 
                $scope.cargarParentescos();
            }
        };
        
        //Datos principales
        $scope.datosPrincipales = {};

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipalesEditado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Personajes',
                {params: {personajeID: $scope.personajeID}}
            ).then(function(data) {
                //Obtener los datos JSON
                var personajeDatos = data.data[0];
                
                //Log
                console.log(personajeDatos);
                try {
                        $scope.datosPrincipales = personajeDatos;
                    
                        // Editamos fecha de nacimiento y fallecimiento al formato adecuado
                        $scope.datosPrincipales.fechaNacimiento = personajeDatos.fechaNacimiento != null ? $filter('date')(new Date(personajeDatos.fechaNacimiento), String(personajeDatos.fechaNacimientoFormato).toLowerCase()) : "";
                        $scope.datosPrincipales.fechaFallecimiento = personajeDatos.fechaFallecimiento != null ? $filter('date')(new Date(personajeDatos.fechaFallecimiento), String(personajeDatos.fechaFallecimientoFormato).toLowerCase()) : "";
                    
                        // Lista de enfermedades
                        if ($scope.datosPrincipales.enfermedades != null && $scope.datosPrincipales.enfermedades != "") {
                            $scope.datosPrincipales.enfermedades = personajeDatos.enfermedades.split(",");
                            $scope.datosPrincipales.enfermedades = $scope.datosPrincipales.enfermedades.map(function(e) {
                                return e.trim();
                            });
                        } else {
                            $scope.datosPrincipales.enfermedades = [];
                        }
                }
                catch(err) {
                    console.log("Problema cargando los valores de datos principales del personaje " + err.message);
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

                //Para Lista de enfermedades claves
                $scope.listaEnfermedades.enfermedadNueva = {
                    mensaje: "+ Agregar"
                };
                $scope.datosPrincipalesCargando = false;
            });
        };
        
        // ENFERMEDADES
        $scope.listaEnfermedades = {}
        // Para borrar Enfermedades
        $scope.listaEnfermedades.modificarBorrarEnfermedad = function(indexEditada, enfermedad) {
            if (enfermedad == "") {
                var enfermedadEliminada = $scope.datosPrincipales.enfermedades[indexEditada];
                if (enfermedadEliminada != "") {
                    $scope.registrarAccion("Enfermedad <strong>" + enfermedadEliminada + "</strong> eliminada");
                    $scope.datosPrincipalesEditado = true;
                }
                $scope.datosPrincipales.enfermedades.splice(indexEditada, 1);
            } else {
                var enfermedadModificada = $scope.datosPrincipales.enfermedades[indexEditada];
                if (enfermedad != enfermedadModificada) {
                    $scope.registrarAccion("Enfermedad <strong>" + enfermedadModificada + "</strong> Modificada a <strong>" + enfermedad + "</strong>");
                    $scope.datosPrincipales.enfermedades[indexEditada] = enfermedad;
                    $scope.datosPrincipalesEditado = true;
                }
            }
        }
        //Para agregar enfermedades
        $scope.listaEnfermedades.enfermedadNueva = {
            mensaje: '+ Agregar'
        };
        $scope.listaEnfermedades.borrarCampo = function() {
            $scope.listaEnfermedades.enfermedadNueva.mensaje = "";
        }
        $scope.listaEnfermedades.mostrarCampo = function() {
            $scope.listaEnfermedades.enfermedadNueva.mensaje = "+ Agregar";
        }
        $scope.listaEnfermedades.agregarEnfermedadNueva = function(enfermedad) {
            if (!$scope.datosPrincipales.enfermedades.includes(enfermedad) && enfermedad.length != 0) {
                $scope.datosPrincipales.enfermedades.push(enfermedad);
                $scope.registrarAccion("Enfermedad <strong>" + enfermedad + "</strong> agregada");
                $scope.datosPrincipalesEditado = true;
            }
            $scope.listaEnfermedades.enfermedadNueva.mensaje = "+ Agregar";
        }
        
        // PARENTESCOS 
        $scope.parentescos = [];
        $scope.parentescosNuevos = [];
        $scope.parentescosAEliminar = [];
        $scope.parentescosAgregarReferencia = [];
        $scope.parentescosCambios = false;
        $scope.cargarParentescos = function () {
            $scope.parentescosCambios = false;
            $scope.parentescos = [];
            $scope.parentescosNuevos = [];
            $scope.parentescosAEliminar = [];
            $scope.parentescosAgregarReferencia = [];
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/PersonajesParentescos',
                        {params:{
                            egoID:$scope.personajeID
                        }}
            ).then(function(data) {
                // revisar si existe alguno
                if (Object.keys(data.data).length != 0) {
                    var parentescosReferencias = data.data;
                    parentescosReferencias.forEach(function(referencia) {
                            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/Personajes',
                                    {params: {
                                        personajeID:referencia.parienteID 
                                    }}
                            ).then(function(data) {
                                var personaje = data.data[0];
                                var pariente = {
                                    parentescoID: referencia.parentescoID,
                                    parienteID: referencia.parienteID,
                                    nombrePersonaje: personaje.nombre,
                                    relacionDirecta: referencia.parentesco
                                } 
                                $scope.parentescos.push(pariente);
                            });
                    });
                    // LOG
                    console.log($scope.parentescos);
                }
            });
        }
        $scope.agregarParentesco = function () {
            var parienteNuevo = {
                parentescoID: -1,
                parienteID: -1,
                nombrePersonaje: "",
                relacionDirecta: "",
                relacionInversa: ""
            };
            $scope.parentescosNuevos.push(parienteNuevo);
            $scope.parentescosCambios = true;
            $scope.registrarAccion("Parentesco vacío agregado")
        };
        $scope.borrarParentescoNuevo = function (indice) {
            $scope.parentescosNuevos.splice(indice,1);
            $scope.registrarAccion("Parentesco nuevo borrado");
        };
        $scope.borrarParentescoExistente = function(indice) {
            $scope.registrarAccion("Parentesco " + $scope.parentescos[indice].nombrePersonaje + " seleccionado para eliminar")
            $scope.parentescosAEliminar.push($scope.parentescos[indice]);
            $scope.parentescos.splice(indice,1);
            $scope.parentescosCambios = true;
        }
        $scope.borrarReferenciaNuevoParentesco = function (indice) {
            $scope.registrarAccion("Nueva parentesco a personaje" + $scope.parentescosAgregarReferencia[indice].nombrePersonaje + " borrada");
            $scope.parentescosAgregarReferencia.splice(indice,1);
        };
        $scope.autocompletarPersonaje = function (hintNombre) {
            return $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Autocompletar/Personajes?nombre=' + hintNombre).then(function(data) {
                var listaNombres = [];
                var resultados = data.data;
                var matchPerfecto = false;
                if (resultados != "0") {
                    resultados.forEach( function (valor) {
                        if(valor.nombre != $scope.datosPrincipales.nombre) {
                            listaNombres.push({nombre: valor.nombre, personajeID: valor.personajeID});
                            // Revisamos si son identicos
                            // TODO cambiar acentos 
                            if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombre).toLowerCase().replace(/\s/g, ''))
                                matchPerfecto = true;
                        }
                    })
                }
                if (!matchPerfecto && listaNombres.length != 0)
                        listaNombres.unshift({nombre:hintNombre,personajeID:-1})
                return listaNombres;
            });
        };
        $scope.actualizarParentescoNuevoExistente = function (indice, personajeBD) {
            var alreadyExist = false;
            // Revisamos si ya existe
            $scope.parentescos.forEach(function (elemento) {
                if (personajeBD.personajeID == elemento.parienteID) {
                    alreadyExist = true;
                    return;
                }
            });
            // Revisamos si la referencia fue eliminada anteriormente
            $scope.parentescosAEliminar.forEach(function (elemento) {
                if (personajeBD.personajeID == elemento.parienteID) {
                    alreadyExist = true;
                    return;
                }
            });
            $scope.parentescosAgregarReferencia.forEach(function (elemento) {
                if (personajeBD.personajeID == elemento.parienteID) {
                    alreadyExist = true;
                    return;
                }
            });
            if (!alreadyExist && personajeBD.personajeID !== -1) {
                var nuevaReferencia = {
                    parienteID: personajeBD.personajeID,
                    nombrePersonaje: personajeBD.nombre,
                    relacionDirecta: "",
                    relacionInversa: ""
                }
                $scope.parentescosNuevos.splice(indice,1);
                $scope.parentescosAgregarReferencia.push(nuevaReferencia);
            }

        };
        $scope.abrirPersonajeSeleccionado = function(index, ubicacion) {
            var seleccionado = -1;
            if (ubicacion == "nuevaRef") {
                seleccionado = $scope.parentescosAgregarReferencia[index].parienteID;
            } else if (ubicacion == "existente") {
                seleccionado = $scope.parentescos[index].parienteID;
            }
            if (seleccionado != -1) {
                console.log("Abriendo documento" + seleccionado);
                //TODO Enviar varios seleccionados
                $window.localStorage.setItem("personajeID", seleccionado);
                $window.location.reload();
            }
        };
        $scope.revisarSiParentescoExiste = function ($value) {
            var existe = false;
            var mensaje = "";
            $scope.parentescos.forEach( function(pariente) {
                if ($value == pariente.nombrePersonaje) {
                    existe = true;
                    mensaje = "Este nombre ya existe";
                    return;
                }
            });
            $scope.parentescosAEliminar.forEach( function(parienteEliminado){
                if ($value == parienteEliminado.nombrePersonaje) {
                    existe = true;
                    mensaje = "Este nombre ya existía, fue eliminado pero los cambios no han sido guardados.";
                    return;
                }
            });
            $scope.parentescosAgregarReferencia.forEach (function(parienteRefAgregada){
                if ($value == parienteRefAgregada.nombrePersonaje) {
                    existe = true;
                    mensaje = "Ref ya agregada";
                    return;
                }
            });
            $scope.parentescosNuevos.forEach (function(parienteNuevo){
                if ($value == parienteNuevo.nombrePersonaje) {
                    existe = true;
                    mensaje = "Pariente ya agregado";
                    return;
                }
            });
            if (existe) {
                return mensaje;
            }
        }
        
        
        
        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/PersonajesNotas', 
            {
                params:{
                    personajeID:$scope.personajeID
                }
            }).then(function(data) {
                if (Object.keys(data.data).length != 0) {
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
        
        
        // Funcionalidad para hoja de servicio
        $scope.tabs = new Map();
        $scope.tabsArray = [];
        $scope.abrirElemento = function(ElementoId) {
            if (!$scope.tabs.has(ElementoId)) {
            $scope.tabs.set(ElementoId, {
                title: 'Comision seleccionada ' + ($scope.tabs.size + 1),
                tabIndex: ($scope.tabs.size + 1),
                content: 'Esta es la comisión ' + ElementoId,
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
                $scope.registrarAccion("Actualizando BD Personajes");
                var request = 'http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/Personajes'
                var parametros = {
                    idUnico:'personajeID',
                    personajeID:$scope.personajeID
                }
                
                var agregado = false;
                for (var key in $scope.datosPrincipales) {
                    var value = $scope.datosPrincipales[key];
                    if (key == 'enfermedades' && value.length != 0) {
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
                        conexiones['notasCambiosInsertar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/PersonajesNotas',
                                    {params:{
                                        personajeID: $scope.personajeID,
                                        nota: "'" + nota.nota + "'",
                                        referencia:"'" + nota.referencia + "'"
                                    }}
                        );
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        conexiones['notasCambiosModificar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Modificar/PersonajesNotas',
                                    {params:{
                                        idUnico2:'personajeID',
                                        idUnico:'notaID',
                                        notaID:nota.notaID,
                                        personajeID:$scope.personajeID,
                                        nota:"'" + nota.nota + "'",
                                        referencia:"'" + nota.referencia + "'"
                                    }}
                        );
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function(nota) {
                    conexiones['notasCambiosEliminar'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/PersonajesNotas',
                                {params:{
                                idUnico2:'personajeID',
                                idUnico:'notaID',
                                notaID:nota.notaID,
                                personajeID:$scope.personajeID
                                }}
                    );
                });

            }
            
            // PARENTESCOS
            if ($scope.parentescosCambios) 
            {
                // agregar referencias a personajes existentes
                $scope.parentescosAgregarReferencia.forEach( function (parentesco) {
                    // Guardamos la relacion directa
                    conexiones['parentescosInsertarDirecta'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/PersonajesParentescos',{
                        params: {
                            egoID: $scope.personajeID,
                            parienteID: parentesco.parienteID,
                            parentesco: "'" + parentesco.relacionDirecta + "'"
                        }
                    });
                    // Guardamos la relacion Inversa
                    conexiones['parentescosInsertarInversa'] = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/PersonajesParentescos',{
                        params: {
                            egoID: parentesco.parienteID,
                            parienteID: $scope.personajeID,
                            parentesco: "'" + parentesco.relacionInversa + "'"
                        }
                    });
                });
                // Eliminamos referencias existentes
                $scope.parentescosAEliminar.forEach(function (personajeRefABorrar) {
                    var relacionInversaID = -1;
                    $scope.registrarAccion("Referencia existente eliminada");
                    // Buscamos la relacion inversa
                    var promesaConsulta = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Consulta/PersonajesParentescos',  {
                        params: {
                            egoID: personajeRefABorrar.parienteID,
                            parienteID: $scope.personajeID
                        }
                    })
                    
                    conexiones['parentescosEliminar'] = promesaConsulta.then(function(data) {
                            console.log("relacion Inversa" + data);
                            relacionInversaID = data.data[0].parentescoID;
                            var promises = [];
                            // Eliminamos relacion directa
                            promises.push($http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/PersonajesParentescos',{
                                params: {
                                    idUnico: 'parentescoID',
                                    parentescoID: personajeRefABorrar.parentescoID
                                }
                            }));
                            // Eliminamos relacion inversa
                            if (relacionInversaID != -1) {
                                conexiones['parentescosEliminarInversa'] = promises.push($http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Eliminar/PersonajesParentescos',{
                                    params: {
                                        idUnico: 'parentescoID',
                                        parentescoID: relacionInversaID
                                    }
                                }));
                            }
                            return $q.all(promises);
                    });
                    
                    
                });
                // Creamos personajes nuevos y agregamos parentesco
                $scope.parentescosNuevos.forEach( function (pariente) {
                    // revisar si el personaje nombre esta vacio
                    if (pariente.nombrePersonaje !== "") {
                        var promesaInsertar = $http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/Personajes',{
                            params: {
                                nombre: '"'+pariente.nombrePersonaje+'"'
                            }
                        });
                        
                        
                        conexiones['parentescosPersonajesNuevos'] = promesaInsertar.then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                            var promises = [];
                            // Data contains the last insert id
                            if (Object.keys(data.data).length != 0) {
                                var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                // Guardamos la relacion directa
                                promises.push($http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/PersonajesParentescos',{
                                    params: {
                                        egoID: $scope.personajeID,
                                        parienteID: lastInsertID,
                                        parentesco: "'" + pariente.relacionDirecta + "'"
                                    }
                                }));
                                // Guardamos la relacion Inversa
                                promises.push($http.get('http://pimcapi.fundacionproyectonavio.org/PIMC0.1/Insertar/PersonajesParentescos',{
                                    params: {
                                        egoID: lastInsertID,
                                        parienteID: $scope.personajeID,
                                        parentesco: "'" + pariente.relacionInversa + "'"
                                    }
                                }));
                            }
                            return $q.all(promises);
                        });
                    }
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
            
        
        
        // Incializamos todo
        $timeout(function () {init();},200);
    }]);

})(window.angular);

