
angular.module('ema.controllers')

.controller('MapController',function($scope, $cordovaGeolocation, $ionicPopup,ZonaEstacionamientoServices ){

    $scope.zonaest= {};
    var coordinates = [];
    var coordenadas = [];
    // INICIALIZACION DEL MAPA
    //$scope.$on("$stateChangeSuccess", function() {
      // create a map in the "map" div, set the view to a given place and zoom
       
        var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
        map = new L.Map('map', {layers: [cloudmade], center: new L.LatLng(-34.789439,-58.523198),
         zoom: 18 });

        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);
        
       
      /*        latlngs = zona.getLatLngs();
              for (var i = 0; i < latlngs.length; i++) {
                   zonas.push([latlngs[i].lat, latlngs[i].lng])
                   }

                  console.log('ZONAS..................');    
                  console.log(latlngs);
                  console.log('ZONAS2');
                  console.log(zonas);
            });
*/
            
      
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
          

          var type = e.layerType,
              layer = e.layer;

               ZonaEstacionamientoServices.getZonasEstacionamiento().then(function (result) {

             var zona = result.data.data


             for (var i = 0; i < zona.length; i++) {
                coordenadas.push([zona[i].lat, zona[i].lng])
                console.log(coordenadas);
                }
             coordenadas = layer.setLatLngs(zona)
              
              })
          if (type === 'polyline') {
              // here you got the polygon points
              //coordinates = layer._latlngs;
              // here you can get it in geojson format
              var geojson = layer.toGeoJSON();
              L.drawLocal.draw.toolbar.buttons.polyline = 'dibuja una linea';
              
            
            latlngs = layer.getLatLngs();
            for (var i = 0; i < latlngs.length; i++) {
                coordinates.push([latlngs[i].lat, latlngs[i].lng])
                }

         
         // here you add it to a layer to display it in the map
           editableLayers.addLayer(layer);
            
          
            var estacionamiento = {};
            estacionamiento.coordinates = JSON.stringify(coordinates);
            ZonaEstacionamientoServices.addZonaEstacionamiento(estacionamiento).then(function () {
          
        })
          
      }      
    })
        
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
                  title: 'Error',
                  template: err.message
              });
          });

    };
})