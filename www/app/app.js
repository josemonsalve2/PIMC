(function (angular) {
  
  'use strict';
  
  var pimc = angular.module('pimc', [
    'ngRoute',
    'indexModule',
    'archivoPerfil',
    'personajePerfil',
    'embarcacionPerfil',
    'archivosBusqueda',
    'documentoPerfil'
  ]);

  pimc.controller('AppController', function($scope) {});

  pimc.config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller:  'indexController'
      })
      .when('/personaje', {
        templateUrl: 'views/personaje.html',
        controller:  'personajePerfilController'
      })
      .when('/archivo', {
        templateUrl: 'views/archivo.html',
        controller:  'archivoPerfilController'
      })
      .when('/embarcacion', {
        templateUrl: 'views/embarcacion.html',
        controller:  'embarcacionPerfilController'
      })
      .when('/busqueda', {
        templateUrl: 'views/busqueda.html',
        controller:  'archivosBusquedaController'
      })
      .when('/documento', {
        templateUrl: 'views/documento.html',
        controller:  'documentoPerfilController'
      })
      .otherwise({
        redirectTo:  '/'
      });
  }).config(function($provide){
    $provide.decorator('GridOptions',['$delegate', 'i18nService', function($delegate, i18nService){
        var gridOptions = angular.copy($delegate);
        gridOptions.initialize = function(options) {
            var initOptions = $delegate.initialize(options);
            return initOptions;
        };
        i18nService.setCurrentLang('es');
        return gridOptions;
    }]);
  });

  pimc.directive('setParentActive', ['$location', function($location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, controller) {
        var classActive = attrs.setParentActive || 'active',
            path = attrs.ngHref.replace('#!', '');
        scope.location = $location;
        scope.$watch('location.path()', function(newPath) {
          if (path == newPath) {
            element.parent().addClass(classActive);
          } else {
            element.parent().removeClass(classActive);
          }
        })
      }
    }
  }]);
    
  pimc.directive('lugarTerritorioUiGridEditor',
    ['gridUtil', 'uiGridConstants', 'uiGridEditConstants','$timeout', 'uiGridEditService',
      function (gridUtil, uiGridConstants, uiGridEditConstants, $timeout, uiGridEditService) {
        return {
          scope: true,
          require: ['?^uiGrid', '?^uiGridRenderContainer', 'ngModel'],
          compile: function () {
            return {
              pre: function ($scope, $elm, $attrs) {

              },
              post: function ($scope, $elm, $attrs, controllers) {
                var uiGridCtrl, renderContainerCtrl, ngModel;
                if (controllers[0]) { uiGridCtrl = controllers[0]; }
                if (controllers[1]) { renderContainerCtrl = controllers[1]; }
                if (controllers[2]) { ngModel = controllers[2]; }

                //set focus at start of edit
                $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function (evt,triggerEvent) {
                  $timeout(function () {
                    $elm[0].focus();
                    //only select text if it is not being replaced below in the cellNav viewPortKeyPress
                    if ($elm[0].select && ($scope.col.colDef.enableCellEditOnFocus || !(uiGridCtrl && uiGridCtrl.grid.api.cellNav))) {
                      $elm[0].select();
                    }
                    else {
                      //some browsers (Chrome) stupidly, imo, support the w3 standard that number, email, ...
                      //fields should not allow setSelectionRange.  We ignore the error for those browsers
                      //https://www.w3.org/Bugs/Public/show_bug.cgi?id=24796
                      try {
                        $elm[0].setSelectionRange($elm[0].value.length, $elm[0].value.length);
                      }
                      catch (ex) {
                        //ignore
                      }
                    }
                  });

                  //set the keystroke that started the edit event
                  //we must do this because the BeginEdit is done in a different event loop than the intitial
                  //keydown event
                  //fire this event for the keypress that is received
                  if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                    var viewPortKeyDownUnregister = uiGridCtrl.grid.api.cellNav.on.viewPortKeyPress($scope, function (evt, rowCol) {
                      if (uiGridEditService.isStartEditKey(evt)) {
                        ngModel.$setViewValue(String.fromCharCode( typeof evt.which === 'number' ? evt.which : evt.keyCode), evt);
                        ngModel.$render();
                      }
                      viewPortKeyDownUnregister();
                    });
                  }

                  // macOS will blur the checkbox when clicked in Safari and Firefox,
                  // to get around this, we disable the blur handler on mousedown,
                  // and then focus the checkbox and re-enable the blur handler after $timeout
                  $elm.on('mousedown', function(evt) {
                    if ($elm[0].type === 'checkbox') {
                      $elm.off('blur', $scope.stopEdit);
                      $timeout(function() {
                        $elm[0].focus();
                        $elm.on('blur', $scope.stopEdit);
                      });
                    }
                  });

                  $elm.on('blur', function(evt) {
                      if ((!evt.relatedTarget) || (!evt.relatedTarget.classList.contains("PIMCLugarTerritorioDropdown") && !evt.relatedTarget.classList.contains("PIMCLugarTerritorioInput"))) {
                            $scope.stopEdit(evt);
                      }
                  });
                });


                $scope.deepEdit = false;

                $scope.stopEdit = function (evt) {
                  if ($scope.inputForm && !$scope.inputForm.$valid) {
                    evt.stopPropagation();
                    $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                  }
                  else {
                    $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                  }
                  $scope.deepEdit = false;
                };


                $elm.on('click', function (evt) {
                  if ($elm[0].type !== 'checkbox') {
                    $scope.deepEdit = true;
                    $timeout(function () {
                      $scope.grid.disableScrolling = true;
                    });
                  }
                });

                $elm.on('keydown', function (evt) {
                  switch (evt.keyCode) {
                    case uiGridConstants.keymap.ESC:
                      evt.stopPropagation();
                      $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                      break;
                  }

                  if ($scope.deepEdit &&
                    (evt.keyCode === uiGridConstants.keymap.LEFT ||
                     evt.keyCode === uiGridConstants.keymap.RIGHT ||
                     evt.keyCode === uiGridConstants.keymap.UP ||
                     evt.keyCode === uiGridConstants.keymap.DOWN)) {
                    evt.stopPropagation();
                  }
                  // Pass the keydown event off to the cellNav service, if it exists
                  else if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                    evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
                    if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
                      $scope.stopEdit(evt);
                    }
                  }
                  else {
                    //handle enter and tab for editing not using cellNav
                    switch (evt.keyCode) {
                      case uiGridConstants.keymap.ENTER: // Enter (Leave Field)
                      case uiGridConstants.keymap.TAB:
                        evt.stopPropagation();
                        evt.preventDefault();
                        $scope.stopEdit(evt);
                        break;
                    }
                  }

                  return true;
                });

                $scope.$on('$destroy', function unbindEvents() {
                  // unbind all jquery events in order to avoid memory leaks
                  $elm.off();
                });
              }
            };
          }
        };
      }]);

})(window.angular);
