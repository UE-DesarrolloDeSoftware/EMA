angular.module('ema.services')

.service('ZonaEstacionamientoServices', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'paid_parking_zones/';
      

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

      addZonaEstacionamiento = function (zonaest) {
          
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
