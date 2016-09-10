//angular.module('ema.Controllers.mapController')
//.controller('MapController',
//    [ '$scope',
//    '$cordovaGeolocation',
//    '$stateParams',
//    '$ionicModal',
//    '$ionicPopup',
//    function(
//     $scope,
//     $cordovaGeolocation,
//     $stateParams,
//     $ionicModal,
//     $ionicPopup,
//     LocationsService,
//     InstructionsService
//     ){
//
//      // INICIALIZACION DEL MAPA
//      $scope.$on("$stateChangeSuccess", function() {
//        $scope.map = {
//          defaults: {
//            tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
//            maxZoom: 18,
//            zoomControlPosition: 'bottomleft'
//          },
//          markers : {},
//          events: {
//            map: {
//              enable: ['context'],
//              logic: 'emit'
//            }
//          }
//        };
//
//        $scope.map.center  = {
//          lat : location.lat,
//          lng : location.lng,
//          zoom : 12
//        };
//
//        $scope.map.markers[locationKey] = {
//          lat:location.lat,
//          lng:location.lng,
//          message: location.name,
//          focus: true,
//          draggable: false
//        };
//      });
//
//      $scope.locate = function(){
//
//        $cordovaGeolocation
//          .getCurrentPosition()
//          .then(function (position) {
//            $scope.map.center.lat  = position.coords.latitude;
//            $scope.map.center.lng = position.coords.longitude;
//            $scope.map.center.zoom = 15;
//
//            $scope.map.markers.now = {
//              lat:position.coords.latitude,
//              lng:position.coords.longitude,
//              message: "You Are Here",
//              focus: true,
//              draggable: false
//            };
//
//          }, function(err) {
//            // error
//            console.log("Location error!");
//            console.log(err);
//          });
//
//      };
//
//    }]);