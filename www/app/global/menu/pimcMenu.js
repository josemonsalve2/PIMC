(function(angular) {
  "use strict";

  var pimcMenuModule = angular.module("pimcMenuModule", [
    "ngAnimate",
    "ngSanitize",
    "ui.bootstrap",
    "ui.grid",
    "ngTouch"
  ]);

  pimcMenuModule.service("pimcMenuService", [
    "pimcService",
    "$window",
    "$http",
    function(pimcService, $window, $http) {
      var pimcMenuService = this;
      // Para los elementos relacionales abiertos
      pimcMenuService.elementosAbiertos = {};
      pimcMenuService.notificarElementosAbiertosCambio = [];
      // Funcion para registrar callbacks que informan que los elementos han sido
      // cambiados de alguna manera
      pimcMenuService.registrarNotificacionElementosAbiertos = function(nuevoCallback) {
        pimcMenuService.notificarElementosAbiertosCambio.push(nuevoCallback);
      };
      // Notificar a todos
      pimcMenuService.notificarATodosElementosAbiertos = function() {
        angular.forEach(
          pimcMenuService.notificarElementosAbiertosCambio,
          function(callback) {
            callback();
          }
        );
      };

      // Abrir un elemento agregandolo al diccionario
      pimcMenuService.abrirElemento = function(
        elemento,
        idElemento,
        textoMenu,
        vincular
      ) {
        if (!pimcMenuService.elementosAbiertos[elemento]) {
          pimcMenuService.elementosAbiertos[elemento] = [];
        }
        // Texto descriptivo que aparece en el menu
        var texto = textoMenu ? textoMenu : "";

        // recortamos el texto al maximo:
        if (texto.length > 20) {
          texto = texto.substring(0, 17);
          texto = texto + "...";
        }

        // Cambiamos la seleccion al elemento abierto
        pimcMenuService.deseleccionarElementos(elemento);
        // Revisamos si ya existe
        var yaExiste = false;
        angular.forEach(pimcMenuService.elementosAbiertos[elemento], function(
          elementoAbierto
        ) {
          if (elementoAbierto.id == idElemento) {
            yaExiste = true;
            // Lo seleccionamos
            elementoAbierto.seleccionado = true;
            elementoAbierto.texto = texto; // actualizamos el texto si es diferente
          }
        });

        // Si no existe lo agregamos
        if (!yaExiste) {
          pimcMenuService.elementosAbiertos[elemento].push({
            id: idElemento,
            texto: texto,
            seleccionado: true
          });
        }

        // Guardamos cambios en local storage
        $window.localStorage.setItem(
          "elementosAbiertos",
          JSON.stringify(pimcMenuService.elementosAbiertos)
        );

        // notificamos los cambios
        pimcMenuService.notificarATodosElementosAbiertos();

        // Cambiamos a dicho elemento si asi se especifica
        if (vincular) {
          $window.location.href = "#!/"; // Forzar recargar
          $window.location.href = "#!/" + elemento;
        }
      };

      // Cerrar un elemento removiendolo del diccionario
      pimcMenuService.cerrarElemento = function(elemento, idElemento) {
        var estabaSeleccionado = false;
        if (pimcMenuService.elementosAbiertos[elemento]) {
          var index = -1;

          // Buscamos si existe
          angular.forEach(pimcMenuService.elementosAbiertos[elemento], function(
            elementoAbierto,
            indexElemento
          ) {
            if (elementoAbierto.id == idElemento) {
              index = indexElemento;
              estabaSeleccionado = elementoAbierto.seleccionado;
            }
          });

          // Si existe lo eliminamos
          if (index != -1) {
            pimcMenuService.elementosAbiertos[elemento].splice(index, 1);
          }
        }
        $window.localStorage.setItem(
          "elementosAbiertos",
          JSON.stringify(pimcMenuService.elementosAbiertos)
        );

        // Notificamos los cambios
        pimcMenuService.notificarATodosElementosAbiertos();
        // Si estaba seleccionado volvemos a la pagina principal
        if (estabaSeleccionado) {
          $window.location.href = "#!/";
        }
      };

      // Cargar los elementos del local storage
      pimcMenuService.cargarElementos = function() {
        pimcMenuService.elementosAbiertos = JSON.parse($window.localStorage.getItem(
          "elementosAbiertos"
        ));
        // If not set, redirect.
        if (!pimcMenuService.elementosAbiertos) {
          pimcMenuService.elementosAbiertos = {};
        }

        pimcService.debug("Elementos abiertos cargados")

        // Notificamos los cambios
        pimcMenuService.notificarATodosElementosAbiertos();
      };

      // Seleccionar un elemento
      pimcMenuService.seleccionarElemento = function(elemento, idElemento) {
        // Deseleccioanmos todos
        pimcMenuService.deseleccionarElementos(elemento);
        var elementoSeleccionado = false;
        // Buscamos si existe
        angular.forEach(pimcMenuService.elementosAbiertos[elemento], function(
          elementoAbierto
        ) {
          if (elementoAbierto.id == idElemento) {
            elementoSeleccionado = true;
            elementoAbierto.seleccionado = true;
          }
        });

        // Guardamos cambios en local storage
        $window.localStorage.setItem(
          "elementosAbiertos",
          JSON.stringify(pimcMenuService.elementosAbiertos)
        );

        // notificamos los cambios
        pimcMenuService.notificarATodosElementosAbiertos();

        // si no hay elemento seleccionado por alguna razon, entonces vamos a la pagina principal
        if (elementoSeleccionado) {
          $window.location.href = "#!/"; // Forzar recargar
          $window.location.href = "#!/" + elemento;
        } else {
          $window.location.href = "#!/";
        }
      };
      // Quitamos la seleccion
      pimcMenuService.deseleccionarElementos = function(elemento) {
        angular.forEach(pimcMenuService.elementosAbiertos[elemento], function(
          elemento
        ) {
          elemento.seleccionado = false;
        });
      };
      // Retorna el elemento relacional seleccionado actual
      pimcMenuService.obtenerElementoSeleccionado = function(elementoRelacional) {
        var seleccionado = null;
        // Buscamos si hay alguno seleccionado
        angular.forEach(
          pimcMenuService.elementosAbiertos[elementoRelacional],
          function(elementoAbierto) {
            if (elementoAbierto.seleccionado) {
              seleccionado = elementoAbierto;
            }
          }
        );
        return seleccionado;
      };
      // Cambiar texto en caso de que sea necesario
      pimcMenuService.cambiarTextoMenu = function(elementoRelacional, idElemento, nuevoTexto) {
        // Texto descriptivo que aparece en el menu
        var texto = nuevoTexto ? nuevoTexto : "";
    
        // recortamos el texto al maximo:
        if (texto.length > 20) {
            texto = texto.substring(0, 17);
            texto = texto + "...";
        }
        // Buscamos si existe
        angular.forEach(pimcMenuService.elementosAbiertos[elemento], 
            function(elementoAbierto) {
                if (elementoAbierto.id == idElemento) {
                    elementoAbierto.texto = texto; // Actualizamos texto
                }
            }
        );
      }; // Fin cambiarTextoMenu

    }]); // Fin de pimcMenuService
    pimcMenuModule.controller("pimcElementosRelacionalesMenuCtrl", [
        "pimcMenuService",
        "$window",
        "authManager",
        function(pimcMenuService){
            var menuElementosCtrl = this;
            
            // Para el menu de los elementos abiertos
            menuElementosCtrl.elementosAbiertos = pimcMenuService.elementosAbiertos;
            
            // Cualquier cambio en los elementos abiertos es notificada aca
            menuElementosCtrl.cambiosElementosAbiertos = function () {
                menuElementosCtrl.elementosAbiertos = pimcMenuService.elementosAbiertos;
                menuElementosCtrl.menuVacio = menuElementosCtrl.revisarSiMenuVacio();
            }

            // Registramos callback para siempre actualizar
            pimcMenuService.registrarNotificacionElementosAbiertos(menuElementosCtrl.cambiosElementosAbiertos);

            // Helper function para revisar si el menu esta vacio o no
            menuElementosCtrl.revisarSiMenuVacio = function () {
              var vacio = true;
              // Revisamos si el menu esta vacio
              angular.forEach(menuElementosCtrl.elementosAbiertos, function(elemento, nombreElemento) {
                if (nombreElemento != "Documentos" && elemento.length != 0) {
                  vacio = false;
                }
              });
              return vacio;
            }; 

            // Si el menu esta vacio;
            menuElementosCtrl.menuVacio = menuElementosCtrl.revisarSiMenuVacio();
            
            menuElementosCtrl.abrirElemento = function (elementoRelacional, idElemento) {
                pimcMenuService.seleccionarElemento(elementoRelacional, idElemento);
            }
            menuElementosCtrl.cerrarElemento = function (elementoRelacional, idElemento) {
              pimcMenuService.cerrarElemento(elementoRelacional, idElemento);
            }
        }
    ]); // Fin controller


    pimcMenuModule.component("pimcElementosRelacionalesMenu", {
        bindings: {
            
        },
        controller: "pimcElementosRelacionalesMenuCtrl",
        controllerAs: "menuElementosCtrl",
        templateUrl: "views/global/menu/pimcMenuElementosRel.html"
    }); // fin componente

    pimcMenuModule.directive('setParentActive', ['$location', 
        function($location) {
            return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var classActive = attrs.setParentActive || 'active';
                var path = attrs.ngHref ? attrs.ngHref.replace('#!', '') : "";
                scope.location = $location;
                scope.$watch('location.path()', function(newPath) {
                    if (path == newPath) {
                        element.parent().addClass(classActive);
                    } else {
                        element.parent().removeClass(classActive);
                    }
                });
            }
            }
        }
    ]);

})(window.angular);
