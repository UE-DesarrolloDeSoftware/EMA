angular.module('ema.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

.controller('MainContoller', function ($scope, $state) {

        $scope.logOut = function(){
            window.localStorage.removeItem("usuario");
            $state.go('login');

        };

})