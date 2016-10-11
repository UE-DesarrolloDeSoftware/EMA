angular.module('ema.services', [])

.service('ZonaEstacionamientoServices', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = '/1/objects/paid_parking_zones/';
      

      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getZonasEstacionamiento = function () {
          return $http.get(getUrl());
      };

      getZonaEstacionamiento = function (id) {
          return $http.get(getUrlForId(id));
      };

      addZonaEstacionamiento = function (object) {

          var zonaest = Object.assign({}, object);
          return $http.post(getUrl(), zonaest);
      };

      updateZonaEstacionamiento = function (id, object) {
          return $http.put(getUrlForId(id), object);
      };

      deleteZonaEstacionamiento = function (id) {
          return $http.delete(getUrlForId(id));
      };


      return {
        getZonasEstacionamiento: getZonasEstacionamiento,
        getZonaEstacionamiento: getZonaEstacionamiento,
        addZonaEstacionamiento: addZonaEstacionamiento,
        updateZonaEstacionamiento: updateZonaEstacionamiento,
        deleteZonaEstacionamiento: deleteZonaEstacionamiento
      }
  })