////////////////////////////////////////////////////////////////////////////////////
// INSTITUCION   PERFIL MODULE
////////////////////////////////////////////////////////////////////////////////////

(function (angular) {

    'use strict';
    
    var institucionPerfil = angular.module('institucionPerfil', 
        ['ngAnimate',
         'ngSanitize',
         'ui.bootstrap',
         'ngTouch']);


    // Instituciones controller 
    institucionPerfil.controller('institucionPerfilController', 
        ['$scope', 
         'pimcMenuService',
         'pimcBarraEstadoService',
         'pimcInstDatosPrincipalesService',
         'pimcInstFuncionariosServicio',
         'pimcInstPersonajesServicio',
         'pimcComentarios',
         '$window',
         '$q',
        function($scope, pimcMenuService, pimcBarraEstadoService, pimcInstDatosPrincipalesService, pimcInstFuncionariosServicio, pimcInstPersonajesServicio, pimcComentarios, $window, $q) {
            // Initialization function
            var init = function() {
                var institucionSeleccionada = pimcMenuService.obtenerElementoSeleccionado("Instituciones");
                // If not set, redirect.
                if (!institucionSeleccionada) {
                    pimcService.debug("No hay una institucion seleccionada");
                    //TODO Enviar varios seleccionados
                    $window.location.href = "#!/";
                } else {
                    $scope.institucionID = institucionSeleccionada.id;
                    if (!$scope.datosGuardados) {
                        pimcBarraEstadoService.registrarAccion("Institucion <strong>" + $scope.institucionID + "</strong> ha sido cargada");
                    } else {
                        pimcBarraEstadoService.registrarAccion("Institucion <strong>" + $scope.institucionID + "</strong> ha sido guardada en la base de datos");
                        $scope.datosGuardados = false;
                    }

                    var conexiones = [];
                    $scope.cargandoInstituciones = true;                
    
                    // DATOS PRINCIPALES
                    conexiones.push($scope.cargarDatosPrincipales());

                    // FUNCIONARIOS
                    conexiones.push($scope.cargarFuncionarios());

                    // Personajes
                    conexiones.push($scope.cargarInstPersonajes());
    
                    $q.all(conexiones).then(function(){
                        $scope.cargandoInstituciones = false;                
                    });

                }
            }

            // DATOS PRINCIPALES
            $scope.datosPrincipales = {};
            $scope.cargarDatosPrincipales = function() {
                return pimcInstDatosPrincipalesService.cargarDatosPrincipales($scope.institucionID)
                    .then( function(datosPrincipales) {
                        $scope.datosPrincipales = datosPrincipales;
                        pimcBarraEstadoService.registrarAccion("Datos principales de institucion han sido cargados");
                    }
                );
            };

            $scope.datosPrincipalesNotasEditados = function (datosPrincipales, notas) {
                $scope.datosPrincipales = datosPrincipales;
                $scope.notas = notas;
            };

            // NOTAS COMENTARIOS
            $scope.notas = [];
            $scope.cargarNotas = function() {
                return pimcComentarios.cargarNotas('Instituciones',$scope.documentoID).then( function(notas) {
                    $scope.notas = notas;
                });
            };

            // FUNCIONARIOS
            $scope.funcionarios = [];
            $scope.cargarFuncionarios = function() {
                return pimcInstFuncionariosServicio.cargarFuncionarios($scope.institucionID)
                .then( function(funcionarios) {
                    $scope.funcionarios = funcionarios;
                    pimcBarraEstadoService.registrarAccion("Funcionarios de institucion han sido cargados");
                });
            }

            $scope.funcionariosEditados = function(funcionarios) {
                $scope.funcionarios = funcionarios;
            }

            // PERSONAJES
            $scope.instPersonajes = [];
            $scope.cargarInstPersonajes = function() {
                return pimcInstPersonajesServicio.cargarInstPersonajes($scope.institucionID)
                .then( function(personajes) {
                    $scope.instPersonajes = personajes;
                    pimcBarraEstadoService.registrarAccion("Personajes de la institucion han sido cargados");
                });
            }

            $scope.personajesInstEditados = function(personajes) {
                $scope.funcionarios = funcionarios;
            }

            // inicializamos la institucion
            init();
        }
    ]);

})(window.angular);

