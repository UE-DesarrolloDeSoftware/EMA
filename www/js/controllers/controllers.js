angular.module('ema.Controllers.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

.controller('UsuariosCtrl', function($scope, $ionicPopup, UsuarioService) {

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
            getAllUsuarios();
        });
    }

    $scope.deleteUsuario = function(id){
        UsuarioService.deleteUsuario(id).then(function(result){
            getAllUsuarios();
        });
    }

    getAllUsuarios();
})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, UsuarioService) {

	$scope.login = {};

    $scope.doLogin = function(){
//      UsuarioService.doLogin($scope.login).then(function(result){
//
//        $ionicPopup.alert({
//           title: 'Usuario Encontrado',
//           template: result.data[0].name + ' / ' + result.data[0].email
//        });
//
//        $state.go('tab.usuarios');
//      });

      $state.go('app.map');
    };
})

.controller('MapController',function($scope, $cordovaGeolocation ){

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
            console.log("Location error!");
            console.log(err);
          });

      };
})

