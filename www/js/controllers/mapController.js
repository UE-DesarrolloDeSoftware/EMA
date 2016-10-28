
angular.module('ema.controllers')

.controller('MapController',function($scope, $cordovaGeolocation, $ionicPopup,ZonaEstacionamientoServices ){

    $scope.zonaest= {};

    // INICIALIZACION DEL MAPA
    //$scope.$on("$stateChangeSuccess", function() {
      // create a map in the "map" div, set the view to a given place and zoom
       
        var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
        map = new L.Map('map', {layers: [cloudmade], center: new L.LatLng(-34.789439,-58.523198),
         zoom: 18 });
        
        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);
        
        var MyCustomMarker = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconAnchor: new L.Point(12, 12),
                iconSize: new L.Point(18, 18),
                iconUrl: 'img/auto.png'
                

            }
        });
        
        var options = {
            position: 'bottomleft',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#3333ff',
                        weight: 12
                    }
                },
                polygon: false,
                circle: false, // Turns off this drawing tool
                rectangle:false,
                marker: {
                    icon: new MyCustomMarker()
                }
            },
            edit: {

                featureGroup: editableLayers, //REQUIRED!!
                remove: true
                
            }

        };
        
        var drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
          var coordinates = [];



          var type = e.layerType,
              layer = e.layer;

          if (type === 'polyline') {
              // here you got the polygon points
              //coordinates = layer._latlngs;
              
              //console.log(coordenadas);

              // here you can get it in geojson format
              var geojson = layer.toGeoJSON();


            
            latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                coordinates.push([latlngs[i].lat, latlngs[i].lng])
        }

         
         // here you add it to a layer to display it in the map
           editableLayers.addLayer(layer);
            
          //console.log(zonaest);
           // console.log(coordinates);
          var estacionamiento = {};
          //estacionamiento.coordinates = coordenadas;
          estacionamiento.coordinates = JSON.stringify(coordinates);

        ZonaEstacionamientoServices.addZonaEstacionamiento(estacionamiento).then(function () {
          //console.log(estacionamiento);  
           
        })
        
        }      
        })
/*
    $scope.addZonaEstacionamiento = function () {
        ZonaEstacionamientoServices.addZonaEstacionamiento($scope.zonaest).then(function () {
            
  

          
        })
    };

*/


       // map.on('draw:created', function (e) {
       //     var type = e.layerType,
       //         layer = e.layer;
            
       // }
   //         if (type === 'marker') {
   //             layer.bindPopup('A popup!');
   //         }
        
            
   //         var shape = layer.toGeoJSON()
   //         var prueba = layer.toString()
   //         
   //         //var shape_for_db = JSON.stringify(shape);
   //         var shape_for_db = JSON.stringify(shape);

            
            //var data = editableLayers.toGeoJSON();
            //var convertData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
         //   console.log(shape);
           // console.log(prueba);
           // console.log(shape_for_db);

       // });
        
       /* $scope.map = {
            defaults: {
                tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                drawControl: true,
                maxZoom: 18,
                zoomControlPosition: 'bottomleft'
            },
            draw: {
                polyline: false,
                polygon: false,
                circle: false,
                marker: true
            },
          
d
            markers : {

            },
            events: {
                map: {
                    enable: ['context'],
                    logic: 'emit'
                }
            }
        };
*/

//        $scope.map.center  = {
//
  //          lat : -34.789439,
  //          lng : -58.523198,
  //          zoom : 18
  //      };
//
 //       $scope.map.markers[0] = {
 //           lat : -34.789439,
 //           lng : -58.523198,
 //           message: 'Universidad de Ezeiza',
 //           focus: true,
 //           draggable: true
 //       };

   // });



    // SITUAR EN POSICION ACTUAL
    $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

              $scope.map.center.lat = position.coords.latitude;
              $scope.map.center.lng = position.coords.longitude;
              $scope.map.center.zoom = 18;

              $scope.map.markers.now = {
                  lat:position.coords.latitude,
                  lng:position.coords.longitude,
                  message: "Estas Aqui!",
                  focus: true,
                  draggable: false
              };

          }, function(err) {
              // error
              $ionicPopup.alert({
                  title: 'Prueba',
                  template: err.message
              });
          });

    };
})