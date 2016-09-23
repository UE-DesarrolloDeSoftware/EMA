angular.module('ema.Controllers.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

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
            $scope.reload();
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


    getAllUsuarios();
})

.controller('LoginCtrl', function($scope, $ionicPopup, $ionicModal, $state, UsuarioService) {
    $scope.input = {};
	$scope.login = {};

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
                UsuarioService.addUsuario($scope.input).then(function(){
                    $scope.input = {};
                    $scope.modal.hide();

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

    if (window.localStorage['usuario'] != null){
        $state.go('app.map');
    }
})

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

.controller('MenuCtrl', function($scope, $state) {

    $scope.goToUsuarios = function(){
        $state.go('usuarios');
    };

    $scope.logOut = function(){
        window.localStorage.removeItem("usuario");
        $state.go('login');
       
    };

    $scope.sendEmail = function () {
        if (window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                console.log("Response -> " + result);
            },
            "Feedback for your App", // Subject
            ' ',                      // Body
            ["test@example.com"],    // To
            [],                    // CC
            [],                    // BCC
             'false',                   // isHTML
            [],                    // Attachments
            []);                   // Attachment Data
        }
    }

    $scope.usuario = window.localStorage['usuario'];
})

