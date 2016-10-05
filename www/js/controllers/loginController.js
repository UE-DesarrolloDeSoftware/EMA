angular.module('ema.controllers')

.controller('LoginCtrl', function ($scope, $ionicPopup, $ionicModal, $state, UsuarioService, $ionicHistory, Backand) {
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
                        template: 'Por favor verifique su cuenta con el email que le enviamos a su casilla de correo electronico.'
                    });

                } else {

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
                    title: '',
                    template: "Usuario existente"
                });

            } else {

                $scope.input.enabled = false;
                // Encriptar password
                $scope.input.password = hex_md5($scope.input.password);
                // Rol conductor
                $scope.input.role_id = 4;

                UsuarioService.addUsuario($scope.input).then(function () {

                    $scope.send($scope.input.email, "Email de Verificacion", "Link de verificacion");

                    $scope.input = {};
                    $scope.modal.hide();

                });
            }
        });
    };

    $scope.sendEmail = function () {
        $scope.send($scope.login.email, "Email de Verificacion", "Presione el siguiente link.");
    };

    /* GENERA VISTA DE ALTA DE USUARIO */
    $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {  $scope.modal = modal; });

    // Si ya esta logueado
    if (window.localStorage['usuario'] != null) {

        var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

        // Para que la vista de login no se retrocedible
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