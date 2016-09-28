angular.module('ema.controllers')

.controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $state, UsuarioService, $ionicHistory, Backand) {
    $scope.input = {};
    $scope.login = {};
    $scope.recipient = {};
    var fromEmail = 'ue.ema.soporte@gmail.com'
    var subject = 'Verificacion de Email'
    var mailgunUrl = "sandbox4aeb06ae0710402eb9b63db5d2105d5c.mailgun.org";
    var mailgunApiKey = window.btoa("api:key-c8c1bb40de08e99ed05b70e686d2be61")
    var message = Backand.getApiUrl() + '/1/query/data/verificacionEmail'

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

                // blanqueo de campos
                $scope.login = {};
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

                    $http(
                    {
                        "method": "POST",
                        "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
                        "headers": {
                            "Content-Type": "multipart/form-data; charset=utf-8",
                            "Authorization": "Basic " + mailgunApiKey,
                        },
                        data: "from=" + fromEmail + "&to=" + recipient + "&subject=" + subject + "&text=" + message
                    }
                    ).then(function (success) {
                        console.log("SUCCESS " + JSON.stringify(success));
                    }, function (error) {
                        console.log("ERROR " + JSON.stringify(error));
                    });
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