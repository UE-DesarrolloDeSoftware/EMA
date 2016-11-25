angular.module('ema', ['ionic', 'ema.controllers', 'ema.services', 'backand', 'angularjs-dropdown-multiselect'])

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

.run(function (Backand) {

    //Backand.signin("ue.ema.soporte@gmail.com", "emadesarrollosw");
})

.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

  BackandProvider.setAppName('emaupe');
  BackandProvider.setAnonymousToken('41979cd2-4dc3-4d87-942b-57dd11da6589');
  //BackandProvider.setSignUpToken('aa34be1e-8b2c-11e6-8eff-0e00ae4d21e3');
  
      $stateProvider

      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      })

        .state('validacionEmail', {
            url: "/validacionEmail?email&verificationHash",
            templateUrl: "templates/validacionEmail.html",
            controller: 'ValidacionEmailController'
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
                    templateUrl: "templates/menuVendedor.html",
                    controller: 'MenuVendedorController'
            }
        }
        })
        .state('eventmenu.menuVendedor.liquidarTicket', {
            url: "/liquidarTicket",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/liquidarTicket.html",
                    controller:"LiquidarTicketController"
                }
            }
        })
        .state('eventmenu.menuVendedor.cancelarTicket', {
            url: "/cancelarTicket",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/cancelarTicket.html",
                    controller: "CancelarTicketController"
                
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
                    templateUrl: "templates/buscarTicket.html",
                    controller: "BuscarTicketController"
                }
            }
        })

        .state('eventmenu.menuVendedor.revisionVentas.cierreVentas', {
            url: "/cierreVentas",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/cierreDiario.html",
                    controller: 'CierreController'
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

        .state('eventmenu.menuVendedor.preguntasFrecuentes', {
            url: "/preguntasFrecuentes",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/preguntasFrecuentes.html",
                    controller: 'PreguntasFrecuentesController'
                }
            }
        })

        .state('eventmenu.menuVendedor.condicionesUso', {
            url: "/condicionesUso",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/condicionesUso.html",
                    controller: 'CondicionesUsoController'
                }
            }
        })

        .state('eventmenu.menuVendedor.estadoServicio', {
            url: "/estadoServicio",
            views: {
                'menuContent@eventmenu': {
                    templateUrl: "templates/estadoServicio.html",
                    controller: 'EstadoServicioController'
                }
            }
        })

        .state('eventmenu.menuVendedor.contactoSoporte', {
            url: "/contactoSoporte",
            views: {
                'menuContent@eventmenu': {

                    templateUrl: "templates/contactoSoporte.html",
                    controller: 'ContactoSoporteController'
                }
            }
        })



    // MENU ADMINISTRADOR

    .state('eventmenu.menuAdmin', {
        url: "/menuAdmin",
        views: {
            'menuContent': {
                templateUrl: "templates/menuAdministrador.html",
                controller: 'MenuAdminController'
            }
        }
    })

    .state('eventmenu.menuAdmin.usuarios', {
        url: "/usuarios",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/usuarios.html",
                controller: 'UsuariosController'
            }
        }
    })

    .state('eventmenu.menuAdmin.configuracion', {
        url: "/configuracion",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/configuracionAdmin.html",
                controller: 'ConfiguracionAdminController'
            }
        }
    })

    .state('eventmenu.menuAdmin.preguntasFrecuentes', {
        url: "/preguntasFrecuentes",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/preguntasFrecuentes.html",
                controller: 'PreguntasFrecuentesController'
            }
        }
    })

    .state('eventmenu.menuAdmin.condicionesUso', {
        url: "/condicionesUso",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/condicionesUso.html",
                controller: 'CondicionesUsoController'
            }
        }
    })

    .state('eventmenu.menuAdmin.estadoServicio', {
        url: "/estadoServicio",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/estadoServicio.html",
                controller: 'EstadoServicioController'
            }
        }
    })

    .state('eventmenu.menuAdmin.mapAdminZonas', {
        url: "/mapadminZonas",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/mapAdminZonas.html",
                controller: 'MapAdminController'
            }
        }
    })

    //se hace todo dentro de la pantalla de zonas de estacionamiento
/*    .state('eventmenu.menuAdmin.mapAdminAddPuntosVenta', {
        url: "/mapAdminAddPuntosVenta",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/liquidarTicket.html",
                controller: 'MapAdminController'
            }
        }
    })
*/

    .state('eventmenu.menuAdmin.contactoSoporte', {
        url: "/contactoSoporte",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/contactoSoporte.html",
                controller: 'ContactoSoporteController'
            }
        }
    })

    // MENU AGENTE DE TRANSITO

    .state('eventmenu.menuAgenteTransito', {
        url: "/menuAgenteTransito",
        views: {
            'menuContent': {
                templateUrl: "templates/menuAgenteTransito.html",
                controller: "MenuAgenteTransitoController"
            }
        }
    })

    .state('eventmenu.menuAgenteTransito.comprobarEstadoVehiculo', {
        url: "/comprobarEstadoVehiculo",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/comprobarEstadoVehiculo.html",
                controller: 'ComprobarEstadoVehiculoController'
            }
        }
    })

    .state('eventmenu.menuAgenteTransito.preguntasFrecuentes', {
        url: "/preguntasFrecuentes",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/preguntasFrecuentes.html",
                controller: 'PreguntasFrecuentesController'
            }
        }
    })

    .state('eventmenu.menuAgenteTransito.condicionesUso', {
        url: "/condicionesUso",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/condicionesUso.html",
                controller: 'CondicionesUsoController'
            }
        }
    })

    .state('eventmenu.menuAgenteTransito.estadoServicio', {
        url: "/estadoServicio",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/estadoServicio.html",
                controller: 'EstadoServicioController'
            }
        }
    })

    .state('eventmenu.menuAgenteTransito.contactoSoporte', {
        url: "/contactoSoporte",
        views: {
            'menuContent@eventmenu': {
                templateUrl: "templates/contactoSoporte.html",
                controller: 'ContactoSoporteController'
            }
        }
    })

    // MENU CONDUCTOR

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

    .state('menu.map.configuracionUsuario', {
        url: "/configuracionUsuario",
        views: {
            'menuContent@menu': {
                templateUrl: "templates/configuracionUsuario.html",
                controller: 'ConfiguracionUsuarioController'
            }
        }
    })

    .state('menu.map.preguntasFrecuentes', {
        url: "/preguntasFrecuentes",
        views: {
            'menuContent@menu': {
                templateUrl: "templates/preguntasFrecuentes.html",
                controller: 'PreguntasFrecuentesController'
            }
        }
    })

    .state('menu.map.condicionesUso', {
        url: "/condicionesUso",
        views: {
            'menuContent@menu': {
                templateUrl: "templates/condicionesUso.html",
                controller: 'CondicionesUsoController'
            }
        }
    })
    .state('menu.map.estadoServicio', {
        url: "/estadoServicio",
        views: {
            'menuContent@menu': {
                templateUrl: "templates/estadoServicio.html",
                controller: 'EstadoServicioController'
            }
        }
    })

    .state('menu.map.contactoSoporte', {
        url: "/contactoSoporte",
        views: {
            'menuContent@menu': {
                templateUrl: "templates/contactoSoporte.html",
                controller: 'ContactoSoporteController'
            }
        }
    })

    ;

    $urlRouterProvider.otherwise("/login");
})

