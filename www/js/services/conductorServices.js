angular.module('ema.services')

.service('ConductorService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'drivers/';


      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getConductores = function () {
          return $http.get(getUrl());
      };

      getConductor = function (id) {
          return $http.get(getUrlForId(id));
      };

      getConductoresFilter = function (filter) {
          return $http({
              method: "GET",
              url: getUrl(),
              params: {
                  filter: 
                    filter
              }
          });
      };

      addConductor = function (object) {
          
          return $http.post(getUrl(), object);
      };

      updateConductor = function (id, object) {
          return $http.put(getUrlForId(id), object);
      };

      getConductorByIdUsuario = function (idUsuario) {

        return $http({
              method:"GET",
              url: Backand.getApiUrl() + '/1/query/data/getConductorByIdUsuario',
              params:{
                parameters: {
                  idUsuario: idUsuario
                }
              }
        });
    };

    return {
        getConductores: getConductores,
        getConductor: getConductor,
        getConductoresFilter: getConductoresFilter,
        addConductor: addConductor,
        updateConductor: updateConductor,
        getConductorByIdUsuario: getConductorByIdUsuario
    }
})
