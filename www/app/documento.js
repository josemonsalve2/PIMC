////////////////////////////////////////////////////////////////////////////////////
// DOCUMENTO PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';

    var documentoPerfil = angular.module('documentoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable']);
    documentoPerfil.controller('documentoPerfilController', ['$scope', '$sce', '$http', '$window', '$location', '$filter', '$timeout', 'uiGridConstants', 'i18nService', '$scope', function($scope, $sce, $http, $window, $location, $filter, $timeout, i18nService, uiGridConstants) {
        $scope.archivoID = -1;
        $scope.documentoID = -1;
        var init = function() {
            $scope.archivoID = $window.localStorage.getItem("archivoID");
            $scope.documentoID = $window.localStorage.getItem("documentoID");
            if (!$scope.datosGuardados) {
                $scope.registrarAccion("Documento <strong>" + $scope.documentoID + "</strong> del archivo <strong>" + $scope.archivoID + " </strong> ha sido cargado");
            } else {
                $scope.registrarAccion("Documento <strong>" + $scope.archivoID + "</strong> del archivo <strong>" + $scope.archivoID + " </strong> ha sido guardado en la base de datos");
                $scope.datosGuardados = false;
            }

            // Cargamoss los datos principales
            $scope.cargarDatosPrincipales();
            
            // Cargamos Emisor Receptor
            $scope.cargarEmisorReceptor();
            
            // Anotaciones
            $scope.cargarNotas();
            
            // Personajes
            $scope.cargarPersonajes();
            
            // Embarcaciones
            $scope.cargarEmbarcaciones();
        };
        
        //Datos principales
        $scope.datosPrincipales = {
            tipoDocumento: "",
            estadoConservacion: "",
            formatoDisponible: "",
            fechaMinima: "",
            fechaMinimaFormato: "",
            fechaMaxima: "",
            fechaMaximaFormato: "",
            sinopsis: "",
            listaTemas: []
        };

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipales.editado = false;
        $scope.datosPrincipalesCargando = true;

        $scope.cargarDatosPrincipales = function() {
            $scope.datosPrincipalesCargando = true;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Documentos?archivoID=' + $scope.archivoID + '&documentoID=' + $scope.documentoID).then(function(data) {
                //Obtener los datos JSON
                var documentoDatos = data.data[0];
                
                //Log
                console.log(documentoDatos);

                try {
                    //Llenamos los datos del documento
                    $scope.datosPrincipales.tipoDocumento = documentoDatos.tipoDocumento;
                    $scope.datosPrincipales.estadoConservacion = documentoDatos.estadoConservacion;
                    $scope.datosPrincipales.formatoDisponible = documentoDatos.formatoDisponible;
                    $scope.datosPrincipales.fechaMinima = documentoDatos.fechaMinima != null ? $filter('date')(new Date(documentoDatos.fechaMinima), String(documentoDatos.fechaMinFormato).toLowerCase()) : "";
                    $scope.datosPrincipales.fechaMinFormato = documentoDatos.fechaMinFormato;
                    $scope.datosPrincipales.fechaMaxima = documentoDatos.fechaMaxima != null ? $filter('date')(new Date(documentoDatos.fechaMaxima), String(documentoDatos.fechaMaxFormato).toLowerCase()) : "";
                    $scope.datosPrincipales.fechaMaxFormato = documentoDatos.fechaMaxFormato;
                    $scope.datosPrincipales.sinopsis = documentoDatos.sinopsis;
                    $scope.datosPrincipales.listaTemas = documentoDatos.listaTemas.split(",");
                    $scope.datosPrincipales.listaTemas = $scope.datosPrincipales.listaTemas.map(function(e) {
                        return e.trim();
                    });
                }
                catch(err) {
                    console.log("Problema cargando los valores de datos principales del documento " + err.message);
                }

                //Limpiamos la bandera de editado
                $scope.datosPrincipales.editado = false;

                //Para palabras claves
                $scope.listaTemas.temaNuevo = {
                    mensaje: "+ Agregar"
                };
                $scope.datosPrincipalesCargando = false;
            });
        };
        $scope.datosPrincipales.datoEditado = function(campo, valorNuevo) {
            switch (campo) {
                case "tipoDocumento":
                    if (valorNuevo != $scope.datosPrincipales.archivoTitulo) {
                        $scope.registrarAccion("Tipo de documento modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "estadoConservacion":
                    if (valorNuevo != $scope.datosPrincipales.archivoFondo) {
                        $scope.registrarAccion("Estado de conservacion modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "formatoDisponible":
                    if (valorNuevo != $scope.datosPrincipales.institucionFondo) {
                        $scope.registrarAccion("Formato disponible modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "sinopsis":
                    if (valorNuevo != $scope.datosPrincipales.seccion) {
                        $scope.registrarAccion("Sinopsis modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                default:
                    $scope.registrarAccion("[ERROR] No se pueden modificar datos principales.");
                    break;
            }

        }
        
        // Temas
        $scope.listaTemas = {}
        // Para borrar Temas
        $scope.listaTemas.modificarBorrarTema = function(indexEditada, tema) {
            if (tema == "") {
                var temaEliminado = $scope.datosPrincipales.listaTemas[indexEditada];
                if (temaEliminado != "") {
                    $scope.registrarAccion("Tema <strong>" + temaEliminado + "</strong> eliminado");
                    $scope.datosPrincipales.editado = true;
                }
                $scope.datosPrincipales.listaTemas.splice(indexEditada, 1);
            } else {
                var temaModificado = $scope.datosPrincipales.listaTemas[indexEditada];
                if (tema != temaModificado) {
                    $scope.registrarAccion("Tema <strong>" + temaModificado + "</strong> Modificado a <strong>" + tema + "</strong>");
                    $scope.datosPrincipales.listaTemas[indexEditada] = tema;
                    $scope.datosPrincipales.editado = true;
                }
            }
        }
        //Para agregar temas
        $scope.listaTemas.temaNuevo = {
            mensaje: '+ Agregar'
        };
        $scope.listaTemas.borrarCampo = function() {
            $scope.listaTemas.temaNuevo.mensaje = "";
        }
        $scope.listaTemas.mostrarCampo = function() {
            $scope.listaTemas.temaNuevo.mensaje = "+ Agregar";
        }
        $scope.listaTemas.agregarTemaNuevo = function(tema) {
            if (!$scope.datosPrincipales.listaTemas.includes(tema) && tema.length != 0) {
                $scope.datosPrincipales.listaTemas.push(tema);
                $scope.registrarAccion("Tema <strong>" + tema + "</strong> agregado");
                $scope.datosPrincipales.editado = true;
            }
            $scope.listaTemas.temaNuevo.mensaje = "+ Agregar";
        }
        
        // Emisor y receptor
        $scope.emisorReceptorEditado = false;
        $scope.emisorReceptor = [];
        $scope.emisorReceptorEliminar = [];
        $scope.emisorReceptorActivo = 0;
        // Para eliminar una entrada emisorReceptor
        $scope.eliminarEmisorReceptor = function (index) {
            $scope.emisorReceptorEditado = true;
            if ($scope.emisorReceptor[index].emisorReceptorID != -1) {
                $scope.emisorReceptorEliminar.push($scope.emisorReceptor[index].emisorReceptorID);
            }
            $scope.emisorReceptor.splice(index,1);
            $timeout(function() {
                $scope.emisorReceptorActivo = index-1; // El nuevo elemento es el activo
            });
        }
        // Para agregar una entrada emisorReceptor
        $scope.agregarEmisorReceptor = function () {
            $scope.emisorReceptorEditado = true;
            var nuevoEmisorReceptor = {}
            nuevoEmisorReceptor.emisorReceptorID = -1;
            nuevoEmisorReceptor.nuevo = true;
            nuevoEmisorReceptor.emisor= {
                personaje: "",
                cargo: "",
                institucion: "",
                nota: ""
            }
            nuevoEmisorReceptor.receptor= {
                personaje: "",
                cargo: "",
                institucion: "",
                nota: ""
            }
            // Agregarlo a la lista de emisor y receptor
            $scope.emisorReceptor.push(nuevoEmisorReceptor);
            
            $timeout(function() {
                $scope.emisorReceptorActivo = $scope.emisorReceptor.length - 1; // El nuevo elemento es el activo
            });
        }
        // Para modificar el emisor de una entrada emisorReceptor
        $scope.modificarEmisor = function (index, elementoEditado, valorNuevo) {
            $scope.emisorReceptorEditado = true;
            switch(elementoEditado) {
                case "personaje":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.personaje) {
                        $scope.registrarAccion("Personaje emisor  <strong>" + $scope.emisorReceptor[index].emisor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "cargo":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.cargo) {
                        $scope.registrarAccion("Cargo personaje emisor <strong>" + $scope.emisorReceptor[index].emisor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.institucion) {
                        $scope.registrarAccion("Institucion emisora <strong>" + $scope.emisorReceptor[index].emisor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "nota":
                    if (valorNuevo != $scope.emisorReceptor[index].emisor.nota) {
                        $scope.registrarAccion("nota emisor modificada en Emisor Receptor "+(index + 1));
                    }
                    break;
                default:
                $scope.registrarAccion("[ERROR] DATO EMISOR INCORRECTO!");
                    break;
            }
        }
        // Para modificar el receptor de una entrada emisorReceptor
        $scope.modificarReceptor = function (index, elementoEditado, valorNuevo) {
            $scope.emisorReceptorEditado = true;
            switch(elementoEditado) {
                case "personaje":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.personaje) {
                        $scope.registrarAccion("Personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.personaje + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "cargo":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.cargo) {
                        $scope.registrarAccion("Cargo personaje receptor <strong>" + $scope.emisorReceptor[index].receptor.cargo + "</strong> modificado a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.institucion) {
                        $scope.registrarAccion("Institucion receptora <strong>" + $scope.emisorReceptor[index].receptor.institucion + "</strong> modificada a <strong>" + valorNuevo + "</strong> en Emisor Receptor "+(index + 1));
                    }
                    break;
                case "nota":
                    if (valorNuevo != $scope.emisorReceptor[index].receptor.nota) {
                        $scope.registrarAccion("nota receptor modificada en Emisor Receptor "+index);
                    }
                    break;
                default:
                $scope.registrarAccion("[ERROR] DATO INCORRECTO!");
                    break;
            }
        }
        $scope.cargarEmisorReceptor = function () {
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID).then(function(data) {
                if (!String(data.data).startsWith("[WARNING]")) {
                    //Obtener los datos JSON
                    var emisorReceptorDatos = data.data[0];

                    //Log
                    console.log(emisorReceptorDatos);

                    try {
                        //Llenamos los datos del documento
                        emisorReceptorDatos.forEach(function (emisorReceptorEntrada) {
                            var nuevoEmisorReceptor = {}
                            nuevoEmisorReceptor.emisorReceptorID = emisorReceptorDatos.origenDestinoID;
                            nuevoEmisorReceptor.emisor= {
                                personaje: emisorReceptorEntrada.emitidoPorID,
                                cargo: emisorReceptorEntrada.cargoEmisor,
                                institucion: emisorReceptorEntrada.institucionEmisorID,
                                nota: emisorReceptorEntrada.notasEmisor
                            }
                            nuevoEmisorReceptor.receptor= {
                                personaje: emisorReceptorEntrada.dirigidoAID,
                                cargo: emisorReceptorEntrada.cargoReceptor,
                                institucion: emisorReceptorEntrada.institucionReceptorID,
                                nota: emisorReceptorEntrada.notasReceptor
                            }
                            $scope.emisorReceptor.push(nuevoEmisorReceptor);
                        });
                    }
                    catch(err) {
                        console.log("Problema cargando los emisores y receptores de la base de datos");
                    }
                }

                //Limpiamos la bandera de editado
                $scope.emisorReceptorEditado = false;
                });
        }
        
        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function() {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosNotas?documentoID=' + $scope.documentoID).then(function(data) {
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
        
        // PERSONAJES
        $scope.personajes = [];
        $scope.personajesNuevos = [];
        $scope.personajesAEliminar = [];
        $scope.personajesAgregarReferencia = [];
        $scope.personajesCambios = false;
        $scope.cargarPersonajes = function () {
            $scope.personajesCambios = false;
            $scope.personajes = [];
            $scope.personajesNuevos = [];
            $scope.personajesAEliminar = [];
            $scope.personajesAgregarReferencia = [];
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefPersonajes?documentoID=' + $scope.documentoID).then(function(data) {
                // revisar si existe alguno
                if (!String(data.data).startsWith("[WARNING]")) {
                    var personajesReferencias = data.data;
                    personajesReferencias.forEach(function(referencia) {
                            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes?personajeID=' + referencia.personajeID).then(function(data) {
                                var personaje = data.data[0];
                                personaje.referenciaID = referencia.referenciaID;
                                $scope.personajes.push(personaje);
                            });
                    });
                    // LOG
                    console.log($scope.personajes);
                }
            });
        }
        $scope.agregarPersonaje = function () {
            var personajeNuevo = {
                personajeID: -1,
                nombre: "",
                ocupacion: "",
                nacionalidad: "",
                sexo: "",
                categoria: ""
            };
            $scope.personajesNuevos.push(personajeNuevo);
            $scope.personajesCambios = true;
            $scope.registrarAccion("Personaje vacío agregado")
        };
        $scope.borrarNuevoPersonaje = function (indice) {
            $scope.personajesNuevos.splice(indice,1);
            $scope.registrarAccion("Personaje nuevo borrado");
        };
        $scope.borrarPersonajeExistente = function(indice) {
            $scope.registrarAccion("Personaje " + $scope.personajes[indice].nombre + " seleccionado para eliminar")
            $scope.personajesAEliminar.push($scope.personajes[indice]);
            $scope.personajes.splice(indice,1);
            $scope.personajesCambios = true;
        }
        $scope.borrarReferenciaNuevaPersonaje = function (indice) {
            $scope.personajesAgregarReferencia.splice(indice,1);
            $scope.registrarAccion("Nueva referencia a personaje borrada");
        };
        $scope.autocompletarPersonaje = function (hintNombre) {
            return $http.get('http://monsalvediaz.com:5000/PIMC0.1/Autocompletar/Personajes?nombre=' + hintNombre).then(function(data) {
                var listaNombres = [];
                var resultados = data.data;
                var matchPerfecto = false;
                if (resultados != "0") {
                    resultados.forEach( function (valor) {
                        listaNombres.push({nombre: valor.nombre, personajeID: valor.personajeID});
                        // Revisamos si son identicos
                        // TODO cambiar acentos 
                        if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombre).toLowerCase().replace(/\s/g, ''))
                            matchPerfecto = true;
                    })
                }
                if (!matchPerfecto && listaNombres.length != 0)
                        listaNombres.unshift({nombre:hintNombre,personajeID:-1})
                return listaNombres;
            });
        };
        $scope.actualizarPersonajeNuevoExistente = function (indice,personaje) {
            var alreadyExist = false;
            // Revisamos si ya existe
            $scope.personajes.forEach(function (elemento) {
                if (personaje.personajeID == elemento.personajeID) {
                    alreadyExist = true;
                    personaje.nombre = "";
                    return;
                }
            });
            // Revisamos si la referencia fue eliminada anteriormente
            $scope.personajesAEliminar.forEach(function (elemento) {
                if (personaje.personajeID == elemento.personajeID) {
                    alreadyExist = true;
                    personaje.nombre = "";
                    return;
                }
            });
            $scope.personajesAgregarReferencia.forEach(function (elemento) {
                if (personaje.personajeID == elemento.personajeID) {
                    alreadyExist = true;
                    personaje.nombre = "";
                    return;
                }
            });
            
            if (!alreadyExist && personaje.personajeID !== -1) {
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Personajes', {
                    params: {
                    personajeID: personaje.personajeID
                    }}).then(function(data) {
                    var infoPersonaje = data.data[0];
                    if (!String(infoPersonaje).startsWith("[WARNING]")) {
                        $scope.personajesNuevos.splice(indice,1);
                        var nuevaReferencia = {
                                personajeID: infoPersonaje.personajeID,
                                nombre: infoPersonaje.nombre,
                                ocupacion: infoPersonaje.ocupacion,
                                nacionalidad: infoPersonaje.nacionalidad,
                                sexo: infoPersonaje.sexo,
                                categoria: infoPersonaje.categoria
                        }
                        $scope.personajesAgregarReferencia.push(nuevaReferencia);
                    }
                });
            }

        };
        $scope.abrirPersonajeSeleccionado = function(index, ubicacion) {
            var seleccionado = -1;
            if (ubicacion == "nuevaRef") {
                seleccionado = $scope.personajesAgregarReferencia[index].personajeID;
            } else if (ubicacion == "existente") {
                seleccionado = $scope.personajes[index].personajeID;
            }
            if (seleccionado != -1) {
                console.log("Abriendo documento" + seleccionado);
                //TODO Enviar varios seleccionados
                //TODO Preguntar si desea guardar cambios
                $window.localStorage.setItem("archivoID", $scope.archivoID);
                $window.localStorage.setItem("documentoID", $scope.documentoID);
                $window.localStorage.setItem("personajeID", seleccionado);
                $window.location.href = "#!/personaje";
            }
        };
        $scope.revisarSiPersonajeExiste = function ($value) {
            var existe = false;
            var mensaje = "";
            $scope.personajes.forEach( function(personaje) {
                if ($value == personaje.nombre) {
                    existe = true;
                    mensaje = "Este nombre ya existe";
                    return;
                }
            });
            $scope.personajesAEliminar.forEach( function(personajeEliminado){
                if ($value == personajeEliminado.nombre) {
                    existe = true;
                    mensaje = "Este nombre ya existía, fue eliminado pero los cambios no han sido guardados.";
                    return;
                }
            });
            $scope.personajesAgregarReferencia.forEach( function(personajeRefNueva) {
                if ($value == personajeRefNueva.nombre) {
                    existe = true;
                    mensaje = "Ref ya agregada";
                    return;
                }
            });
            $scope.personajesNuevos.forEach( function(personajeNuevo) {
                if ($value == personajeNuevo.nombre) {
                    existe = true;
                    mensaje = "Personaje ya agregado";
                    return;
                }
            });
            if (existe) {
                return mensaje;
            }
        }
        
        // EMBARCACIONES
        $scope.embarcaciones = [];
        $scope.embarcacionesNuevas = [];
        $scope.embarcacionesAEliminar = [];
        $scope.embarcacionesAgregarReferencia = [];
        $scope.embarcacionesCambios = false;
        $scope.cargarEmbarcaciones = function () {
            $scope.embarcacionesCambios = false;
            $scope.embarcaciones = [];
            $scope.embarcacionesNuevas = [];
            $scope.embarcacionesAEliminar = [];
            $scope.embarcacionesAgregarReferencia = [];
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/DocumentosRefEmbarcacion',
                        { params: {
                            documentoID:$scope.documentoID
                        }
                        }
            ).then(function(data) {
                // revisar si existe alguno
                if (!String(data.data).startsWith("[WARNING]")) {
                    var embarcacionReferencias = data.data;
                    embarcacionReferencias.forEach(function(referencia) {
                            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones',
                                    { params: {
                                        embarcacionID:referencia.embarcacionID
                                        }
                                    }
                            ).then(function(data) {
                                var embarcacion = data.data[0];
                                embarcacion.referenciaID = referencia.referenciaID;
                                embarcacion.comentario = referencia.comentario;
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesBanderas',
                                    { params: {
                                        embarcacionID:referencia.embarcacionID
                                        }
                                    }
                                ).then(function(data) {
                                    var banderas = data.data;
                                    var listaBanderas = [];
                                    banderas.forEach(function(bandera) {
                                        listaBanderas.push(bandera.bandera);
                                    });
                                    embarcacion.banderas = listaBanderas.join(', ');
                                    $scope.embarcaciones.push(embarcacion);
                                
                                });
                            });
                            
                    });
                    // LOG
                    console.log($scope.embarcaciones);
                }
            });
        }
        $scope.agregarEmbarcacion = function () {
            var embarcacionNueva = {
                embarcacionID: -1,
                nombres: "",
                alias: "",
                tipo: "",
                banderas: "",
                usos: "",
                categoria: "",
                comentario: ""
            };
            $scope.embarcacionesNuevas.push(embarcacionNueva);
            $scope.embarcacionesCambios = true;
            $scope.registrarAccion("Embarcacion vacía agregada")
        };
        $scope.borrarNuevaEmbarcacion = function (indice) {
            $scope.embarcacionesNuevas.splice(indice,1);
            $scope.registrarAccion("Embarcación nueva borrada");
        };
        $scope.borrarEmbarcacionExistente = function(indice) {
            $scope.registrarAccion("Embarcación " + $scope.embarcaciones[indice].nombres + " seleccionada para eliminar")
            $scope.embarcacionesAEliminar.push($scope.embarcaciones[indice]);
            $scope.embarcaciones.splice(indice,1);
            $scope.embarcacionesCambios = true;
        }
        $scope.borrarReferenciaNuevaEmbarcacion = function (indice) {
            $scope.embarcacionesAgregarReferencia.splice(indice,1);
            $scope.registrarAccion("Nueva referencia a embarcación borrada");
        };
        $scope.autocompletarEmbarcacion = function (hintNombre) {
            return $http.get('http://monsalvediaz.com:5000/PIMC0.1/Autocompletar/Embarcaciones',
                            { params: {
                                nombres:hintNombre
                                }
                            }
                    ).then(function(data) {
                        var listaNombres = [];
                        var resultados = data.data;
                        var matchPerfecto = false;
                        if (resultados != "0") {
                            resultados.forEach( function (valor) {
                                listaNombres.push({nombres: valor.nombres, embarcacionID: valor.embarcacionID});
                                // Revisamos si son identicos
                                // TODO cambiar acentos 
                                if (String(hintNombre).toLowerCase().replace(/\s/g, '') == String(valor.nombres).toLowerCase().replace(/\s/g, ''))
                                    matchPerfecto = true;
                            })
                        }
                        if (!matchPerfecto && listaNombres.length != 0)
                                listaNombres.unshift({nombres:hintNombre,embarcacionID:-1})
                        return listaNombres;
                    });
        };
        $scope.actualizarEmbarcacionNuevaExistente = function (indice,embarcacion) {
            var alreadyExist = false;
            // Revisamos si ya existe
            $scope.embarcaciones.forEach(function (elemento) {
                if (embarcacion.embarcacionID == elemento.embarcacionID) {
                    alreadyExist = true;
                    embarcacion.nombres = "";
                    return;
                }
            });
            // Revisamos si la referencia fue eliminada anteriormente
            $scope.embarcacionesAEliminar.forEach(function (elemento) {
                if (embarcacion.embarcacionID == elemento.embarcacionID) {
                    alreadyExist = true;
                    embarcacion.nombres = "";
                    return;
                }
            });
            $scope.embarcacionesAgregarReferencia.forEach(function (elemento) {
                if (embarcacion.embarcacionID == elemento.embarcacionID) {
                    alreadyExist = true;
                    embarcacion.nombres = "";
                    return;
                }
            });
            
            if (!alreadyExist && embarcacion.embarcacionID !== -1) {
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/Embarcaciones', {
                    params: {
                    embarcacionID: embarcacion.embarcacionID
                    }}
                ).then(function(data) {
                    var infoEmbarcacion = data.data[0];
                    if (!String(infoEmbarcacion).startsWith("[WARNING]")) {
                        $scope.embarcacionesNuevas.splice(indice,1);
                        var nuevaReferencia = {
                                embarcacionID: infoEmbarcacion.embarcacionID,
                                alias: infoEmbarcacion.alias,
                                tipo: infoEmbarcacion.tipo,
                                usos: infoEmbarcacion.usos,
                                categoria: infoEmbarcacion.categoria,
                                comentario: infoEmbarcacion.comentario
                        }
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/EmbarcacionesBanderas', {
                            params: {
                            embarcacionID: embarcacion.embarcacionID
                            }}
                        ).then(function(data) {
                            if (!String(infoEmbarcacion).startsWith("[WARNING]")) {
                                var banderas = data.data;
                                var listaBanderas = [];
                                banderas.forEach(function(bandera) {
                                    listaBanderas.push(bandera.bandera);
                                });
                                nuevaReferencia.banderas = listaBanderas.join(', ');
                                $scope.embarcacionesAgregarReferencia.push(nuevaReferencia);
                            }
                        });
                    }
                });
            }

        };
        $scope.abrirEmbarcacionSeleccionada = function(index, ubicacion) {
            var seleccionado = -1;
            if (ubicacion == "nuevaRef") {
                seleccionado = $scope.embarcacionesAgregarReferencia[index].embarcacionID;
            } else if (ubicacion == "existente") {
                seleccionado = $scope.embarcaciones[index].embarcacionID;
            }
            if (seleccionado != -1) {
                console.log("Abriendo documento" + seleccionado);
                //TODO Enviar varios seleccionados
                //TODO Preguntar si desea guardar cambios
                $window.localStorage.setItem("archivoID", $scope.archivoID);
                $window.localStorage.setItem("documentoID", $scope.documentoID);
                $window.localStorage.setItem("embarcacionID", seleccionado);
                $window.location.href = "#!/embarcacion";
            }
        };
        $scope.revisarSiEmbarcacionExiste = function ($value) {
            var existe = false;
            var mensaje = "";
            $scope.embarcaciones.forEach( function(embarcacion) {
                if ($value == embarcacion.nombres) {
                    existe = true;
                    mensaje = "Este nombres ya existe";
                    return;
                }
            });
            $scope.embarcacionesAEliminar.forEach( function(embarcacionEliminada){
                if ($value == embarcacionEliminada.nombres) {
                    existe = true;
                    mensaje = "Este nombres ya existía, fue eliminado pero los cambios no han sido guardados.";
                    return;
                }
            });
            $scope.embarcacionesAgregarReferencia.forEach( function(embarcacionRefNueva) {
                if ($value == embarcacionRefNueva.nombres) {
                    existe = true;
                    mensaje = "Ref ya agregada";
                    return;
                }
            });
            $scope.embarcacionesNuevas.forEach( function(embarcacionNueva) {
                if ($value == embarcacionNueva.nombres) {
                    existe = true;
                    mensaje = "Embarcación ya agregado";
                    return;
                }
            });
            if (existe) {
                return mensaje;
            }
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
            //Revisamos datos principales editados
            if ($scope.datosPrincipales.editado) {
                $scope.registrarAccion("Actualizando BD Documentos");
                var request = 'http://monsalvediaz.com:5000/PIMC0.1/Modificar/Documentos?idUnico=archivoID&idUnico2=documentoID&archivoID=' + $scope.archivoID + 
                    '&documentoID=' + $scope.documentoID;
                var agregado = false;
                if ($scope.datosPrincipales.tipoDocumento != "" && $scope.datosPrincipales.tipoDocumento != null) {
                    request = request + '&tipoDocumento="' + $scope.datosPrincipales.tipoDocumento;
                    agregado = true;
                }
                if ($scope.datosPrincipales.estadoConservacion != "" && $scope.datosPrincipales.estadoConservacion != null) {
                    request = request + '"&estadoConservacion="' + $scope.datosPrincipales.estadoConservacion;
                    agregado = true;
                }
                if ($scope.datosPrincipales.formatoDisponible!= "" && $scope.datosPrincipales.formatoDisponible != null) {
                    request = request + '"&formatoDisponible="' + $scope.datosPrincipales.formatoDisponible;
                    agregado = true;
                }
                if ($scope.datosPrincipales.fechaMinima != "" && $scope.datosPrincipales.fechaMinima != null) {
                    request = request + '"&fechaMinima="' + $scope.datosPrincipales.fechaMinima;
                    agregado = true;
                }
                if ($scope.datosPrincipales.fechaMinFormato != "" && $scope.datosPrincipales.fechaMinFormato != null) {
                    request = request + '"&fechaMinFormato="' + $scope.datosPrincipales.fechaMinFormato;
                    agregado = true;
                }
                if ($scope.datosPrincipales.fechaMaxima != "" && $scope.datosPrincipales.fechaMaxima != null) {
                    request = request + '"&fechaMaxima="' + $scope.datosPrincipales.fechaMaxima;
                    agregado = true;
                }
                if ($scope.datosPrincipales.fechaMaxFormato != "" && $scope.datosPrincipales.fechaMaxFormato != null) {
                    request = request + '"&fechaMaxFormato="' + $scope.datosPrincipales.fechaMaxFormato;
                    agregado = true;
                }
                if ($scope.datosPrincipales.sinopsis != "" && $scope.datosPrincipales.sinopsis != null) {
                    request = request + '"&sinopsis="' + $scope.datosPrincipales.sinopsis;
                    agregado = true;
                }
                if ($scope.datosPrincipales.listaTemas.length != 0) {
                    request = request + '"&listaTemas="' + $scope.datosPrincipales.listaTemas.join(', ');
                    agregado = true;
                }
                if (agregado) {
                    request = request + '"';
                    $http.get(request).then(function(data) {
                        $scope.datosGuardados = true;
                        console.log(data);
                    });
                }
            }
            // Anotaciones
            if ($scope.notasCambios) {
                $scope.registrarAccion("Actualizando BD notasArchivo");
                $scope.notasCambios = false;
                $scope.notas.forEach(function(nota) {
                    // Insertamos notas nuevas
                    if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosNotas?documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                        });
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/DocumentosNotas?idUnico2=documentoID&idUnico=notaID&notaID=' + nota.notaID + ' &documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                        });
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function(nota) {
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosNotas?idUnico2=documentoID&idUnico=notaID&notaID=' + nota.notaID + ' &documentoID=' + $scope.documentoID).then(function(data) {
                        $scope.datosGuardados = true;
                        console.log(data);
                    });
                });

            }
            
            // Emisor Receptor
            if ($scope.emisorReceptorEditado) {
                $scope.emisorReceptor.forEach( function (entrada) {
                    // Agregar a la base de datos
    //                  if (entrada.emisorReceptorID == -1) {
    //                      $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosEmisorReceptor?documentoID=' + $scope.documentoID + '&nota="' + nota.nota + '"&referencia="' + nota.referencia + '"').then(function(data) {
    //                          $scope.datosGuardados = true;
    //                          console.log(data);
    //                      });
    //                  }
                });
            }
            
            // EMBARCACIONES
            if ($scope.embarcacionesCambios)  {
                // agregar referencias a embarcaciones existentes
                $scope.embarcacionesAgregarReferencia.forEach( function (embarcacion) {
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefEmbarcacion',{
                        params: {
                            documentoID: $scope.documentoID,
                            embarcacionID: embarcacion.embarcacionID,
                            comentario: '"'+embarcacion.comentario+'"'
                        }
                    }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                    });
                });
                // Eliminamos referencias existentes
                $scope.embarcacionesAEliminar.forEach (function (embarcacionRefABorrar) {
                    $scope.registrarAccion("Referencia a embarcacion existente eliminada");
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosRefEmbarcacion',{
                        params: {
                            idUnico: 'referenciaID',
                            referenciaID: embarcacionRefABorrar.referenciaID
                        }
                    }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                    });
                });
                // Creamos embarcaciones nuevas y agregamos referencia
                $scope.embarcacionesNuevas.forEach( function (embarcacion) {
                    // revisar si el personaje nombre esta vacio
                    if (embarcacion.nombres !== "") {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Embarcaciones',{
                            params: {
                                    nombres: '"'+embarcacion.nombres+'"',
                                    alias: '"'+embarcacion.alias+'"',
                                    tipo: '"'+embarcacion.tipo+'"',
                                    usos: '"'+embarcacion.usos+'"',
                                    categoria: '"'+embarcacion.categoria+'"',
                            }
                        }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                            // Data contains the last insert id
                            if (!String(data.data).startsWith("[WARNING]")) {
                                // Agregamos las banderas
                                var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefEmbarcacion',{
                                params: {
                                    documentoID: $scope.documentoID,
                                    embarcacionID: lastInsertID,
                                    comentario: "'" + embarcacion.comentario + "'"
                                }
                                }).then(function(data) {
                                    $scope.datosGuardados = true;
                                    console.log(data);
                                });
                                var listaBanderas = embarcacion.banderas.split(",");
                                listaBanderas = listaBanderas.map(function(e) {
                                    return e.trim();
                                });
                                listaBanderas.forEach(function (banderaAgregar) {
                                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/EmbarcacionesBanderas',{
                                    params: {
                                        embarcacionID: lastInsertID,
                                        bandera: "'" + banderaAgregar + "'"
                                    }
                                    }).then(function(data) {
                                        $scope.datosGuardados = true;
                                        console.log(data);
                                    });
                                });
                            }
                        });
                    }
                });
            }
                
            // PERSONAJES
            if ($scope.personajesCambios) 
            {
                // agregar referencias a personajes existentes
                $scope.personajesAgregarReferencia.forEach( function (personaje) {
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefPersonajes',{
                        params: {
                            documentoID: $scope.documentoID,
                            personajeID: personaje.personajeID
                        }
                    }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                    });
                });
                // Eliminamos referencias existentes
                $scope.personajesAEliminar.forEach (function (personajeRefABorrar) {
                    $scope.registrarAccion("Referencia existente eliminada");
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/DocumentosRefPersonajes',{
                        params: {
                            idUnico: 'referenciaID',
                            referenciaID: personajeRefABorrar.referenciaID
                        }
                    }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                    });
                });
                // Creamos personajes nuevos y agregamos referencia
                $scope.personajesNuevos.forEach( function (personaje) {
                    // revisar si el personaje nombre esta vacio
                    if (personaje.nombre !== "") {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/Personajes',{
                            params: {
                                nombre: '"'+personaje.nombre+'"',
                                ocupacion: '"'+personaje.ocupacion+'"',
                                nacionalidad: '"'+personaje.nacionalidad+'"',
                                sexo: '"'+personaje.sexo+'"',
                                categoria: '"'+personaje.categoria+'"'
                            }
                        }).then(function(data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                            // Data contains the last insert id
                            if (!String(data.data).startsWith("[WARNING]")) {
                                var lastInsertID = data.data[0]["LAST_INSERT_ID()"];
                                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/DocumentosRefPersonajes',{
                                params: {
                                    documentoID: $scope.documentoID,
                                    personajeID: lastInsertID
                                }
                                }).then(function(data) {
                                    $scope.datosGuardados = true;
                                    console.log(data);
                                })
                            }
                        });
                    }
                });
            }
            $timeout(function () {init();},200);
        };
        
        $timeout(function () {init();});
        
    }]);
    
    documentoPerfil.directive("uibTabAgregar", function() {
        return {
            restrict: 'EA',
            scope: {
            handler: '&',
            text:'@'
            },
            template: '<li class="uib-tab nav-item">' +
            '<a ng-click="handler()" class="nav-link" ng-bind="text"></a>' +
            '</li>',
            replace: true
        }
    });

    documentoPerfil.run(function(editableOptions, editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        editableOptions.buttons = 'no';
    });

})(window.angular);

