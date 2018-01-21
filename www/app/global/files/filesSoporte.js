(function (angular) {
    
      'use strict';
    
      var pimcFilesSoporte = angular.module('pimcFilesSoporte',
        ['ngAnimate',
        'ngSanitize',
        'ui.bootstrap',
        'xeditable',
        'ngFileUpload']);
    
      // Service para comentarios. Cargar y guardar notas
      pimcFilesSoporte.service('pimcFilesService', 
        ['$http', '$q', 'pimcService', 'Upload', 
        function($http, $q, pimcService, Upload){
          var pimcFilesCtrl = this;


          // Obtener los archivos de un elemento relacional en particular
          pimcFilesCtrl.obtenerListadoFiles = function(elementoRelacional, elementoID) {
              // Obtenemos URL de consulta
              var consultaListaFiles = pimcService.crearURLOperacion('listaArchivos', elementoRelacional)

              // Organizamos el ID del elementoRelacional
              var parametros = {};
              parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoID;

              // Realizamos la consulta en la base de datos
              return $http.get(consultaListaFiles, {params: parametros}).then(function(data) {
                  if (Object.keys(data.data).length != 0) {
                      var resultadoConsulta = data.data;
                      var files = [];
                      if (Object.keys(resultadoConsulta).length != 0) {
                          resultadoConsulta;
                          angular.forEach(resultadoConsulta, function(nombreFile, key) {
                              var nuevoFile = {};
                              nuevoFile.estado = pimcService.datosEstados.LIMPIO;
                              nuevoFile.nombre = pimcFilesCtrl.obtenerNombre(nombreFile);
                              nuevoFile.nombreOriginal = pimcFilesCtrl.obtenerNombre(nombreFile);
                              nuevoFile.extension = pimcFilesCtrl.obtenerFormato(nombreFile);
                              files.push(nuevoFile);
                          });
                          // LOG
                          pimcService.debug(files);
                      }
                      return files;
                  } else {
                      return [];
                  }
              });
          }; // Fin obterner lista de files

          // Guardar cambios en archivos (cambiar nombre o eliminar)
          pimcFilesCtrl.guardarCambiosFiles = function(elementoRelacional, elementoID, listaFiles) {
            var conexiones = [];
            // Por cada file revisamos si fue modificado o elminado
            angular.forEach(listaFiles, function(file, key) {
              if (file.estado === pimcService.datosEstados.ELIMINADO) {
                // Eliminar file
                var consultaListaFiles = pimcService.crearURLOperacion('eliminarArchivo', elementoRelacional)

                // Organizamos el ID del elementoRelacional
                var parametros = {};
                parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoID;
                parametros.fileName = file.nombre;

                conexiones.push(
                  $http.get(consultaListaFiles, {params:parametros}).then(function(data) {
                    if (Object.keys(data.data).length != 0) {                    
                      if (data.data.status != 'success') {
                        pimcBarraEstadoService.registrarAccion("ERROR eliminando archivo " + file.nombre);
                        return;
                      } else {
                        pimcBarraEstadoService.registrarAccion("Archivo eliminado " + file.nombre);
                        return;                    
                      }
                      pimcService.debug("Eliminando archivo: " + data.data.message);
                    }
                  })
                );
              } else if (file.estado === pimcService.datosEstados.MODIFICADO) {
                // Cambiar el nombre del file
                var consultaListaFiles = pimcService.crearURLOperacion('renombrarArchivo', elementoRelacional)

                // Organizamos el ID del elementoRelacional
                var parametros = {};
                parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoID;
                parametros.fileName = file.nombreOriginal + '.' + file.extension;
                parametros.newFileName = file.nombre + '.' + file.extension;

                conexiones.push(
                  $http.get(consultaListaFiles, {params:parametros}).then(function(data) {
                    if (Object.keys(data.data).length != 0) {
                      if (data.data.status != 'success') {
                        pimcBarraEstadoService.registrarAccion("ERROR renombrando file " + file.nombreOriginal + " a " + file.nombre);
                        return;
                      } else {
                        pimcBarraEstadoService.registrarAccion("File renombrado " + file.nombreOriginal + " a " + file.nombre);
                        return;                    
                      }
                      pimcService.debug("Eliminando archivo: " + data.data.message);
                    }
                  })
                );
              }
              if (conexiones.length != 0) {
                return $q.all(conexiones).then(function (responses) {
                  for (var res in responses) {
                    pimcService.debug(res + ' = ' + responses[res].data);
                  }
                }, function (responses) {
                  for (var res in responses) {
                    pimcService.debug("[ERROR]" + res + ' = ' + responses[res]);
                  }
                });
              } else {
                return;
              }
            });
          }; // Fin guardar cambios Files

          // Funcion para agregar un File nuevo
          pimcFilesCtrl.enviarFile = function(elementoRelacional, elementoRelacionalID, file) {
            var cargarFileURL = pimcService.crearURLOperacion('cargarArchivo', elementoRelacional);

            var parametros = {};
                parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoRelacionalID;
                parametros['file'] = file;
                
            // Documentation aqui https://github.com/danialfarid/ng-file-upload
            Upload.upload({
              url: cargarFileURL,
              data: parametros,
            });
          }
          // Funcion para descargar un File 
          pimcFilesCtrl.descargarFile = function(elementoRelacional, elementoRelacionalID, fileName) {
            var descargarFileURL = pimcService.crearURLOperacion('descargarArchivo', elementoRelacional);

            var parametros = {};
                parametros[pimcService.idElementoRelaciona[elementoRelacional]] = elementoRelacionalID;
                parametros['fileName'] = fileName;
            $http.get(descargarFileURL, {params: parametros}).then(
              // See http://jaliyaudagedara.blogspot.com/2016/05/angularjs-download-files-by-sending.html

              function (data) {
                var headers = data.headers();
         
                var filename = fileName;
                var contentType = headers['content-type'];
         
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data.data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);
         
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
         
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    pimcService.debug(ex);
                }
              });
          }

          // Funciones de ayuda
          pimcFilesCtrl.obtenerFormato = function(nombreArchivo) {
            return nombreArchivo.split('.').slice(-1).join();
          };

          pimcFilesCtrl.obtenerNombre = function(nombreArchivo) {
            return nombreArchivo.split('.').slice(0,-1).join();
          };
        }
      ]);


      pimcFilesSoporte.controller('pimcFileSoportesController', 
        ['$scope',
        'pimcService',
        'pimcBarraEstadoService', 
        'pimcFilesService', 
        function($scope, pimcService, pimcBarraEstadoService, pimcFilesService) {
          var filesSoporteCtrl = this;

          filesSoporteCtrl.elementoRelacionalInt = "";
          filesSoporteCtrl.elementoRelacionalIdInt = "";
          filesSoporteCtrl.listaFilesInt = [];
          filesSoporteCtrl.archivosNuevos = [];

          // Lista de iconos para los archivos
          filesSoporteCtrl.fileIcons = {
            'txt': 'fa-file-text-o', 
            'pdf': 'fa-file-pdf-o', 
            'doc': 'fa-file-word-o', 
            'docx': 'fa-file-word-o', 
            'xls': 'fa-file-excel-o', 
            'xlsx': 'fa-file-excel-o', 
            'csv': 'fa-file-excel-o', 
            'ppt': 'fa-file-powerpoint-o', 
            'pptx': 'fa-file-powerpoint-o', 
            'ps': 'fa-file-pdf-o', 
            'png': 'fa-file-picture-o', 
            'jpg': 'fa-file-picture-o', 
            'jpeg': 'fa-file-picture-o', 
            'gif': 'fa-file-picture-o', 
            'bmp': 'fa-file-picture-o', 
            'tiff': 'fa-file-picture-o', 
            'svg': 'fa-file-picture-o',
            'zip': 'fa-file-archive-o', 
            'tar': 'fa-file-archive-o', 
            'bz': 'fa-file-archive-o', 
            'gz': 'fa-file-archive-o', 
            'rar': 'fa-file-archive-o'
          }

          // usando fileIcons retornamos la clase adecuada y revisamos que exista
          filesSoporteCtrl.obtenerClaseIcono = function(extension) {
            if (extension in filesSoporteCtrl.fileIcons) {
              return filesSoporteCtrl.fileIcons[extension];
            } else {
              return 'fa-file';
            }
          }
          filesSoporteCtrl.nombreCompleto = function(file) {
            return file.nombre + '.' + file.extension;
          }

          // Funcion para reportar cambios
          filesSoporteCtrl.$onChanges = function (changes) {
            if (changes.listaFiles) {
              filesSoporteCtrl.listaFilesInt = angular.copy(filesSoporteCtrl.listaFiles); 
            } else if (changes.elementoRelacional || changes.elementoRelacionalID) {
              filesSoporteCtrl.elementoRelacionalInt = angular.copy(filesSoporteCtrl.elementoRelacional); 
              filesSoporteCtrl.elementoRelacionalIdInt = angular.copy(filesSoporteCtrl.elementoRelacionalId); 
              filesSoporteCtrl.cargarFiles();
            } else if (changes.registrarFuncionGuardado) {
              filesSoporteCtrl.registrarFuncionGuardado(filesSoporteCtrl.guardarCambiosFiles);
            } else if (changes.registrarFuncionCargar) {
              filesSoporteCtrl.registrarFuncionGuardado(filesSoporteCtrl.cargarFiles);
            }
          } 

          // funcion para descargar
          filesSoporteCtrl.descargarFile = function(file) {            
            if (file.nombre) {
              pimcFilesService.descargarFile(
                filesSoporteCtrl.elementoRelacionalInt,
                filesSoporteCtrl.elementoRelacionalIdInt,
                file.nombre
              )
            }
          }

          // Borrar archivo
          filesSoporteCtrl.eliminarFile = function(file) {
            file.estado = pimcService.datosEstados.ELIMINADO;
          }

          filesSoporteCtrl.renombrarFile = function(file) {
            if (file.nombre != file.nombreOriginal) {
              file.estado = pimcService.datosEstados.MODIFICADO;
            } else {
              file.estado = pimcService.datosEstados.LIMPIO;
            }
          }
      }]);

      // Filtro archivos eliminados
      pimcFilesSoporte.filter('filtrarEliminados',['pimcService' ,function(pimcService) {
        return function (files) {
            if (!files) return [];
            var filtrados = [];
            angular.forEach(files, function(val, key) {
                if (val.estado != pimcService.datosEstados.ELIMINADO) {
                    filtrados.push(val);
                }
            });
            return filtrados;
        }
      }]);
    
      // COMPONENTS
      pimcFilesSoporte.component('pimcFilesSoporte', {
        bindings: {
          listaFiles: '<',
          elementoRelacional: '@',
          elementoRelacionalId: '@',
          reportarCambios: '&'
        },
        controller: 'pimcFileSoportesController',
        controllerAs: 'filesSoporteCtrl',
        templateUrl: function($element, $attrs) {
          var urlTemplate = 'views/global/files/';
          if ($attrs.tipo == "iconosGrandes") {
            urlTemplate = urlTemplate + "filesIconosGrandes.html";
          } else {
            // Iconos grandes es por defecto
            urlTemplate = urlTemplate + "filesIconosGrandes.html";
          }
          return urlTemplate;
        }
      });
    
    
    })(window.angular);
    