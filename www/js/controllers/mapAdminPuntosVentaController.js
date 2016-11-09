angular.module('ema.controllers')

.controller('MapAdminPuntosVentaController',function($scope, $cordovaGeolocation, $ionicPopup,ZonaEstacionamientoServices ){

    var coordinates = [];
    
    // INICIALIZACION DEL MAPA
       
        var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
        map = new L.Map('map', {layers: [cloudmade], center: new L.LatLng(-34.789439,-58.523198),
         zoom: 16 });


        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);
                
        
        drawnItems = new L.FeatureGroup();
        
       

        L.control.scale({
            metric: true,
            imperial: false,
            updateWhenIdle: true
        }).addTo(map); 

        map.zoomControl.setPosition('bottomleft');


        var MyCustomMarker = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconAnchor: new L.Point(12, 12),
                iconSize: new L.Point(18, 18),
                iconUrl: 'img/menuAdmin/punto_de_venta.png'
                

            }
        });
        
        var options = {
            position: 'bottomleft',
            draw: {
                polyline: false,
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

        ZonaEstacionamientoServices.getZonasEstacionamiento().then(function (result) {
             var coordenadas = result.data.data
           
          
            for (var x = 0; x < result.data.data.length; x++) {
               var jsonVar = JSON.parse(result.data.data[x].coordinates);
               var polyline = L.polyline(jsonVar,{color :'blue',weight :10}).addTo(map);
             
               //console.log(map.fitBounds(polyline.getBounds()));
            
                }      
      
      });


        var drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);

        map.on('draw:created', function (e) {

          var type = e.layerType,
              layer = e.layer;
              
          if (type === 'marker') {
             
             //se asigna en la variable todas las zonas marcadas en formato geojson.
            var geojson = layer.toGeoJSON();            
            
            latlngs = layer.getLatLngs();
            
            for (var i = 0; i < latlngs.length; i++) {
                coordinates.push([latlngs[i].lat,latlngs[i].lng]);
                }

         
         // here you add it to a layer to display it in the map
          drawnItems.addLayer(layer);
          editableLayers.addLayer(layer);  

          for(var i in drawControl._toolbars){
            if(typeof drawControl._toolbars[i]._modes.edit != 'undefined'){
              editHandler = drawControl._toolbars[i]._modes.edit.handler;
                }   
            }   
          
            var estacionamiento = {};
            estacionamiento.coordinates = JSON.stringify(coordinates);
            ZonaEstacionamientoServices.addZonaEstacionamiento(estacionamiento).then(function () {
          
               })
          
              } 

                  
           });


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




