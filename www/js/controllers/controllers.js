<<<<<<< HEAD
//angular.module('ema.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

//.controller('UsuariosCtrl', function($scope, $ionicPopup, $ionicModal, UsuarioService) {

//    $scope.usuarios = [];
//    $scope.input = {};

//    function getAllUsuarios(){
//        UsuarioService.getUsuarios().then(function(result){
//            $scope.usuarios = result.data.data;
//        });
//    }

//    $scope.addUsuario = function(){
//        UsuarioService.addUsuario($scope.input).then(function(result){
//            $scope.input = {};
//            $scope.modal.hide();
//            getAllUsuarios();
//            $scope.reload();
//        });
//    }

//    $scope.deleteUsuario = function(id){
//        UsuarioService.deleteUsuario(id).then(function(result){
//            getAllUsuarios();
//        });
//    }

//      /* GENERA VISTA DE ALTA DE USUARIO */
//      $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//      }).then(function(modal) {
//          $scope.modal = modal;
//      });


//    getAllUsuarios();
//})

//.controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $state, UsuarioService, $ionicHistory) {
//    $scope.input = {};
//	$scope.login = {};

//	// PARA DESARROLLO
//	//$scope.login.email = 'pablo@gmail.com';
//    //$scope.login.password = 'password';

//    $scope.doLogin = function(){
//      UsuarioService.doLogin($scope.login).then(function(result){

//        if (result.data[0] != null){
//            window.localStorage['usuario'] = result.data[0].name;

//            // Para que la vista de login no se retrocedible
//            $ionicHistory.nextViewOptions({
//                disableAnimate: true,
//                disableBack: true
//            });

//            //$state.go('app.map');
//            $state.go('eventmenu.menuAdmin');

//            document.forms['loginForm'].reset();
//        }
//        else {
//            $ionicPopup.alert({
//               title: '',
//               template: 'Usuario o Password invalido.'
//            });
//        }
//      });
//    };

//    $scope.addUsuario = function(){
//        UsuarioService.validateUserByEmail($scope.input).then(function(result){
//            if (result.data[0] != null){
//                $ionicPopup.alert({
//                   title: '',
//                   template: "Usuario existente"

//                });
//            } else {
//                UsuarioService.addUsuario($scope.input).then(function(){
//                    $scope.input = {};
//                    $scope.modal.hide();

//                });
//            }
        
        
//      });
//    }
=======
angular.module('ema.controllers.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

.controller('UsuariosCtrl', function($scope, $ionicPopup, $ionicModal, UsuarioService) {

    $scope.usuarios = [];
    $scope.input = {};

    function getAllUsuarios(){
        UsuarioService.getUsuarios().then(function(result){
            $scope.usuarios = result.data.data;
        });
    }

    $scope.addUsuario = function(){
        UsuarioService.addUsuario($scope.input).then(function(result){
            $scope.input = {};
            $scope.modal.hide();
            getAllUsuarios();
            
        });
    }

    $scope.deleteUsuario = function(id){
        UsuarioService.deleteUsuario(id).then(function(result){
            getAllUsuarios();
        });
    }

      /* GENERA VISTA DE ALTA DE USUARIO */
      $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
      });
>>>>>>> 9d24726eb7bbee20bd8d7a8dab735b3acac420d4

//      /* GENERA VISTA DE ALTA DE USUARIO */
//      $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
//        scope: $scope,
//        animation: 'slide-in-up'
//      }).then(function(modal) {
//          $scope.modal = modal;
//      });

//      if (window.localStorage['usuario'] != null) {

<<<<<<< HEAD
//          // Para que la vista de login no se retrocedible
//          $ionicHistory.nextViewOptions({
//              disableAnimate: true,
//              disableBack: true
//          });
=======
.controller('LoginCtrl', function($scope, $ionicPopup, $ionicModal, $state, UsuarioService,$http, Backand) {
    $scope.input = {};
	  $scope.login = {};
    $scope.recipient={};
    var fromEmail = 'ue.ema.soporte@gmail.com'
    var subject = 'Verificacion de Email'
    var mailgunUrl = "sandbox4aeb06ae0710402eb9b63db5d2105d5c.mailgun.org";
    var mailgunApiKey = window.btoa("api:key-c8c1bb40de08e99ed05b70e686d2be61")
    var message = Backand.getApiUrl() + '/1/query/data/verificacionEmail'
    

	// PARA DESARROLLO
	//$scope.login.email = 'pablo@gmail.com';
    //$scope.login.password = 'password';

    $scope.doLogin = function(){
      UsuarioService.doLogin($scope.login).then(function(result){

        if (result.data[0] != null){
            window.localStorage['usuario'] = result.data[0].name;
            $state.go('app.map');
            document.forms['myFormName'].reset();
        }
        else {
            $ionicPopup.alert({
               title: '',
               template: 'Usuario o Password invalido.'
            });
        }
      });
    };

    $scope.addUsuario = function(){
        UsuarioService.validateUserByEmail($scope.input).then(function(result){
            if (result.data[0] != null){
                $ionicPopup.alert({
                   title: '',
                   template: "Usuario existente"

                });
            } else {
                UsuarioService.addUsuario($scope.input).then(function(recipient){
                    $scope.input = {};
                    $scope.modal.hide();
                    $http(
                      {
                      "method": "POST",
                      "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
                      "headers": {
                          "Content-Type": "multipart/form-data; charset=utf-8",
                          "Authorization": "Basic " + mailgunApiKey,
                      },
                    data: "from=" + fromEmail + "&to=" + recipient + "&subject=" + subject + "&text=" + message
                      }
                        ).then(function(success) {
                          console.log("SUCCESS " + JSON.stringify(success));
                      }, function(error) {
                          console.log("ERROR " + JSON.stringify(error));
                      });

                });
            }
        
        
      });
    }




      /* GENERA VISTA DE ALTA DE USUARIO */
      $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.modal = modal;
      });
>>>>>>> 9d24726eb7bbee20bd8d7a8dab735b3acac420d4

//        $state.go('eventmenu.menuAdmin');
//    }
//})

.controller('MapController',function($scope, $cordovaGeolocation, $ionicPopup ){

      // INICIALIZACION DEL MAPA
      $scope.$on("$stateChangeSuccess", function() {
        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };

        $scope.map.center  = {
          lat : 38.8951100,
          lng : -77.0363700,
          zoom : 12
        };

        $scope.map.markers[0] = {
          lat : 38.8951100,
          lng : -77.0363700,
          message: 'Washington D.C., USA',
          focus: true,
          draggable: false
        };

      });

      // SITUAR EN POSICION ACTUAL
      $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
              $ionicPopup.alert({
                 title: 'Prueba',
                 template: err.message
              });
          });

      };
})

//.controller('MenuCtrl', function($scope, $state) {

//    $scope.goToUsuarios = function(){
//        $state.go('usuarios');
//    };

//    $scope.logOut = function(){
//        window.localStorage.removeItem("usuario");
//        $state.go('login');
       
//    };

//    $scope.sendEmail = function () {
//        if (window.plugins && window.plugins.emailComposer) {
//            window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
//                console.log("Response -> " + result);
//            },
//            "Feedback for your App", // Subject
//            ' ',                      // Body
//            ["test@example.com"],    // To
//            [],                    // CC
//            [],                    // BCC
//             'false',                   // isHTML
//            [],                    // Attachments
//            []);                   // Attachment Data
//        }
//    }

//    $scope.usuario = window.localStorage['usuario'];
//})

