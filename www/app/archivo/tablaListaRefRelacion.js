(function(angular) {
  "use strict";

  var tablaListaRefModule = angular.module("archivoPerfil");

  // Service para comentarios. Cargar y guardar referenciasElementos
  tablaListaRefModule.service("pimcTablaListaRefService", [
    "$http",
    "$q",
    "pimcService",
    "pimcBarraEstadoService",
    function($http, $q, pimcService, pimcBarraEstadoService) {
      var tablaRefElementoServiceCtrl = this;

      // Funcion para cargar todos los datos del archivo de cierto elemento relacional
      tablaRefElementoServiceCtrl.cargarElementos = function (elementoRelacional, archivoID, documentos) {
        // Revisamos que hayan documentos para poder cargar los datos
        if ( !(documentos instanceof Array) || 
             documentos.length == 0 ) {
          return $q.when(false);
        }
        // Variable para deferrir las conexioens
        var conexionesDocumentos = [];
        // Variable para los resultados
        var elementos = [];

        // Por cada documento encontramos todos las referencias, y por cada una encontramos el
        // elemento relacional
        angular.forEach(documentos, function (documento) {
          var documentoID = documento.documentoID;
          var idNombre = pimcService.idElementoRelaciona[elementoRelacional];
          var UrlConsultaReferencias = pimcService.crearURLOperacion("ConsultarTodos", "DocumentosRef" + elementoRelacional);
          // filtramos por documentoID
          var parametros = {};
          parametros.documentoID = documentoID;

          // obtenemos todas las referencias de cada documento
          conexionesDocumentos.push(
            $http.get(UrlConsultaReferencias, {params: parametros})
            .then(function(data) {
              var resultados = [];
              var conexionesReferencias = [];
              // revisar si existe alguna relacion entre este documento y este elemento relacional
              if (Object.keys(data.data).length != 0) {
                var eliminarRepetidos = [];
                var referenciasTodas = data.data;
                var arrayReferenciasID = [];
                // Por cada referencia tenemos que buscar el elemento dentro de la base de datos
                referenciasTodas.forEach(function(referencia) {
                  var UrlConsultaElementos = pimcService.crearURLOperacion("Consulta", elementoRelacional);
                  var parametros = {};
                  parametros[idNombre] = referencia[idNombre];
                  // Obtenemos todos los datos de la referencia
                  conexionesReferencias.push($http.get(UrlConsultaElementos, { params: parametros }));
                  arrayReferenciasID.push(referencia.referenciaID);
                });
              } // Fin Objects.keys...

              // Obtenemos la informacion del elemento relacional
              if (conexionesReferencias.length != 0) {
                return $q.all(conexionesReferencias).then(function(respuestas) {
                  // Por cada respuesta...
                  for (var res in respuestas) {
                    // Obtenemos la informacion
                    var datosContenido = respuestas[res].data[0];

                    // Creamos el nuevo elemento
                    var nuevoElemento = {};
                    nuevoElemento.documentosID = [];
                    nuevoElemento.documentosID.push(documentoID);
                    nuevoElemento.referenciasID = [];
                    nuevoElemento.referenciasID.push(arrayReferenciasID[res]);
                    nuevoElemento.contenido = datosContenido;
                    resultados.push(nuevoElemento);
                  }
                  return $q.when(resultados);
                }, function (respuesta) {
                  pimcService.debug("[ERROR] CARGANDO = " + elementoRelacional + " de Archivo " + archivoID + " y documento " + documentoID + " Respuesta = " + respuesta);
                  return $q.reject("Error cargando documento " + documentoID);
                });
              } else {
                return $q.when([]);                
              }
            })
          );
        });
        if (conexionesDocumentos.length != 0) {
          return $q.all(conexionesDocumentos).then(function(resultados) {
            // LOG
            for (var res in resultados) {
              // Purgamos los elementos repetidos
              angular.forEach(elementos, function (elementoPrevio) { 
                for (var i = resultados[res].length - 1; i >= 0; i--) {
                  var elementoNuevo = resultados[res][i];
                  if (elementoPrevio.contenido[idNombre] === elementoNuevo.contenido[idNombre]) {
                    // agregamos los valores al elemento viejo y quitamos el elemento 
                    elementoPrevio.referenciasID = elementoPrevio.referenciasID.concat(elementoNuevo.referenciasID);
                    elementoPrevio.documentosID = elementoPrevio.documentosID.concat(elementoNuevo.documentosID);
                    resultados[res].splice(i, 1);
                  }                  
                };
              });
              elementos = elementos.concat(resultados[res]);
            }
            pimcService.debug(elementos);
            return $q.when(elementos);
          }, function (respuesta) {
            pimcService.debug("[ERROR]["+ elementoRelacional + "] referencias de archivo: " + archivoID + " Respuesta = " + respuesta);
            return $q.reject("Error en tabla referencia " +  elementoRelacional + " del Archivo " + archivoID);
          });
        }
        else {
          pimcService.debug("El archivo no tiene ningun " + elementoRelacional + " relacionado")
          return $q.when([]);
        }
      }; // Fin de cargar documento
    } // Fin de service constructor
  ]); // Fin de service

  tablaListaRefModule.controller("tablaListaRefController", [
    "pimcService",
    "pimcMenuService",
    "pimcBarraEstadoService",
    "pimcTablaListaRefService",
    "$window",
    function(
      pimcService,
      pimcMenuService,
      pimcBarraEstadoService,
      pimcTablaRefElementoService,
      $window
    ) {
      var refTablaCtrl = this;
      refTablaCtrl.elementoRelacionalInt = "";
      refTablaCtrl.valoresInt = [];
      refTablaCtrl.camposColumnasInt = [];
      refTablaCtrl.nombresColumnasInt = {};
      refTablaCtrl.tipoColumnasInt = {};
      
      // Actualizar los datos cuando los valores cambien
      refTablaCtrl.$onChanges = function(changes) {
        if (changes.elementoRelacional) {
          refTablaCtrl.elementoRelacionalInt = $window.angular.copy(
            refTablaCtrl.elementoRelacional
          );
        }
        if (changes.valores) {
          refTablaCtrl.valoresInt = $window.angular.copy(refTablaCtrl.valores);
        }
        if (changes.camposColumnas) {
          refTablaCtrl.camposColumnasInt = $window.angular.copy(
            refTablaCtrl.camposColumnas
          );
        }
        if (changes.nombresColumnas) {
          refTablaCtrl.nombresColumnasInt = $window.angular.copy(
            refTablaCtrl.nombresColumnas
          );
        }
        if (changes.tipoColumnas) {
          refTablaCtrl.tipoColumnasInt = $window.angular.copy(
            refTablaCtrl.tipoColumnas
          );
        }
      };

      // Permite abrir elemento seleccionado
      refTablaCtrl.abrirSeleccionado = function(valor) {

        // Obtenemos el index del elemento seleccionado
        var index = refTablaCtrl.valoresInt.indexOf(valor);

        // Obtenemos el id y el nombre en el menu
        var idColumna =
          pimcService.idElementoRelaciona[refTablaCtrl.elementoRelacionalInt];
        var seleccionado = valor.contenido[idColumna];
        var nombreColumna =
          pimcService.nombreColElementoRelacional[refTablaCtrl.elementoRelacionalInt];
        var textoMenu = valor.contenido[nombreColumna];
        pimcService.debug(
          "Abriendo " +
          refTablaCtrl.elementoRelacionalInt +
          " " +
          seleccionado);
          pimcMenuService.abrirElemento(
            refTablaCtrl.elementoRelacionalInt, // elemento relacional
            seleccionado, // id elemento relacional,
            textoMenu, // texto en el menu
            true // vincular a la pagina
          );
      };

      // Para tipos de colimnas

      // Los diferentes tipos definidos. Por defecto
      // todo es Texto.
      refTablaCtrl.tiposColumnas = {
        TEXTO: 0,
        DATE: 1,
        LUGAR: 2,
        propiedades: {
          0: { nombre: "Texto", value: 0, code: "T" },
          1: { nombre: "Date", value: 1, code: "D" },
          2: { nombre: "Lugar", value: 2, code: "L" }
        }
      };

      // Clasifica el tipo de columna de acuerdo a lo que especifique el usuario
      refTablaCtrl.obtenerTipoColumna = function(campo) {
        if (refTablaCtrl.tipoColumnasInt) {
          var tipoCol = refTablaCtrl.tipoColumnasInt[campo];
          if (tipoCol) {
            if (
              tipoCol === refTablaCtrl.tiposColumnas.DATE ||
              tipoCol === refTablaCtrl.tipoCol.propiedades[1].nombre ||
              tipoCol === refTablaCtrl.tipoCol.propiedades[1].code
            )
              return refTablaCtrl.tiposColumnas.DATE;
            else if (
              tipoCol === refTablaCtrl.tiposColumnas.LUGAR ||
              tipoCol === refTablaCtrl.tipoCol.propiedades[2].nombre ||
              tipoCol === refTablaCtrl.tipoCol.propiedades[2].code
            )
              return refTablaCtrl.tipoColumnas.LUGAR;
            else return refTablaCtrl.tiposColumnas.TEXTO;
          }
        } else {
          return refTablaCtrl.tipoColumnas.TEXTO;
        }
      };

      // Revisamos si la columan es texto
      refTablaCtrl.columnaEsTexto = function(campo) {
        return (
          refTablaCtrl.obtenerTipoColumna(campo) ===
          refTablaCtrl.tipoColumnas.TEXTO
        );
      };

      // Revisamos si la columna es fecha
      refTablaCtrl.columnaEsDate = function(campo) {
        return (
          refTablaCtrl.obtenerTipoColumna(campo) ===
          refTablaCtrl.tipoColumnas.DATE
        );
      };

      // Revisamos si la columna es lugar
      refTablaCtrl.columnaEsLugar = function(campo) {
        return (
          refTablaCtrl.obtenerTipoColumna(campo) ===
          refTablaCtrl.tipoColumnas.LUGAR
        );
      };

      // Fechas
      refTablaCtrl.obtenerCampoFecha = function(campo) {
        return campo + "Formato";
      };
    }
  ]);

  tablaListaRefModule.component("pimcTablaListaRef", {
    bindings: {
      elementoRelacional: "<",
      valores: "<",
      camposColumnas: "<",
      nombresColumnas: "<",
      tipoColumnas: "<"
    },
    controller: "tablaListaRefController",
    controllerAs: "refTablaCtrl",
    templateUrl: "views/archivo/tablaListaRefRelacion.html"
  });
})(window.angular);
