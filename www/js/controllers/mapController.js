angular.module('ema.controllers')

.controller('MapController', function ($scope, $cordovaGeolocation, $ionicPopup, $q, ZonaEstacionamientoServices, VendedorService) {
    // Codigo que se ejecuta luego de cargar la pagina
    $scope.$on("$stateChangeSuccess", function () {


    });

    // Distancia de tolerancia entre un punto y una polyline, para determinar que esta sobre la linea
    var distanciaAlPunto = 25;

    $scope.mostrarBtnEsctacionar = true;
    $scope.mostrarBtnCancelar = false;
    $scope.mostrarBtnCancelarPtoVenta = false;

    // SITUAR EN POSICION ACTUAL
    $scope.locate = function () {

        // LLAMADA ASINCRONICA
        var promise3 = getActualLocation();

        promise3.then(function (actualPosition) {

            $scope.map.setView(actualPosition, 18);

            addMarkerAuto($scope.map, actualPosition);

        }, function (reason) {
            alert('Failed: ' + reason);
        });
    };

    // CREACION DEL MAPA
    var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    cloudmade = new L.TileLayer(cloudmadeUrl, { maxZoom: 18 });

    $scope.map = new L.Map('map', { layers: [cloudmade], zoom: 18 });

    $scope.locate();

    $scope.showLoading();
    // LLAMADA ASINCRONICA
    addLinesFromDb($scope.map).then(function (polylines) {

        $scope.hideLoading();

        //Evento click del mapa que evalua la situacion de estacionamiento
        $scope.map.on('click',
            function (e) {

                if (!isPointOnLine($scope.map, polylines, e.latlng)) {
                    $ionicPopup.alert({
                        title: 'Atencion',
                        template: "Estacionamiento libre"
                    });
                }
            }
        );

        // Funcion de Estacionar
        $scope.estacionar = function () {

            getActualLocation().then(function (actualPosition) {

                if (isPointOnLine($scope.map, polylines, actualPosition)) {
                    // Estacionamiento medido

                    $scope.showLoading();

                    // Filtro por puntos de venta cernanos a 1km de la posicion actual
                    var filter = { "q": {"location" : {"$withinKilometers": [[actualPosition.lat, actualPosition.lng], 1]}}}

                    // Obtener puntos de venta cercanos a la posicion actual
                    VendedorService.getVendedoresFilter(filter).then(function (result) {
                     
                        // Crea los markers de puntos de venta y setea el id del groupLayer
                        $scope.layerPtosVentaId = addMarkersPtosVenta($scope.map, result.data.data);

                        $scope.mostrarBtnEsctacionar = false;
                        $scope.mostrarBtnCancelar = true;

                        $scope.hideLoading();
                    });
                }
                else // Estacionamiento libre
                {    
                    $ionicPopup.alert({
                        title: 'Atencion',
                        template: "Estacionamiento libre"
                    });
                }
            });
        }

        // Funcion de Cancelar estacionamiento, elimina los markers de puntos de venta
        $scope.cancelarEstacionamiento = function (layerId) {
            $scope.map.removeLayer($scope.map._layers[layerId]);

            $scope.mostrarBtnEsctacionar = true;
            $scope.mostrarBtnCancelar = false;
        }

    }, function (reason) {
        alert('Failed: ' + reason);
    });


    function mostrarRuta (lat, lng) {
    
        getActualLocation().then(function (actualPosition) {

            var waypoints = [actualPosition, L.latLng(lat, lng)];

            $scope.routingControl = L.Routing.control({
                plan: L.Routing.plan(waypoints, {
                    createMarker: function (i, wp) {
                        // Crea marker de punto de venta solo para la segunda coordenada(destino)
                        if (i == 1) {
                            return L.marker(wp.latLng, {
                                draggable: true,
                                icon: L.icon({ iconUrl: 'img/pto_venta.png', iconSize: [40, 40], iconAnchor: [20, 20] })
                            });
                        } else { return false; }
                    }
                })
            });

            $scope.routingControl.addTo($scope.map);

            // Ocultar los puntos de venta marcados en el mapa, dejando solo la ruta hacia el punto elegido
            $scope.map._layers[$scope.layerPtosVentaId].eachLayer(function (layer) {
                layer._icon.style.display = 'none';
                if (layer._popup._isOpen)
                    $scope.map.closePopup(layer._popup);
            });

            $scope.mostrarBtnCancelar = false;
            $scope.mostrarBtnCancelarPtoVenta = true;
        });
    }

    $scope.cancelarPuntoVenta = function () {
        $scope.map._layers[$scope.layerPtosVentaId].eachLayer(function (layer) {
            layer._icon.style.display = 'block';
        });

        $scope.map.removeControl($scope.routingControl);
        //$scope.routingControl.removeFrom($scope.map);

        $scope.mostrarBtnCancelar = true;
        $scope.mostrarBtnCancelarPtoVenta = false;
    }

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

    function addMarkerAuto(map, latLng) {

        var icon = L.icon({
            iconUrl: 'img/auto.gif',
            iconSize: [45, 45],
            iconAnchor: [40, 40] // Pixeles que marcan el punto en el mapa     
        });

        var marker = L.marker(latLng,
        {
            draggable: false,
            icon: icon
        });

        marker.addTo(map);
        return marker;
    }

    function addMarkersPtosVenta(map, ptosVenta) {

        var markersArray = [];
        var icon = L.icon({
            iconUrl: 'img/pto_venta.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20] // Pixeles que marcan el punto en el mapa 
        });

        for (var x = 0; x < ptosVenta.length; x++) {

            // Crear HTML PopUp
            var div = document.createElement("div");
            div.innerHTML = String.format("<div>{0}</div>", ptosVenta[x].business_name);
            var boton = document.createElement("button");
            boton.textContent = "Mostrar ruta";
            boton.className = "button button-assertive";
            boton.style.margin = "10px";

            // VER COMO HACER EN EL EVENTO CLICK PARA MANDAR DATOS DEL PUNTO DE VENTA
            var idPtoVenta = ptosVenta[x].id;
            boton.addEventListener('click', function(lat, lng) {

                // return the actual event handler function
                return function() {
                    mostrarRuta(lat, lng);
                };

            }(ptosVenta[x].location[0], ptosVenta[x].location[1]), false); 

            div.appendChild(boton);

            var marker = L.marker(new L.LatLng(ptosVenta[x].location[0], ptosVenta[x].location[1]), { draggable: false, icon: icon })
            marker.bindPopup(div, { 'maxWidth': '500', 'offset': [-20, -20] });

            markersArray.push(marker);
        }

        var markers = L.layerGroup(markersArray);
        // Add all polylines to the map
        markers.addTo(map);

        return markers._leaflet_id;
    }

    function isPointOnLine(map, polylines, latlng) {

        var polylinesCercanos = L.GeometryUtil.nClosestLayers(map, [polylines], latlng);

        // Recorro y busco la menor distancia a la ubicacion actual
        var menorDistancia = Number.MAX_VALUE;
        for (i in polylinesCercanos) {
            if (polylinesCercanos[i].distance < menorDistancia) {
                menorDistancia = polylinesCercanos[i].distance;
            }
        }

        if (menorDistancia < distanciaAlPunto) {
            return true;
        }
        else {
            return false;
        }
    }    
})
