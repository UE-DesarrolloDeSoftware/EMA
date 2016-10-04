angular.module('ema.controllers', ['ionic', 'leaflet-directive', 'ngCordova', 'igTruncate'])

.controller('MainContoller', function ($scope, $state, $http, $ionicNavBarDelegate) {

        //$ionicNavBarDelegate.showBackButton(false);

        $scope.logOut = function(){
            window.localStorage.removeItem("usuario");
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
                    data: "from=" + "ue.ema.soporte@gmail.com" + "&to=" + recipient + "&subject=" + subject + "&text=" + message
                }
            ).then(function(success) {
                console.log("SUCCESS " + JSON.stringify(success));
            }, function(error) {
                console.log("ERROR " + JSON.stringify(error));
            });
        }
})