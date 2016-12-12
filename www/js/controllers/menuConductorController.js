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

.controller('ConfiguracionUsuarioController', function ($scope, $state, $ionicModal, $ionicPopup, ConductorService) {
    $scope.input = {};
    var conductor = {};
    var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    ConductorService.getConductorByIdUsuario(usuarioLogueado.id).then(function (result) {

        $scope.conductor = result.data[0];
        $scope.input.patente = conductor.patente;

    });

    $scope.actualizar = function (id) {
        ConductorService.getConductorByIdUsuario(usuarioLogueado.id).then(function(result){
            $scope.conductor = result.data[0];
            
            $scope.modalUpdate.show();
            $scope.input = conductor;
             
        })
        
    }


    $scope.updateConductor = function () {

        conductor.patente = $scope.input.patente.toUpperCase();
        $scope.conductor.patente = $scope.input.patente;
        ConductorService.updateConductor($scope.conductor.id, conductor).then(function (result) {
            $scope.modalUpdate.hide();

            //POPUP ACTUALIZADO
            $ionicPopup.alert({
                title: 'Guardado',
                template: 'Las modificaciones han sido guardadas correctamente.'
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/updatePatente.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalUpdate = modal;
    });


})