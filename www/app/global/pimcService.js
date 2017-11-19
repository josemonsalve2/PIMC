(function (angular) {

    'use strict';

    var pimc = angular.module('pimc');
    pimc.service('pimcService', ['$window', '$http', function ($window, $http) {
        var pimcService = this;

        // Para los elementos relacionales abiertos
        pimcService.elementosAbiertos = {};
        pimcService.notificarElementosAbiertosCambio = [];
        // Funcion para registrar callbacks que informan que los elementos han sido
        // cambiados de alguna manera
        pimcService.registrarNotificacionElementosAbiertos = function (nuevoCallback) {
            pimcService.notificarElementosAbiertosCambio.push(nuevoCallback);
        }
        // Notificar a todos
        pimcService.notificarATodosElementosAbiertos = function () {
            angular.forEach(pimcService.notificarElementosAbiertosCambio, function (callback) {
                callback();
            });
        }

        // Abrir un elemento agregandolo al diccionario
        pimcService.abrirElemento = function (elemento, idElemento, textoMenu) {
            if (!pimcService.elementosAbiertos[elemento]) {
                pimcService.elementosAbiertos[elemento] = [];
            }
            // Texto descriptivo que aparece en el menu
            var texto = textoMenu ? textoMenu : "";
            // Cambiamos la seleccion al elemento abierto
            pimcService.deseleccionarElemento(elemento);
            // Revisamos si ya existe
            var yaExiste = false;
            angular.forEach(pimcService.elementosAbiertos[elemento], function (elementoAbierto) {
                if (elementoAbierto.id == idElemento) {
                    yaExiste = true;
                    // Lo seleccionamos
                    elementoAbierto.seleccionado = true;
                }
            });

            // Si no existe lo agregamos
            if (!yaExiste) {
                pimcService.elementosAbiertos[elemento].push(
                    {
                        id: idElemento,
                        texto: texto,
                        seleccionado: true
                    }
                );
            }

            // Guardamos cambios en local storage
            $window.localStorage.setItem("elementosAbiertos", pimcService.elementosAbiertos);

            // notificamos los cambios
            pimcService.notificarATodosElementosAbiertos();
        }

        // Cerrar un elemento removiendolo del diccionario
        pimcService.cerrarElemento = function (elemento, idElemento) {
            var estabaSeleccionado = false
            if (pimcService.elementosAbiertos[elemento]) {
                var index = -1;

                // Buscamos si existe
                angular.forEach(pimcService.elementosAbiertos[elemento], function (elementoAbierto, indexElemento) {
                    if (elementoAbierto.id == idElemento) {
                        index = indexElemento;
                        estabaSeleccionado = elementoAbierto.seleccionado;
                    }
                });

                // Si existe lo eliminamos
                if (index != -1) {
                    pimcService.elementoAbierto[elemento].splice(index, 1);
                }
            }
            $window.localStorage.setItem("elementosAbiertos", pimcService.elementosAbiertos);

            // Notificamos los cambios
            pimcService.notificarATodosElementosAbiertos();
            // Si estaba seleccionado volvemos a la pagina principal
            if (estabaSeleccionado) {
                $window.location.href = "#!/";
            }
        }

        // Cargar los elementos del local storage
        pimcService.cargarElementos = function () {
            pimcService.elementosAbiertos = $window.localStorage.getItem("elementosAbiertos");
            // If not set, redirect.
            if (!pimcService.elementosAbiertos) {
                pimcService.elementosAbiertos = {};
            }

            // Notificamos los cambios
            pimcService.notificarATodosElementosAbiertos();
        }

        // Seleccionar un elemento
        pimcService.seleccionarElemento = function (elemento, idElemento) {
            // Deseleccioanmos todos
            pimcService.deseleccionarElementos(elemento);
            var elementoSeleccionado = false;
            // Buscamos si existe
            angular.forEach(pimcService.elementosAbiertos[elemento], function (elementoAbierto) {
                if (elementoAbierto.id == idElemento) {
                    elementoSeleccionado = true;
                    elementoAbierto.seleccionado = true;
                }
            });

            // Guardamos cambios en local storage
            $window.localStorage.setItem("elementosAbiertos", pimcService.elementosAbiertos);

            // notificamos los cambios
            pimcService.notificarATodosElementosAbiertos();

            // si no hay elemento seleccionado por alguna razon, entonces vamos a la pagina principal
            if (elementoSeleccionado) {
                $window.location.href = "#!/";
            }
        }
        // Quitamos la seleccion 
        pimcService.deseleccionarElementos = function (elemento) {
            angular.forEach(pimcService.elementosAbiertos[elemento], function (elemento) {
                elemento.seleccionado = false;
            });
        }
        // Retorna el elemento relacional seleccionado actual
        pimcService.obtenerElementoSeleccionado = function (elementoRelacional) {
            var seleccionado = null;
            // Buscamos si hay alguno seleccionado
            angular.forEach(pimcService.elementosAbiertos[elementoRelacional], function (elementoAbierto) {
                if (elementoAbierto.seleccionado) {
                    seleccionado = elementoAbierto;
                }
            });
            return seleccionado;
        }

        // PARA BACKEND
        pimcService.backEndURL = "http://pimcapi.fundacionproyectonavio.org/PIMC0.2"; // sin / al final
        // crea la URL 
        pimcService.crearURLOperacion = function (operacion, elementoRelacional) {
            return pimcService.backEndURL + "/" + String(operacion) + "/" + String(elementoRelacional);
        }

        /// CADA UNA DE LAS OPERACIONES DE LA API
        // pimcService.apiConsulta = function(operacion, elementoRelacional, elementoID) {
        //   var consultaURL = pimcService.crearURLOperacion(operacion, elementoRelacional);
        //   var carga[pimcService.idElementoRelacional[elementoRelacional]] = elementoID;
        //   return $http.get(consultaURL, {params:carga}).then( function (data) {
        //       return data.data;
        //   }, function (respuestaError) {
        //   });
        // };     

        // OPCION DEBUGGING
        pimcService.debugMode = true;

        if (pimcService.debugMode)
            pimcService.debug = console.log.bind(window.console)
        else
            pimcService.debug = function () { }

        pimcService.error = console.error.bind(window.console)

        // ESTADO DE DATOS
        pimcService.datosEstados = {
            LIMPIO: 0,
            MODIFICADO: 1,
            INSERTADO: 2,
            ELIMINADO: 3,
            propiedades: {
                0: { nombre: 'Limpia', value: 0, code: 'L' },
                1: { nombre: 'Modificada', value: 1, code: 'M' },
                2: { nombre: 'Insertada', value: 2, code: 'I' },
                3: { nombre: 'Eliminada', value: 3, code: 'E' }
            }
        };

        // IDs Elementos relacionales
        pimcService.idElementoRelaciona = {
            Embarcaciones: "embarcacionID",
            Archivos: "archivoID",
            Documentos: "documentoID",
            Personajes: "personajeID",
            Actividades: "actividadID",
            Instituciones: "institucionID"
        }

    }]);

    pimc.filter('estadoNoEliminado', ['pimcService', function (pimcService) {
        return function (items) {
            var filtered = [];
            angular.forEach(items, function (el) {
                if (el.estado && el.estado != pimcService.datosEstados.ELIMINADO) {
                    filtered.push(el);
                }
            });
            return filtered;
        }
    }]);

})(window.angular);