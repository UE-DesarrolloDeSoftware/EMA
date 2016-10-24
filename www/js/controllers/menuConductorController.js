angular.module('ema.controllers')

.controller('MenuConductorController', function ($scope, $state, $cordovaGeolocation, $ionicPopup) {

    $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    $scope.sendEmail = function () {
        $scope.send("ue.ema.soporte@gmail.com", "Reportar Error", "Se ha encontrado el siguiente error..");
    };

    //// INICIALIZACION DEL MAPA
    //$scope.$on("$stateChangeSuccess", function () {
    //    $scope.map = {
    //        defaults: {
    //            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    //            maxZoom: 18,
    //            zoomControlPosition: 'bottomleft'
    //        },
    //        markers: {},
    //        events: {
    //            map: {
    //                enable: ['context'],
    //                logic: 'emit'
    //            }
    //        }
    //    };

    //    $scope.map.center = {
    //        lat: 38.8951100,
    //        lng: -77.0363700,
    //        zoom: 12
    //    };

    //    $scope.map.markers[0] = {
    //        lat: 38.8951100,
    //        lng: -77.0363700,
    //        message: 'Washington D.C., USA',
    //        focus: true,
    //        draggable: false
    //    };

    //});

    //// SITUAR EN POSICION ACTUAL
    //$scope.locate = function () {

    //    $cordovaGeolocation
    //      .getCurrentPosition()
    //      .then(function (position) {

    //          $scope.map.center.lat = position.coords.latitude;
    //          $scope.map.center.lng = position.coords.longitude;
    //          $scope.map.center.zoom = 15;

    //          $scope.map.markers.now = {
    //              lat: position.coords.latitude,
    //              lng: position.coords.longitude,
    //              message: "You Are Here",
    //              focus: true,
    //              draggable: false
    //          };

    //      }, function (err) {
    //          // error
    //          $ionicPopup.alert({
    //              title: 'Prueba',
    //              template: err.message
    //          });
    //      });

    //};


})
