angular.module('ema.controllers')

 .controller('MenuVendedorController', function ($scope, $state) {
     
     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('CancelarTicketController', function ($scope, VentasService,ParkingService) {
    $scope.input = {};
    $scope.sales = [];

    $scope.buscarVentas = function(){

        ParkingService.getParkingByPatente($scope.input.patente).then(function (result) {
            
            var parking_id = result.data[0].id;
            VentasService.getSalesByParkingId(parking_id).then(function(result) {
                $scope.sales = [];
                $scope.sales = result.data;

            });

        });
    }
    $scope.deleteVenta = function (id) {
        VentasService.deleteVenta(id).then(function (result) {
            $scope.buscarVentas();
        });
    }

})

.controller('LiquidarTicketController', function ($scope,VentasService, ParkingService, VendedorService,$ionicPopup) {
    $scope.input = {};
    
    $scope.addVenta = function(){

         ParkingService.getParkingByPatente($scope.input.patente).then(function (result) {
            
            $scope.input.parking = result.data[0].id;
            $scope.input.paid_date = new Date();

            var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
            
            VendedorService.getVendedorByIdUsuario(usuarioLogueado.id).then(function (result) {

                $scope.input.vendor = result.data[0].id;

                VentasService.addVenta($scope.input).then(function (result) {
            
                $ionicPopup.alert({title: 'Atencion', template: 'Venta registrada'});
                });
            });
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
