angular.module('ema.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate', 'backand'])

.controller('MainContoller', function ($scope, $state, $http, $ionicNavBarDelegate, Backand) {

        //$ionicNavBarDelegate.showBackButton(false);

        $scope.logOut = function(){
            window.localStorage.removeItem("usuario");
            //Backand.signout();

            $state.go('login');
        };

        var mailgunUrl = "ue-ema.com";
        var mailgunApiKey = window.btoa("api:key-c8c1bb40de08e99ed05b70e686d2be61")

        $scope.send = function(recipient, subject, message) {
            $http(
                {
                    "method": "POST",
                    "url": "https://api.mailgun.net/v3/" + mailgunUrl + "/messages",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic " + mailgunApiKey
                    },
                    data: "from=" + "ue.ema.soporte@gmail.com" + "&to=" + recipient + "&subject=" + subject + "&html=" + message
                }
            ).then(function(success) {
                console.log("SUCCESS " + JSON.stringify(success));
            }, function(error) {
                console.log("ERROR " + JSON.stringify(error));
            });
        }
})

.controller('ValidacionEmailController', function ($scope, $state, $stateParams, UsuarioService, $ionicPopup) {

    $scope.email = $stateParams.email;
    $scope.verificationHash = $stateParams.verificationHash;

    $scope.verificarUsuario = function () {

        UsuarioService.verificarUsuario($scope).then(function (result) {

            if (result.data[0] != null && result.data[0].enabled == true) {

                var message = String.format("{0} {1} su email ha sido confirmado, puede comenzar a utilizar EMA", result.data[0].name, result.data[0].lastname);

                $ionicPopup.alert({
                    title: 'Felicitaciones',
                    template: message
                }).then(function () {
                    $state.go("login");
                });
            }
        });
    };
})

.controller('ContactoSoporteController', function ($scope, $state) {

    $scope.inputForm = {};
    $scope.inputForm.motivo = "Consulta";

    $scope.enviarComentarios = function () {

        var mensaje = "<div><h2>{0}</h2><h2>{1}</h2><div>{2}</div></div>";

        $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

        mensaje = String.format(mensaje, $scope.usuarioLogueado.email, $scope.inputForm.motivo, $scope.inputForm.comentarios);

        $scope.send("ue.ema.soporte@gmail.com", "Contacto desde la app", mensaje);

    }
})

.controller('CondicionesUsoController', function ($scope, ConfigurationsService) {

    ConfigurationsService.getConfigurationByKey("terminos_legales").then(function (result) {

        $scope.condicionesUso = result.data.data[0].value;

    });
})