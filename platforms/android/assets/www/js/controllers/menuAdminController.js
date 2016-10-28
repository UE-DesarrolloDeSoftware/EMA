angular.module('ema.controllers')

 .controller('MenuAdminController', function ($scope, $state) {
     $scope.goToUsuarios = function () {
         $state.go('usuarios');
     };

 })