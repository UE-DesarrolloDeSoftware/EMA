angular.module('ema.controllers')

 .controller('MenuVendedorController', function ($scope, $state) {
     
     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('CancelarTicketController', function ($scope, VentasService, ParkingService, $ionicPopup) {
    $scope.input = {};
    $scope.sales = [];

    $scope.buscarVentas = function(){

        ParkingService.getParkingByPatente($scope.input.patente).then(function (result) {
            
            if (result.data.length != 0) {

                var parking_id = result.data[0].id;

                VentasService.getSalesByParkingId(parking_id).then(function (result) {

                    $scope.sales = [];
                    $scope.sales = result.data;
                });
            } else {

                $scope.sales = [];
                $ionicPopup.alert({ title: 'Atencion', template: 'Vehiculo no registrado o sin tickets en el sistema.' });
            }
        });
    }

    $scope.deleteVenta = function (id) {

        // VALIDAR QUE EL TIEMPO NO FUE USADO
        // HACER QUE RESTE EL TIEMPO

        VentasService.deleteVenta(id).then(function (result) {

            $scope.buscarVentas();
        });
    }
})

.controller('LiquidarTicketController', function ($scope, VentasService, ParkingService, VendedorService, ConfigurationsService, $ionicPopup) {
    $scope.input = {};

    $scope.horas = [];

    ConfigurationsService.getConfigurationByKey("cant_horas").then(function (result) {

        var cant_horas = parseInt(result.data.data[0].value);

        for (var i = 1; i <= cant_horas; i++){
            
            $scope.horas.push(i);
        }
    });

    
    $scope.addVenta = function(){

        var parkingFilter = {
            "q":
            {
                "patente": { "$eq": $scope.input.patente },
            }
        }

        ParkingService.getParkingsFilter(parkingFilter).then(function (result) {
         //ParkingService.getParkingByPatente($scope.input.patente).then(function (result) {
            
             if (result.data.data.length != 0) {

                 var parking = result.data.data[0];

                 $scope.input.parking = parking.id;
                 $scope.input.paid_date = new Date();

                 var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

                 VendedorService.getVendedorByIdUsuario(usuarioLogueado.id).then(function (result) {

                     $scope.input.vendor = result.data[0].id;

                     // REGISTRA VENTA
                     VentasService.addVenta($scope.input).then(function (result) {

                         var departure_date = new Date(parking.departure_date);
                         departure_date.setHours(departure_date.getHours() + parseInt($scope.input.hours));
                         parking.departure_date = departure_date;

                         // ACTUALIZA HORAS DE PARKING
                         ParkingService.updateParking(parking.id, parking).then(function (result) {

                             $ionicPopup.alert({ title: 'Ticket registrado' });

                         });
                     });
                 });
             } else {

                 $ionicPopup.alert({ title: 'Atencion', template: 'Vehiculo no registrado en el sistema.' });
             }
        });
    }
})

.controller('CierreController', function ($scope, $ionicPopup, $ionicModal, VentasService) {
    $scope.sales = [];
 
    function getAllSales() {
        VentasService.getSales().then(function (result) {
            $scope.sales = result.data.data;
        });
    }

    getAllSales();

 })

.controller('BuscarTicketController', function ($scope, VentasService) {
    $scope.sales = [];
    $scope.inputForm = {};
    $scope.inputForm.date = new Date();

    $scope.buscarTickets = function () {
        $scope.sales = [];
        var filter = [];

        if ($scope.inputForm.nroTicket != undefined) {
            filter.push(
                {
                "fieldName": "id",
                "operator": "equals",
                "value": $scope.inputForm.nroTicket
                }
            );
        }

        if ($scope.inputForm.date != undefined) {
            filter.push({
                "fieldName": "paid_date",
                "operator": "greaterThan",
                "value": $scope.inputForm.date.toISOString()
            });

            $scope.inputForm.date.setDate($scope.inputForm.date.getDate() + 1);

            filter.push({
                "fieldName": "paid_date",
                "operator": "lessThan",
                "value": $scope.inputForm.date.toISOString()
            });
        }

        VentasService.getSalesFilter(JSON.stringify(filter)).then(function (result) {
            $scope.sales = result.data.data;
        });
    }
})
