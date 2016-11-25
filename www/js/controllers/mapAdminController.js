
angular.module('ema.controllers')

.controller('MapAdminController',function($scope, $cordovaGeolocation, $ionicPopup,$q,ZonaEstacionamientoServices, VendedorService ,UsuarioService){

    var coordinates = [],
     markersLocation= [],
     zonaEdit= {},
     vendedorusers = [],
     id = null ;
     var markerObject = {};
    // INICIALIZACION DEL MAPA
       
    var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 });
    $scope.map = new L.Map('map',
         {layers: [cloudmade], center: new L.LatLng(-34.789439,-58.523198),
         zoom: 16 });
        
        var editableLayers = new L.FeatureGroup();
        $scope.map.addLayer(editableLayers);
        drawnItems = new L.FeatureGroup();
        
        var zonesparking = viewZoneParking($scope.map);
        var puntosventa = viewPointsSales($scope.map);
          //var geocodeService = L.esri.Geocoding.geocodeService();
       

        L.control.scale({
            metric: true,
            imperial: false,
            updateWhenIdle: true
        }).addTo($scope.map);
        
       
        $scope.map.zoomControl.setPosition('bottomleft');

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
                    var polyline = L.polyline(jsonVar, { color: 'blue', weight: 8 });
                    polyline.id_bd = id;
                    editableLayers.addLayer(polyline).addTo(map);  
                     }
           })
        };


        function viewPointsSales(map) {
            VendedorService.getVendedores().then(function (result) {
                 var coordenadas = result.data.data           
            for (var x = 0; x < coordenadas.length; x++) {
              id = coordenadas[x].id;
              markersLocation.push(L.marker(coordenadas[x].location,{icon: new MyCustomMarker()},id));
              var markers = L.layerGroup(markersLocation);

              markers.addTo(map);
              drawnItems.addLayer(markers);
                } 
              })
            };    



        var drawControl = new L.Control.Draw(options);
        $scope.map.addControl(drawControl);

        $scope.map.on('draw:created', function (e) {

          var type = e.layerType,
              layer = e.layer;
          
          if (type === 'polyline') {
            var estacionamiento = {};
              latlngs = layer.getLatLngs();
              for (var i = 0; i < latlngs.length; i++) {
                  coordinates.push([latlngs[i].lat,latlngs[i].lng]);
                    }
                  
              // here you add it to a layer to display it in the map
              drawnItems.addLayer(layer);
              editableLayers.addLayer(layer); 
                              
              
              estacionamiento.coordinates = JSON.stringify(coordinates);
              ZonaEstacionamientoServices.addZonaEstacionamiento(estacionamiento).then(function () {
                coordinates = [];
              })
              };

          if (type === 'marker') {
              var Direccion = null;

              var lat = layer.getLatLng().lat,
              lng = layer.getLatLng().lng,
              address =  VendedorService.getDireccionByLatLng(lat,lng).then(function (result) {
                      Direccion = result.data;
                      var calle = Direccion.address.road,
                      localidad = Direccion.address.city,
                      partido = Direccion.address.state_district,
                      provincia = Direccion.address.state;
                                     
              markerObject.location = [lat,lng];
              var addressfromcoordinates = JSON.stringify(address);
              var coords = e.layer._latlng;
              var tempMarker = drawnItems.addLayer(e.layer);
              
              
              
              
             /* var popupContent = 
              '<ion-modal-view style="width: 100%; height: 100%;top: 10%;">'+
                '<ion-header-bar class="bar-calm">'+
                    '<h5 class="title">Nuevo Punto de Venta</h5>'+
                '</ion-header-bar>'+
                '<ion-content class="padding">'+
                    '<form name="usuarioForm" ng-submit=submit()>'+
                    '    <div class="list">    '+
                    '        <label class="item item-input">'+
                    '<span class="input-label">Cuit:</span>'+          
                    '         <input type="text" placeholder="CUIT" ng-model="markerObject.cuit">'+
                    '        </label>'+
                    '        <label class="item item-input">'+
                    '        <span class="input-label">Punto de Venta:</span>'+
                    '         <input type="text" placeholder="Nombre punto venta" ng-model="markerObject.business_name">'+
                    '        </label>'+
                    '        <label class="item item-input">'+
                    '        <span class="input-label">Direccion:</span>'+
                    '            <input type="text" placeholder="Direccion" disabled value='+calle+calle+'>'+
                    '        </label>'+
                        '</div>'+
                        '<div class="padding">'+
                            '<button class="button button-block button-balanced" >Guardar Punto de Venta</button>'+
                        '</div>'+
                    '</form>'+
                '</ion-content>'+
            '</ion-modal-view>';
                tempMarker.bindPopup(popupContent,{
                keepInView: true,
                closeButton: true
                }).openPopup()
            
            
            // here you add it to a layer to display it in the map
              

              

              var myPopup = L.popup()
              myPopup.setContent(popupContent);
              layer.bindPopup(myPopup).openPopup();
              console.log(myPopup.value);
              console.log(myPopup.content);
              */
              drawnItems.addLayer(layer);
              editableLayers.addLayer(layer); 

            

           
              VendedorService.addVendedor(markerObject).then(function () {});

           
              });





                  }

           });

        $scope.map.on('draw:edited', function (e) {
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


          
        $scope.map.on('draw:deleted', function (e) {
              var layers = e.layers;
              var type = e.layerType;
              layers.eachLayer(function (layer) {
                var object = {};
                if (layer instanceof L.Polyline) {
                        //OBTENNGO EL ID DE LA LINEA QUE DESEO ELIMINAR
                        zonaRemove= layer.id_bd;
                        //SE OBTIENE EL REGISTRO QUE SE CORRESPONDE CON EL ID QUE SE ELIMINA
                        ZonaEstacionamientoServices.getZonaEstacionamiento(zonaRemove).then(function (result) {
                             object = result.data;
                        //SE INGRESA EN EL PARAMETRO EL ID QUE SE ELIMINO PARA QUE LO ELIMINE DE BACKAND
                        ZonaEstacionamientoServices.deleteZonaEstacionamiento(object.id).then(function (result) {})                                
                             })
                      }
                     
              })
          });


    // SITUAR EN POSICION ACTUAL
    $scope.locate = function () {

        // LLAMADA ASINCRONICA
        var posicionActual = getActualLocation();

        posicionActual.then(function (actualPosition) {

            $scope.map.setView(actualPosition, 18);


        }, function (reason) {
            alert('Failed: ' + reason);
        });
    };


    function getActualLocation () {

        return $q(function (resolve, reject) {
            $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {

                resolve(new L.LatLng(position.coords.latitude, position.coords.longitude));

            }, function (err) {
                // error
                reject(err.message);
            });
        });
    }

    /*
    $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {

              $scope.map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 18);

          }, function(err) {
              // error
              $ionicPopup.alert({
                  title: 'Error',
                  template: err.message
                  });
              });
       };
       */
    })
    


