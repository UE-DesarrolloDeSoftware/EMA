angular.module('ema.controllers')

.controller('MapController', function ($scope, $cordovaGeolocation, $ionicPopup, $q, ZonaEstacionamientoServices) {
        
    $scope.$on("$stateChangeSuccess", function () {

        
    });

    // LLAMADA ASINCRONICA
    var promise = getActualLocation();

    promise.then(function (actualPosition) {

        // CREACION DEL MAPA
        var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 }),
        map = new L.Map('map', { layers: [cloudmade], center: actualPosition, zoom: 18 });

        addMarker(map, actualPosition);



        // SITUAR EN POSICION ACTUAL
        $scope.locate = function () {

            //$cordovaGeolocation
            //    .getCurrentPosition()
            //    .then(function (position) {

            //        map.setView({ lat: position.coords.latitude, lng: position.coords.longitude }, 18);

            //        var myIcon = L.icon({
            //            iconUrl: '/img/auto.png',
            //            iconSize: [40, 40],
            //            iconAnchor: [40, 40], // Pixeles que marcan el punto en el mapa
            //            //popupAnchor: [-3, -76],
            //            //shadowUrl: '/img/auto.png',
            //            //shadowSize: [68, 95],
            //            //shadowAnchor: [22, 94]
            //        });

            //        var marker = L.marker([position.coords.latitude, position.coords.longitude],
            //        {
            //            draggable: false,
            //            icon: myIcon
            //        });

            //        marker.addTo(map);
            //        marker.bindPopup('Estas aqui').openPopup();

            //    }, function (err) {
            //        // error
            //        $ionicPopup.alert({
            //            title: 'Prueba',
            //            template: err.message
            //        });
            //    });


            // LLAMADA ASINCRONICA
            var promise3 = getActualLocation();

            promise3.then(function (actualPosition) {

                map.setView(actualPosition, 18);

                addMarker(map, actualPosition);

            }, function (reason) {
                alert('Failed: ' + reason);
            });
        };

        $scope.clearMap = function () {

            clearMap(map);
        }

        // LLAMADA ASINCRONICA
        var promise2 = addLinesFromDb(map);

        promise2.then(function (polylines) {

            //Evento click del mapa
            map.on('click',
                function (e) {

                    var result = L.GeometryUtil.nClosestLayers(map, [polylines], e.latlng);

                    // Recorrer y buscar la menor distancia
                    if (result[0].distance < 20) {
                        addMarker(map, e.latlng).bindPopup('Estacionamiento medido').openPopup();
                    } else {

                        addMarker(map, e.latlng).bindPopup('Estacionamiento libre').openPopup();
                    }                    
                }
            );

            // Funcion de Estacionar
            $scope.estacionar = function () {

                var promise = getActualLocation();

                promise.then(function (actualPosition) {

                    var result = L.GeometryUtil.nClosestLayers(map, [polylines], actualPosition);

                    // Recorrer y buscar la menor distancia
                    if (result[0].distance < 20) {
                        $ionicPopup.alert({
                            title: 'Atencion',
                            template: "Estacionamiento medido"
                        });
                    }
                });
            }

        }, function (reason) {
            alert('Failed: ' + reason);
        });

    }, function (reason) {
        alert('Failed: ' + reason);
    });

    function addLinesFromDb(map) {

        return $q(function (resolve, reject) {

            //var coordenadas = [];

            //coordenadas.push({ lat: -34.78872170211281, lng: -58.524470329284675});
            //coordenadas.push({ lat: -34.789171071087175, lng:-58.52483510971069 });
            //coordenadas.push({ lat: -34.79104782092408, lng: -58.52540373802185});
            //coordenadas.push({ lat: -34.7924928010859, lng: -58.52628350257874});
            //coordenadas.push({ lat: -34.79293333878163, lng:-58.526444435119636 });
            //coordenadas.push({ lat: -34.79348841292727, lng: -58.52620840072632});
            //coordenadas.push({ lat: -34.7947571398005, lng: -58.52495312690734 });

            //var polyline = L.polyline(coordenadas, { color: 'red', weight: 10 });

            //var jsonVar = JSON.parse("[[-34.78918869335001,-58.52478682994842],[-34.78950148788859,-58.52241039276122]]");
            //var polyline2 = L.polyline(jsonVar, { color: 'red', weight: 10 });

            //var polylineArray = [
            //      polyline,
            //      polyline2
            //];
            //var polylines = L.layerGroup(polylineArray);
            //// Add all polylines to the map
            //polylines.addTo(map);

            var polylineArray = [];

            ZonaEstacionamientoServices.getZonasEstacionamiento().then(function (result) {

                for (var x = 0; x < result.data.data.length; x++) {

                    var jsonVar = JSON.parse(result.data.data[x].coordinates);
                    polylineArray.push(L.polyline(jsonVar, { color: 'blue', weight: 10 }));
                }

                var polylines = L.layerGroup(polylineArray);
                // Add all polylines to the map
                polylines.addTo(map);

                resolve(polylines);
            });
        });
    }

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
    
})

// basado en https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function isMarkerInsidePolygon(marker, poly) {
    var polyPoints = poly.getLatLngs();
    //var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
    var x = marker.lat, y = marker.lng;

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function clearMap(m) {
    for (i in m._layers) {
        if (m._layers[i]._path != undefined) {
            try {
                m.removeLayer(m._layers[i]);
            }
            catch (e) {
                console.log("problem with " + e + m._layers[i]);
            }
        }
    }
}

function addMarker(mapObject, latLng) {
    var myIcon = L.icon({
        iconUrl: '/img/auto.png',
        iconSize: [40, 40],
        iconAnchor: [40, 40] // Pixeles que marcan el punto en el mapa
        //popupAnchor: [-3, -76],
        //shadowUrl: '/img/auto.png',
        //shadowSize: [68, 95],
        //shadowAnchor: [22, 94]        
    });

    var marker = L.marker(latLng,
    {
        draggable: false,
        icon: myIcon
    });

    marker.addTo(mapObject);
    return marker;
}

