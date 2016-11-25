angular.module('ema.controllers')

 .controller('MenuAgenteTransitoController', function ($scope, $state) {

     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('ComprobarEstadoVehiculoController', function ($scope, $state, ConfigurationsService, ParkingService) {
     $scope.inputForm = {};
     $scope.parking = {};

     var minutosProrroga = 0;

     ConfigurationsService.getConfigurationByKey("minutos_prorroga").then(function (result) {
         minutosProrroga = result.data.data[0].value;
     });

     $scope.comprobarEstado = function () {

         ParkingService.getParkingByPatente($scope.inputForm.patente.toUpperCase()).then(function (result) {

             if (result.data.length > 0) {

                 var parking = result.data[0];

                 var prorroga_date = new Date(parking.arrival_date);
                 prorroga_date.setMinutes(prorroga_date.getMinutes() + parseInt(minutosProrroga));

                 var departure_date = new Date(parking.departure_date);

                 var fechaActual = new Date();

                 if (departure_date > prorroga_date &&
                     departure_date > fechaActual) {
                     // Estacionado
                     $scope.parking.estado = 3;
                 }
                 else if (prorroga_date >= departure_date &&
                    departure_date > fechaActual) {
                     // Prorroga
                     $scope.parking.estado = 2;
                 }
                 else {
                     // Infraccion
                     $scope.parking.estado = 1;
                 }
             } else {

                 // Infraccion
                 $scope.parking.estado = 1;
             }
         });
     }
 })
