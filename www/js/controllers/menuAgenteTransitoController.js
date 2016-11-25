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

                 var departure_date_prorroga = new Date(parking.arrival_date);
                 departure_date_prorroga.setMinutes(departure_date_prorroga.getMinutes() + parseInt(minutosProrroga));

                 var fechaActual = new Date();

                 if (parking.departure_date != null && new Date(parking.departure_date) > fechaActual) {
                     // Estacionado
                     $scope.parking.estado = 3;
                 }
                 else if (departure_date_prorroga > fechaActual) {
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
