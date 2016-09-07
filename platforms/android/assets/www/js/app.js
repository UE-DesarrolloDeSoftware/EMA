angular.module('ema', ['ionic', 'ema.Controllers.controllers','ema.Services.services', 'backand'])

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

  BackandProvider.setAppName('plosada');
  BackandProvider.setAnonymousToken('9198a4e0-4da8-4e03-a02e-d03f67e4e4c6');

      $stateProvider

      .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      })

        .state('usuarios', {
            url: '/usuarios',
            templateUrl: 'templates/usuarios.html',
            controller: 'UsuariosCtrl'
        })

    //   setup an abstract state for the tabs directive
//      .state('tab', {
//          url: '/tabs',
//          abstract: true,
//          templateUrl: 'templates/tabs.html'
//      })

//      .state('tab.usuarios', {
//          url: '/usuarios',
//          views: {
//              'tab-usuarios': {
//                  templateUrl: 'templates/usuarios.html',
//                  controller: 'UsuariosCtrl'
//              }
//          }
//      })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl'
    })

    .state('app.map', {
      url: "/map",
      views: {
        'menuContent' :{
          templateUrl: "templates/map.html",
          controller: 'MapController'
        }
      }
    })
  ;

   $urlRouterProvider.otherwise('/login');
})

