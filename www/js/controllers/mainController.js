angular.module('ema.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate', 'backand'])

.controller('MainContoller', function ($scope, $state, $http, $ionicNavBarDelegate, $ionicLoading, Backand) {

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

        $scope.showLoading = function () {
            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }

        $scope.hideLoading = function () {
            $ionicLoading.hide();
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

.controller('PreguntasFrecuentesController', function ($scope) {
    $scope.usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
    
    $scope.groups = ["¿Cómo me registro a EMA?","¿Debo SI o SI estar registrado para usar EMA?","¿Cómo puedo ver las Zonas de Estacionamiento Medido?","¿Cómo veo los puntos de venta?","¿Cómo selecciono un punto de venta?","¿Cómo cambio de punto de venta?"," Ya seleccioné un punto de venta. ¿Y ahora qué?","¿Qué es el Tiempo de Prróroga?","¿Qué pasa si me excedo del tiempo de prórroga?"," Ya compré un código de venta. ¿Y ahora qué?","¿Puedo ingresar más de un código a la vez?","¿Cómo cancelo el tiempo de estacionamiento?","¿Qué puedo hacer en el menú Opciones?"];
    var r1 = "Registrarse en EMA es fácil y totalmente gratuito. Solamente debes seleccionar la opción 'Registrarse' en la pantalla principal de la aplicación. A continuación, se le solicitarán los siguientes datos:\n\nNombre, Apellido, Fecha De Nacimiento, DNI, Teléfono, Celular, una Patente (al menos), E-mail y Contraseña.\n\nAdemás que deberá aceptar los Términos y Condiciones que puede visualizar haciendo clic en el link.\n\nUna vez ingresados los datos y aceptados los Términos y Condiciones, haga clic en 'Registrarme'. Una vez registrado, se le enviará un e-mail a su casilla para que active su cuenta y pueda usar los servicios de EMA."
    var r2 = "Sí. Para poder utilizar los servicios de EMA, es necesario estar registrado."
    var r3 = "Para visualizar las zonas de Estacionamiento medido, se debe iniciar sesión.\n\nAl iniciar sesión, EMA mostrará un mapa ubicado en la pantalla principal que indicará con un punto su ubicación, los caminos a recorrer y las Zonas de Estacionamiento medido serán marcadas en los caminos en color azul."
    var r4 = "Al seleccionar una Zona de Estacionamiento Medido o estar ubicado en una, automáticamente en el mapa aparecerán íconos en forma de carritos de compras indicando los distintos Puntos de Venta disponibles para comprar códigos de estacionamiento."
    var r5 = "Selecciona uno de los puntos de venta que aparecen cerca de la Zona donde desea estacionarse, tocando el punto que indique el mismo en el mapa. Cuando lo seleccione, EMA le mostrará la información del punto, incluyendo: Nombre, Dirección, Días y Horarios de Atención al Público. Además, EMA le mostrará en el mapa el camino desde la Zona de Estacionamiento Medido hasta el Punto de Venta seleccionado."
    var r6 = "Si desea seleccionar otro punto de venta, simplemente toque en algún punto del mapa fuera de la pantalla de información del punto de venta seleccionado anteriormente."
    var r7 = "Una vez seleccionado el punto de venta, seleccione el botón ‘Estacionar’, ubicado debajo de la información del mismo. Una vez estacionado, EMA le brindará un Tiempo de Prórroga para que usted pueda estacionar su auto en la Zona de Estacionamiento Medido sin estar en infracción y pueda ir a comprar el código de estacionamiento. Si se dirige a “Estado de Vehículo” en el menú de Opciones, observará el Tiempo de Prróroga correspondiente, un botón de Introducir Código y otro de Cancelar."
    var r8 = "El Tiempo de Prrórroga es una ayuda para que el conductor pueda ir a comprar el código de estacionamiento, sin salir de la Zona de Estacionamiento Medido para no perder su lugar. Este Tiempo varía según la distancia entre Zona y Punto."
    var r9 = "Si excede el tiempo de prórroga otorgado por el sistema, el estado de su vehículo pasará a ‘Infracción’. Retírelo de la Zona de Estacionamiento Medido antes que un Agente de Tránsito pase a retirarlo."
    var r10 = "Una vez comprado el código, en Estado de Vehículo, seleccione el botón Introducir Código e ingrese el código proporcionado en el Punto de Venta. Automáticamente, el Estado de su Vehículo pasará a Estacionado y mostrará el tiempo restante de estacionamiento que le quede."
    var r11 = "No, únicamente podrá renovar el código una vez que expire el anterior."
    var r12 = "Una vez ingresado un Código de Estacionamiento, aparecerá el botón de Cancelar Estacionamiento para cancelar el tiempo restante y retirar su vehículo de la Zona de Estacionamiento Medido - ya que pasará a estar en Infracción."
    var r13 =  "En el menù opciones lo que se podrà realizar serà:\n\n1) Comprobar el Estado del Vehìculo Activo\n\n2) Configuraciòn para personalizaciòn de cuenta y modificaciones de datos.\n\n3) Consultar Ayuda y Preguntas frecuentes\n\n4) Visualizar los Términos y condiciones\n\n5) Estado de la Aplicación\n\n6) Contacto, para notificar cualquier problemática de la aplicación"
    $scope.respuestas=[r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11,r12,r13]
    var len=$scope.groups.lenght;
    for (var i = 0; i <=len; i++) {
        $scope.groups[i] = {
            name: i,
            respuesta: "",
            show: false
        };
        $scope.groups[i].respuesta = $scope.respuestas[i];
    }
    
    $scope.preguntas = [];
    $scope.respuestas = [];
         
         
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
        group.show = !group.show;
    };
    $scope.isGroupShown = function (group) {
        return group.show;
    };

})

.controller('EstadoServicioController', function ($scope) {

})
