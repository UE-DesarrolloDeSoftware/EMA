angular.module('ema', ['ionic', 'ema.controllers','ema.services', 'backand'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

  BackandProvider.setAppName('emaupe');
  BackandProvider.setAnonymousToken('41979cd2-4dc3-4d87-942b-57dd11da6589');

      $stateProvider

      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      })
      .state('verificacionEmail', {
        url: "/verificacion-email",
        templateUrl: "templates/verificacionEmail.html",
        controller: 'LoginCtrl'
      })

        .state('eventmenu', {
            url: "/event",
            abstract: true,
            templateUrl: "templates/eventMenu.html"
        })

        // MENU VENDEDOR

        .state('eventmenu.menuVendedor', {
            url: "/menuVendedor",
            views: {
                'menuContent': {
                    templateUrl: "templates/menuVendedor.html"
            }
        }
        })
        .state('eventmenu.menuVendedor.liquidarTicket', {
            url: "/liquidarTicket",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/liquidarTicket.html"
                }
            }
        })
        .state('eventmenu.menuVendedor.cancelarTicket', {
            url: "/cancelarTicket",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/cancelarTicket.html"
                }
            }
        })
        .state('eventmenu.menuVendedor.revisionVentas', {
            url: "/revisionVentas",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/ventas.html"
                }
            }
        })

        .state('eventmenu.menuVendedor.revisionVentas.buscarTicket', {
            url: "/buscarTicket",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/buscarTicket.html"
                }
            }
        })

        .state('eventmenu.menuVendedor.revisionVentas.cierreVentas', {
            url: "/cierreVentas",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/cierreDiario.html"
                }
            }
        })

        .state('eventmenu.menuVendedor.revisionVentas.resumenDiario', {
            url: "/resumenDiario",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/vistaDiaria.html"
                }
            }
        })

        .state('eventmenu.menuVendedor.revisionVentas.totalesDiarios', {
            url: "/totalesDiarios",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/totalesDiarios.html"
                }
            }
        })

        .state('eventmenu.menuVendedor.listaPrecios', {
            url: "/listaPrecios",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/listaDePrecios.html"
                }
            }
        })


        // MENU ADMINISTRADOR

        .state('eventmenu.menuAdmin', {
            url: "/menuAdmin",
            views: {
                'menuContent': {
                    templateUrl: "templates/menuAdministrador.html"
                }
            }
        })

      .state('eventmenu.menuAdmin.usuarios', {
          url: "/liquidarTicket",
          views: {
              'menuContent@eventmenu': {
                  templateUrl: "templates/usuarios.html",
                  controller: 'UsuariosCtrl'
              }
          }
      })

    // MENU CONDUCTOR

        //.state('eventmenu.menuConductor', {
        //    url: "/menuConductor",
        //    views: {
        //    'menuContent' :{
        //        templateUrl: "templates/menu.html",
        //        controller: 'MenuConductorController'
        //    }
        //    }
        //})

        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'MenuConductorController'
        })

        .state('menu.map', {
          url: "/map",
          views: {
            'menuContent' :{
              templateUrl: "templates/map.html",
              controller: 'MapController'
            }
          }
        })

    ;

      $urlRouterProvider.otherwise("/login");
})

