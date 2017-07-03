(function (angular) {
    'use strict';
    var archivoPerfilControllerApp = angular.module('archivoPerfil', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.grid', 'ngTouch', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.selection', 'ui.grid.cellNav', 'xeditable'])
    .controller('archivoPerfilController', [ '$scope','$sce', '$http', '$window', '$location', '$filter', 'uiGridConstants', 'i18nService', '$scope', function ( $scope, $sce, $http, $window, $location, $filter, i18nService, uiGridConstants) {
        var init = function () {
            $scope.archivoID = $window.localStorage.getItem("archivoID");
            if (!$scope.datosGuardados){
                $scope.registrarAccion("Archivo <b>" + $scope.archivoID + "</b> ha sido cargado");
            } else {
                $scope.registrarAccion("Archivo <b>" + $scope.archivoID + "</b> ha sido guardado en la base de datos");
                $scope.datosGuardados = false;
            }
            // DATOS PRINCIPALES
            $scope.cargarDatosPrincipales();
            // ANOTACIONES
            $scope.cargarNotas();
        };

        //Datos principales
        $scope.archivoDatos = {};
        $scope.datosPrincipales = {};
        $scope.datosPrincipales.archivoTitulo = "";
        $scope.datosPrincipales.archivoFondo = "";
        $scope.datosPrincipales.institucionFondo = "";
        $scope.datosPrincipales.seccion = "";
        $scope.datosPrincipales.numRefDentroFondo = "";
        $scope.datosPrincipales.fechaInicial = "";
        $scope.datosPrincipales.fechaFinal = "";
        $scope.datosPrincipales.folioInicial = "";
        $scope.datosPrincipales.folioFinal = "";
        $scope.datosPrincipales.legajo = "";
        $scope.datosPrincipales.numOrden = "";
        $scope.datosPrincipales.numPaginas = "";
        $scope.datosPrincipales.palabrasClaves = {};
        $scope.datosPrincipales.disponibilidad = "";

        //Bandera para saber cuando guardar o no
        $scope.datosPrincipales.editado = false;

        $scope.cargarDatosPrincipales = function () {
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/ConsultaArchivo?archivoID=' + $scope.archivoID).then(function (data) {
                //Obtener los datos JSON
                $scope.archivoDatos = data.data[0];
                //Log
                console.log($scope.archivoDatos);

                //Llenamos los datos del archivo
                $scope.datosPrincipales.archivoTitulo = $scope.archivoDatos.titulo;
                $scope.datosPrincipales.archivoFondo = $scope.archivoDatos.fondo;
                $scope.datosPrincipales.institucionFondo = $scope.archivoDatos.institucionFondo;
                $scope.datosPrincipales.seccion = $scope.archivoDatos.seccion;
                $scope.datosPrincipales.numRefDentroFondo = $scope.archivoDatos.numRefDentroFondo;
                $scope.datosPrincipales.fechaInicial = "" + $filter('date')(new Date($scope.archivoDatos.fechaInicial), String($scope.archivoDatos.fechaInicialFormato).toLowerCase());
                $scope.datosPrincipales.fechaFinal = "" + $filter('date')(new Date($scope.archivoDatos.fechaFinal), String($scope.archivoDatos.fechaFinalFormato).toLowerCase());
                $scope.datosPrincipales.folioInicial = $scope.archivoDatos.folioInicial;
                $scope.datosPrincipales.folioFinal = $scope.archivoDatos.folioFinal;
                $scope.datosPrincipales.legajo = $scope.archivoDatos.legajo;
                $scope.datosPrincipales.numOrden = $scope.archivoDatos.numOrden;
                $scope.datosPrincipales.numPaginas = $scope.archivoDatos.numPaginas;
                $scope.datosPrincipales.palabrasClaves = $scope.archivoDatos.palabrasClaves.split(",");
                $scope.datosPrincipales.palabrasClaves = $scope.datosPrincipales.palabrasClaves.map(function (e) { return e.trim(); });

                $scope.datosPrincipales.disponibilidad = $scope.archivoDatos.disponibilidad;
                //Limpiamos la bandera de editado
                $scope.datosPrincipales.editado = false;

                //Para palabras claves
                $scope.palabrasClaves.palabraNueva = {mensaje:"+Agregar"};

            });
        };
        $scope.datosPrincipales.datoEditado = function (campo,valorNuevo) {
            switch(campo) {
                case "titulo":
                    if (valorNuevo != $scope.datosPrincipales.archivoTitulo) {
                        $scope.registrarAccion("Titulo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fondo":
                    if (valorNuevo != $scope.datosPrincipales.archivoFondo) {
                        $scope.registrarAccion("Fondo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "institucion":
                    if (valorNuevo != $scope.datosPrincipales.institucionFondo) {
                        $scope.registrarAccion("Institucion Fondo modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "seccion":
                    if (valorNuevo != $scope.datosPrincipales.seccion) {
                        $scope.registrarAccion("Seccion modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numReferencia":
                    if (valorNuevo != $scope.datosPrincipales.numRefDentroFondo) {
                        $scope.registrarAccion("Numero Referencia dentro del fondo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fechaInicial":
                    if (valorNuevo != $scope.datosPrincipales.fechaInicial) {
                        $scope.registrarAccion("Fecha Inicial modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "fechaFinal":
                    if (valorNuevo != $scope.datosPrincipales.fechaFinal) {
                        $scope.registrarAccion("Fecha Fianl modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "folioInicial":
                    if (valorNuevo != $scope.datosPrincipales.folioInicial) {
                        $scope.registrarAccion("Folio Inicial modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "folioFinal":
                    if (valorNuevo != $scope.datosPrincipales.folioFinal) {
                        $scope.registrarAccion("Folio Final modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "legajo":
                    if (valorNuevo != $scope.datosPrincipales.legajo) {
                        $scope.registrarAccion("Legajo modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numOrden":
                    if (valorNuevo != $scope.datosPrincipales.numOrden) {
                        $scope.registrarAccion("Numero de Orden modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "numPaginas":
                    if (valorNuevo != $scope.datosPrincipales.numPaginas) {
                        $scope.registrarAccion("Numero de Paginas modificado");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                case "disponibilidadConsulta":
                    if (valorNuevo != $scope.datosPrincipales.disponibilidad) {
                        $scope.registrarAccion("Disponibilidad de consulta modificada");
                        $scope.datosPrincipales.editado = true;
                    }
                    break;
                default:
                    $scope.registrarAccion("[ERROR] Caso de modificacion de datos principales no considerado");
                    break;
                        }

        }

        // Anotaciones
        $scope.notas = "";
        $scope.notasAEliminar = [];
        $scope.notasCambio = false;
        $scope.cargarNotas = function () {
            $scope.notas = "";
            $scope.notasAEliminar = [];
            $scope.notasCambio = false;
            $http.get('http://monsalvediaz.com:5000/PIMC0.1/Consulta/ArchivosNotas?archivoID=' + $scope.archivoID).then(function (data) {
                if (!String(data.data).startsWith("[WARNING]")) {
                    $scope.notas = data.data;
                    $scope.notas.forEach( function (nota) {
                        nota.modificada = false;
                    });
                    // LOG
                    console.log($scope.notas);
                }
            });

        };
        $scope.agregarNotaVacia = function () {
            $scope.registrarAccion("Nota vacia agregada");
            // Una nota que no tiene fecha de creacion es una nota que no existe en la base de datos aun
            if ($scope.notas === "") {
                $scope.notas = [{
                    nota:"",
                    referencia:"",
                    fechaCreacion:"",
                    fechaHistorica:"",
                    fechaHistFormato:"",
                    modificada: false
                }];
            } else {
                $scope.notas.push({
                    nota:"",
                    referencia:"",
                    fechaCreacion:"",
                    fechaHistorica:"",
                    fechaHistFormato:"",
                    modificada: false
                });
            }
            $scope.notasCambios = true;
        }
        $scope.eliminarNota = function(indexNota) {
            $scope.registrarAccion("Nota <b>" + indexNota + "</b> eliminada");
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notasAEliminar.push($scope.notas[indexNota]);
            }
            $scope.notas.splice(indexNota,1);
            $scope.notasCambios = true;
        };
        $scope.modificarNota = function(indexNota,nuevaNota) {
            $scope.registrarAccion("Nota <b>" + indexNota + "</b> modificada");
            $scope.notas[indexNota].nota = nuevaNota;
            // fecha creacion esta vacia cuando la nota aun no se encuentra
            // en la base de dats
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            };
            $scope.notasCambios = true;
        };
        $scope.modificarReferencia = function(indexNota,nuevaReferencia) {
            $scope.registrarAccion("Referencia de nota <b>" + indexNota + "</b> modificada");
            $scope.notas[indexNota].referencia = nuevaReferencia;
            if ($scope.notas[indexNota].fechaCreacion != "") {
                $scope.notas[indexNota].modificada = true;
            }
            $scope.notasCambios = true;

        };


        // Palabras claves
        $scope.palabrasClaves = {}
        // Para borrar palabras claves
        $scope.palabrasClaves.modificarBorrarPalabra = function (indexEditada, palabra) {
            if (palabra == "") {
                var palabraEliminada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if( palabraEliminada != "") {
                    $scope.registrarAccion("palabra clave <b>" + palabraEliminada + "</b> eliminada");
                    $scope.datosPrincipales.editado = true;
                }
                $scope.datosPrincipales.palabrasClaves.splice(indexEditada,1);
            }
            else {
                var palabraModificada = $scope.datosPrincipales.palabrasClaves[indexEditada];
                if( palabra != palabraModificada) {
                    $scope.registrarAccion("palabra clave <b>" + palabraModificada + "</b> Modificada a <b>" + palabra + "</b>");
                    $scope.datosPrincipales.palabrasClaves[indexEditada] = palabra;
                    $scope.datosPrincipales.editado = true;
                }
            }
        }
        //Para agregar palabras claves
        $scope.palabrasClaves.palabraNueva = {mensaje: '+Agregar'};
        $scope.palabrasClaves.borrarCampo = function () {
            $scope.palabrasClaves.palabraNueva.mensaje = "";
        }
        $scope.palabrasClaves.mostrarCampo = function () {
            $scope.palabrasClaves.palabraNueva.mensaje = "+Agregar";
        }
        $scope.palabrasClaves.agregarPalabraNueva = function (palabra) {
            if (!$scope.datosPrincipales.palabrasClaves.includes(palabra) && palabra.length != 0) {
                $scope.datosPrincipales.palabrasClaves.push(palabra);
                $scope.registrarAccion("palabra clave <b>" + palabra + "</b> agregada");
                $scope.datosPrincipales.editado = true;
            }
            $scope.palabrasClaves.palabraNueva.mensaje = "+Agregar";
        }

        // Para guardar borrar y barra de estado
        $scope.ultimaAccion = $sce.trustAsHtml("Ninguna");
        // Log
        $scope.registrarAccion = function (mensaje) {
            $scope.ultimaAccion = $sce.trustAsHtml(mensaje);
            console.log(mensaje)
        }
        // Button functions
        $scope.borrarCambios = function () {
            if (window.confirm("Esta Seguro que quiere borrar los cambios?") === true) {
                $scope.registrarAccion("Los cambios han sido borrados");
                init();
            }
        };
        $scope.datosGuardados = false;
        $scope.guardarCambios = function () {
            if($scope.notasCambios) {
                $scope.registrarAccion("Actualizando BD notasArchivo");
                $scope.notasCambios = false;
                $scope.notas.forEach(function (nota) {
                    // Insertamos notas nuevas
                    if (nota.fechaCreacion.length == 0 && nota.nota.length != 0)
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Insertar/ArchivosNotas?ArchivoID='+ $scope.archivoID +'&nota="' + nota.nota + '"&referencia="'  + nota.referencia + '"').then(function (data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                        });
                    // Modificamos notas viejas
                    if (nota.modificada == true) {
                        $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/ArchivosNotas?idUnico2=archivoID&idUnico=notaID&notaID='+ nota.notaID +' &archivoID=' + $scope.archivoID +'&nota="' + nota.nota + '"&referencia="'  + nota.referencia + '"').then(function (data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                        });
                    }
                });
                // Eliminamos notas eliminadas
                $scope.notasAEliminar.forEach(function (nota) {
                    $http.get('http://monsalvediaz.com:5000/PIMC0.1/Eliminar/ArchivosNotas?idUnico=archivoID&idUnico2=notaID&notaID='+ nota.notaID +'&archivoID=' + $scope.archivoID).then(function (data) {
                        $scope.datosGuardados = true;
                        console.log(data);
                    });
                });

            }
            //Revisamos datos principales editados
            if ($scope.datosPrincipales.editado) {
                $scope.registrarAccion("Actualizando BD Archivos");
                $http.get('http://monsalvediaz.com:5000/PIMC0.1/Modificar/Archivos?idUnico=archivoID&archivoID=' + $scope.archivoID + 
                          '&titulo="' + $scope.datosPrincipales.archivoTitulo +
                          '"&institucionFondo="' + $scope.datosPrincipales.institucionFondo +
                          '"&numRefDentroFondo="' + $scope.datosPrincipales.numRefDentroFondo +
                          //'"&fechaInicial="' + $scope.datosPrincipales.fechaInicial +
                          //'"&fechaFinal="' + $scope.datosPrincipales.fechaFinal +
                          '"&seccion="' + $scope.datosPrincipales.seccion +
                          '"&fondo="' + $scope.datosPrincipales.archivoFondo +
                          '"&legajo="' + $scope.datosPrincipales.legajo +
                          '"&numOrden="' + $scope.datosPrincipales.numOrden +
                          '"&folioInicial="' + $scope.datosPrincipales.folioInicial +
                          '"&folioFinal="' + $scope.datosPrincipales.folioFinal +
                          '"&numPaginas="' + $scope.datosPrincipales.numPaginas +
                          '"&palabrasClaves="' + $scope.datosPrincipales.palabrasClaves.join(', ') +
                          '"&disponibilidad="' + $scope.datosPrincipales.disponibilidad + '"'
                          ).then(function (data) {
                            $scope.datosGuardados = true;
                            console.log(data);
                        });
            }
            init();
        };


        // Initialization fucntion
        init();



    }]);
    archivoPerfilControllerApp.run(function (editableOptions,editableThemes) {
        editableThemes.bs3.inputClass = 'input-sm';
        editableThemes.bs3.buttonsClass = 'btn-sm';
        editableOptions.theme = 'bs3';
        editableOptions.buttons = 'no';
    });
})(window.angular);

