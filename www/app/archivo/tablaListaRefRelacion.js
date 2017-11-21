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
        var conexiones = [];
        // Variable para los resultados
        var elementos = [];

        // Por cada documento encontramos todos las referencias, y por cada una encontramos el
        // elemento relacional
        angular.forEach(documentos, function (documento) {
          var documentoID = documento.documentoID;
          var UrlConsultaReferencias = pimcService.crearURLOperacion("ConsultarTodos", "DocumentosRef" + elementoRelacional);
          // filtramos por documentoID
          var parametros = {};
          parametros.documentoID = documentoID;

          // obtenemos todas las referencias
          conexiones.push(
            $http.get(UrlConsultaReferencias, {params: parametros})
            .then(function(data) {
              // revisar si existe alguna relacion entre este documento y este elemento relacional
              if (Object.keys(data.data).length != 0) {
                var referenciasTodas = data.data;
                referenciasTodas.forEach(function(referencia) {
                  var UrlConsultaElementos = pimcService.crearURLOperacion("Consulta", elementoRelacional);

                  var parametros = {};
                  var idNombre =
                      pimcService.idElementoRelaciona[elementoRelacional];
                  parametros[idNombre] = referencia[idNombre];
                  var yaExiste = false;

                  // Revisamos si ya habiamos cargado esta referencia en otro documento
                  angular.forEach(elementos, function(elementoPrevio) {
                    if (elementoPrevio.contenido[idNombre] == referencia[idNombre]) {
                      yaExiste = true;
                      elementoPrevio.documentosID.push(documentoID);
                      elementoPrevio.referenciasID.push(referencia.referenciaID);
                    }
                  });
                  // Obtenemos todos los datos de la referencia
                  conexiones.push(
                  $http
                    .get(UrlConsultaElementos, { params: parametros })
                    .then(function(data) {
                      // Obtenemos la informacion
                      var datosContenido = data.data[0];

                      // Creamos el nuevo elemento
                      var nuevoElemento = {};
                      nuevoElemento.documentosID = [];
                      nuevoElemento.documentosID.push(documentoID);
                      nuevoElemento.referenciaID = [];
                      nuevoElemento.referenciaID.push(referencia.referenciaID);
                      nuevoElemento.contenido = datosContenido;
                      elementos.push(nuevoElemento);
                    })
                  );
                });
              }
            })
          );
          if (conexiones.length != 0) {
            return $q.all(conexiones).then(function(data) {
              // LOG
              pimcService.debug(elementos);
              return elementos;
            }, function (response) {
              pimcService.debug("[ERROR][CARGANDO = " + elementoRelacional + "] de Archivo: " + response);
              return $q.reject("Error en tabla referencia " +  elementoRelacional + " del Archivo");
            });
          }
          else {
            pimcService.debug("El archivo no tiene ningun personaje relacionado")
            return $q.when(false);
          }
        });
      }; // Fin de cargar documento
    } // Fin de service constructor
  ]); // Fin de service

  tablaListaRefModule.controller("tablaListaRefController", [
    "pimcService",
    "pimcBarraEstadoService",
    "pimcTablaListaRefService",
    "$window",
    function(
      pimcService,
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
          pimcService.abrirElemento(
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
