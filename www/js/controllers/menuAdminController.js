angular.module('ema.controllers')

.controller('MenuAdminController', function ($scope, $state) {
     $scope.goToUsuarios = function () {
         $state.go('usuarios');
     };

     $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
 })

.controller('UsuariosController', function ($scope, $ionicPopup, $ionicModal, UsuarioService) {

    $scope.usuarios = [];
    $scope.input = {};

    $scope.currentPage = 1;
    $scope.pageSize = 6;

    function getAllUsuarios() {
        //UsuarioService.getUsuarios().then(function (result) {
        //    $scope.usuarios = result.data.data;
        //});
        UsuarioService.getUsuariosPage($scope.pageSize, $scope.currentPage).then(function (result) {
            $scope.usuarios = result.data.data;
        });
    }

    $scope.loadNextPage = function () {
        $scope.currentPage++;

        UsuarioService.getUsuariosPage($scope.pageSize, $scope.currentPage).then(function (result) {
            $scope.usuarios = result.data.data;
        });
    }

    $scope.loadPreviousPage = function () {
        $scope.currentPage--;

        UsuarioService.getUsuariosPage($scope.pageSize, $scope.currentPage).then(function (result) {
            $scope.usuarios = result.data.data;
        });
    }

    $scope.addUsuario = function () {
        UsuarioService.addUsuario($scope.input).then(function (result) {
            $scope.input = {};
            $scope.modal.hide();
            getAllUsuarios();
            //$scope.reload();
        });
    }

    $scope.deleteUsuario = function (id) {
        UsuarioService.deleteUsuario(id).then(function (result) {
            getAllUsuarios();
        });
    }

    var usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    $scope.isAdmin = usuarioLogueado.role_id == 1 ? true : false;
    $scope.example1model = [];
    $scope.example1data = [{ id: 1, label: "Lunes" },
        { id: 2, label: "Martes" }, { id: 3, label: "Miercoles" },
        { id: 4, label: "Jueves" }, { id: 5, label: "Viernes" },
        { id: 6, label: "Sabado" }, { id: 7, label: "Domingo" }];
    $scope.example5customTexts = { buttonDefaultText: 'Dias laborales' };
    $scope.example13settings = {
        smartButtonMaxItems: 7,
        smartButtonTextConverter: function (itemText, originalItem) { return itemText; }
    };

    /* GENERA VISTA DE ALTA DE USUARIO */
    $ionicModal.fromTemplateUrl('templates/addUsuario.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    getAllUsuarios();
})

.controller('ConfiguracionAdminController', function ($scope, $state, ConfigurationsService) {
    
    ConfigurationsService.getConfigurations().then(function (result) {
        $scope.configuraciones = result.data.data;
    });
})

