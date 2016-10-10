angular.module('ema.controllers')

 .controller('MenuVendedorController', function ($scope, $state) {
     
     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('CancelarTicketController', function ($scope) {


})

.controller('LiquidarTicketController', function ($scope) {


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
