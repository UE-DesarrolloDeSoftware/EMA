angular.module('ema.controllers')

.controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $state, UsuarioService, $ionicHistory) {
    $scope.input = {};
    $scope.login = {};

    // PARA DESARROLLO
    //$scope.login.email = 'pablo@gmail.com';
    //$scope.login.password = 'password';

    $scope.doLogin = function () {
        UsuarioService.doLogin($scope.login).then(function (result) {

            if (result.data[0] != null) {
                window.localStorage['usuario'] = result.data[0].name;

                // Para que la vista de login no se retrocedible
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                //$state.go('app.map');
                $state.go('eventmenu.menuVendedor');

                document.forms['loginForm'].reset();
            }
            else {
                $ionicPopup.alert({
                    title: '',
                    template: 'Usuario o Password invalido.'
                });
            }
        });
    };

    $scope.addUsuario = function () {
        UsuarioService.validateUserByEmail($scope.input).then(function (result) {
            if (result.data[0] != null) {
                $ionicPopup.alert({
                    title: '',
                    template: "Usuario existente"

                });
            } else {
                UsuarioService.addUsuario($scope.input).then(function () {
                    $scope.input = {};
                    $scope.modal.hide();

                });
            }


        });
    }

    /* GENERA VISTA DE ALTA DE USUARIO */
    $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    if (window.localStorage['usuario'] != null) {

        // Para que la vista de login no se retrocedible
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });

        $state.go('eventmenu.menuVendedor');
    }
})