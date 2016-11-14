
angular.module('ema.controllers')

.controller('MapAdminController',function($scope, $cordovaGeolocation, $ionicPopup,ZonaEstacionamientoServices, VendedorService ){

    var coordinates = [],
     markersLocation= [],
     zonaEdit= {},
     id = null ;
    // INICIALIZACION DEL MAPA
       
        var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18}),
        map = new L.Map('map',
         {layers: [cloudmade], center: new L.LatLng(-34.789439,-58.523198),
         zoom: 16 });
        
        var editableLayers = new L.FeatureGroup();
        map.addLayer(editableLayers);
        drawnItems = new L.FeatureGroup();
        
        var zonesparking = viewZoneParking(map);
        var puntosventa = viewPointsSales(map);
        //var geocodeService = L.esri.Geocoding.geocodeService();
       

        L.control.scale({
            metric: true,
            imperial: false,
            updateWhenIdle: true
        }).addTo(map); 
        
       
        map.zoomControl.setPosition('bottomleft');

        var MyCustomMarker = L.Icon.extend({
            options: {
                shadowUrl: null,
                iconAnchor: new L.Point(24, 24),
                iconSize: new L.Point(38, 38),
                iconUrl: 'img/menuAdmin/pto_venta.png'
            }
        });
        
        var options = {
            position: 'bottomleft',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#3333ff',
                        message: 'marca una zona de estacionamiento medido',
                        weight: 12,
                        id_bd:id 
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


        function viewZoneParking(map) {
             ZonaEstacionamientoServices.getZonasEstacionamiento().then(function (result) {
                  var coordenadas = result.data.data
                 for (var x = 0; x < coordenadas.length; x++) {
                    id = coordenadas[x].id;
                    var jsonVar = JSON.parse(coordenadas[x].coordinates,id);
                    var polyline = L.polyline(jsonVar, { color: 'blue', weight: 10 });
                    polyline.id_bd = id;
                    editableLayers.addLayer(polyline).addTo(map);  
                     }
           })
        };


        function viewPointsSales(map) {
            VendedorService.getVendedores().then(function (result) {
                 var coordenadas = result.data.data           
            for (var x = 0; x < coordenadas.length; x++) {
              markersLocation.push(L.marker(coordenadas[x].location,{icon: new MyCustomMarker()}));
              var markers = L.layerGroup(markersLocation);
              markers.addTo(map);
                } 
              })
            };


        var drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);

        map.on('draw:created', function (e) {

          var type = e.layerType,
              layer = e.layer;
          
          if (type === 'polyline') {
              latlngs = layer.getLatLngs();
              for (var i = 0; i < latlngs.length; i++) {
                  coordinates.push([latlngs[i].lat,latlngs[i].lng]);
                    }
                  
              // here you add it to a layer to display it in the map
              drawnItems.addLayer(layer);
              editableLayers.addLayer(layer); 
                              
              var estacionamiento = {};
              estacionamiento.coordinates = JSON.stringify(coordinates);
              ZonaEstacionamientoServices.addZonaEstacionamiento(estacionamiento).then(function () {})
              };

          if (type === 'marker') {

              var lat = layer.getLatLng().lat,
              lng = layer.getLatLng().lng;
              

            
            
            // here you add it to a layer to display it in the map
              drawnItems.addLayer(layer);
              editableLayers.addLayer(layer);  
                
              var markerObject = {};
              markerObject.location = [lat,lng];
              var myPopup = L.popup()
              var popupContent = '<ion-modal-view style="width: 40%; height: 60%;top: 5%;">    <ion-header-bar class="bar-calm">        <h6 class="title">Nuevo Punto de Venta</h6>                </div>    </ion-header-bar>    <ion-content class="padding">        <form name="puntoVentaForm" ng-submit="addVendedor()">            <div class="list">                    <label class="item item-input">                    <input type="number" placeholder="CUIT" ng-model="markerObject.cuit" >                </label>                <label class="item item-input">                    <input type="number" placeholder="ID USUARIO" ng-model="markerObject.usuario_id" >                </label><label> <input type="number" placeholder="ID USUARIO"  disabled> </label>                <label class="item item-input">                    <input type="text" placeholder="business Name" ng-model="markerObject.business_name" >                </label>                                                </div>            <div class="padding">                <button class="button button-block button-balanced" ng-disabled="puntoVentaForm.$invalid">Save Punto Venta</button>            </div>        </form>   </ion-content></ion-modal-view>';
              myPopup.setContent(popupContent);
              layer.bindPopup(myPopup).openPopup();

              VendedorService.addVendedor(markerObject).then(function () {})
               }    
          
           // drawnItems.addLayer(e.target);    

                  
           });

          map.on('draw:edited', function (e) {
              var layers = e.layers;
              layers.eachLayer(function (layer) {
                    if (layer instanceof L.Polyline) {
                        console.log('im an instance of L polyline');
                        var object = {};
                        //OBTENNGO EL ID DE LA LINEA QUE DESEO EDITAR
                        zonaEdit= layer.id_bd;
                        latlngs = layer.getLatLngs();
                                //AGREGO LAS COORDENADAS QUE SON MODIFICADAS A UNA VARIABLE DE TIPO ARRAY
                                for (var i = 0; i < latlngs.length; i++){
                                    coordinates.push([latlngs[i].lat,latlngs[i].lng]);
                                      };     
                                      
                                var zonaactualizada = JSON.stringify(coordinates);
                                //SE OBTIENE EL REGISTRO QUE SE CORRESPONDE CON EL ID QUE SE MODIFICO
                                ZonaEstacionamientoServices.getZonaEstacionamiento(zonaEdit).then(function (result) {
                                     object = result.data;
                                
                                var estacionamiento = {};
                                //SE ACTUALIZA LA VARIABLE CON EL OBJETO ESTACIONAMIENTO EL CUAL SE VA A PERSISTIR EN BACKAND
                                estacionamiento.coordinates = zonaactualizada;
                                editableLayers.addLayer(layer);
                                drawnItems.addLayer(layer);
                                //OBJECT.ID HACE REFERENCIA AL ID QUE SE QUIERE EDITAR Y SE VA A PERSISTIR , ADEMAS DEL OBJETO QUE SE VA A GUARDAR "ESTACIONAMIENTO"
                                ZonaEstacionamientoServices.updateZonaEstacionamiento(object.id,estacionamiento).then(function (result) {})
                                
                             })
                                }  
                          })        
                      
                      

                
          });


          
          map.on('draw:deleted', function (e) {
              var layers = e.layers;
              var type = e.layerType;
              layers.eachLayer(function (layer) {
                        var object = {};
                        //OBTENNGO EL ID DE LA LINEA QUE DESEO ELIMINAR
                        zonaRemove= layer.id_bd;
                        //SE OBTIENE EL REGISTRO QUE SE CORRESPONDE CON EL ID QUE SE ELIMINA
                        ZonaEstacionamientoServices.getZonaEstacionamiento(zonaRemove).then(function (result) {
                             object = result.data;
                        //SE INGRESA EN EL PARAMETRO EL ID QUE SE ELIMINO PARA QUE LO ELIMINE DE BACKAND
                        ZonaEstacionamientoServices.deleteZonaEstacionamiento(object.id).then(function (result) {})                                
                             })
              })
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



