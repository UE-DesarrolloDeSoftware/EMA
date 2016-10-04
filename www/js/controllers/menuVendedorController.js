angular.module('ema.controllers')

 .controller('MenuVendedorController', function ($scope, $state) {
     
     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('CancelarTicketController', function ($scope) {


})

.controller('LiquidarTicketController', function ($scope) {


})


.controller('CierreCtrl', function ($scope, $ionicPopup, $ionicModal, VentasService) {

    $scope.sales = [];
 

    function getAllSales() {
        VentasService.getSales().then(function (result) {
            $scope.sales = result.data.data;
        });
    }

    getAllSales();

 })

