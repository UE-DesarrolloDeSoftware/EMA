angular.module('ema.controllers')

.controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $state, UsuarioService, ConductorService, ConfigurationsService, $ionicHistory, Backand) {
    // Limpia la cache cuando el usuario es redirigido al login 
    $scope.$on('$ionicView.enter', function (event, viewData) {
        $ionicHistory.clearCache();
    });

    $scope.input = {};
    $scope.login = {};

    $scope.doLogin = function () {

        UsuarioService.doLogin($scope.login).then(function (result) {

            if (result.data[0] != null) {

                var usuario = result.data[0];

                // Usuario con verifiacion de email pendiente
                if (usuario.enabled == false) {

                    $ionicPopup.alert({
                        title: 'Usuario no verificado',
                        template: 'Por favor verifique la cuenta con el email que le enviamos a su correo electronico.'
                    });

                } else {
                    // Guarda usuario logueado
                    localStorage.setItem('usuario', JSON.stringify(result.data[0]));

                    // Para que la vista de login no se retrocedible
                    $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });

                    // blanqueo de campos
                    $scope.login = {};
                    document.forms['loginForm'].reset();

                    // Redireccion segun rol
                    redirigirSegunRol(usuario.role_id);
                }
            }
            else {
                $ionicPopup.alert({title: 'Atencion', template: 'Usuario o Password invalido.'});
            }
        });
    };

    $scope.addUsuario = function () {
        UsuarioService.validateUserByEmail($scope.input).then(function (result) {

            if (result.data[0] != null) {

                $ionicPopup.alert({
                    title: 'Atencion',
                    template: "El usuario que ingreso ya se encuentra registrado. </br> ¿Ha olvidado su contraseña? </br> <-Link para reestablecerla->"
                });

            } else {

                $scope.input.enabled = false;
                // Rol conductor
                $scope.input.role_id = 4;
                // Genera codigo de verificacion por email
                $scope.input.verification_hash = randomString();

                // ALTA DE USUARIO
                UsuarioService.addUsuario($scope.input).then(function (usuario) {

                    var conductor = {};
                    conductor.usuario_id = usuario.data.__metadata.id;
                    conductor.patente = $scope.input.patente;

                    // ALTA DE ROL CONDUCTOR
                    ConductorService.addConductor(conductor).then(function () {

                        // ENVIO MAIL DE VALIDACION AL NUEVO USUARIO
                        ConfigurationsService.getConfigurationByKey("verification_email").then(function (result) {

                            var email = String.format(result.data.data[0].value, $scope.input.email, $scope.input.verification_hash);
                            $scope.send($scope.input.email, "Email de Verificacion", encodeURIComponent(email));

                            // Blanqueo y cierro PopUp de registracion
                            $scope.input = {};
                            $scope.modal.hide();
                        });
                    });
                });
            }
        });
    };

    /* GENERA VISTA DE ALTA DE USUARIO */
    $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {  $scope.modal = modal; });

    // Si ya esta logueado
    if (window.localStorage['usuario'] != null) {

        var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

        // Para que la vista de login no sea retrocedible
        $ionicHistory.nextViewOptions({ disableAnimate: true, disableBack: true });

        // Redireccion segun rol
        redirigirSegunRol(usuarioLogueado.role_id);
    }

    function redirigirSegunRol(role_id) {
        // Redireccion segun rol
        switch (role_id) {
            case 1:
                $state.go('eventmenu.menuAdmin');
                break;
            case 2:
                $state.go('eventmenu.menuVendedor');
                break;
            case 3:
                $state.go('eventmenu.menuAgenteTransito');
                break;
            case 4:
                $state.go('menu.map');
                break;
        }
    }

})