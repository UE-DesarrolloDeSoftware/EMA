angular.module('ema.controllers')

.controller('UsuariosCtrl', function ($scope, $ionicPopup, $ionicModal, UsuarioService) {

    $scope.usuarios = [];
    $scope.input = {};

    function getAllUsuarios() {
        UsuarioService.getUsuarios().then(function (result) {
            $scope.usuarios = result.data.data;
        });
    }

    $scope.addUsuario = function () {
        UsuarioService.addUsuario($scope.input).then(function (result) {
            $scope.input = {};
            $scope.modal.hide();
            getAllUsuarios();
            $scope.reload();
        });
    }

    $scope.deleteUsuario = function (id) {
        UsuarioService.deleteUsuario(id).then(function (result) {
            getAllUsuarios();
        });
    }

    /* GENERA VISTA DE ALTA DE USUARIO */
    $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });


    getAllUsuarios();
})