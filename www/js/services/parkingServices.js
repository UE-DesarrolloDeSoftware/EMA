angular.module('ema.services')

.service('ParkingService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'parking/';


      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getParkings = function () {
          return $http.get(getUrl());
      };

      getParking = function (id) {
          return $http.get(getUrlForId(id));
      };

      getParkingsFilter = function (filter) {
          return $http({
              method: "GET",
              url: getUrl(),
              params: {
                  filter: 
                    filter

                    //{
                    //    "q": {
                    //        "paid_date": { "$gt": "2016-01-01T03:00:00" }
                    //    }
                    //}
              }
          });
      };

      addParking = function (object) {
          
          return $http.post(getUrl(), object);
      };

      getParkingByPatente = function (patente) {

        return $http({
              method:"GET",
              url:Backand.getApiUrl() + '/1/query/data/getParkingByPatente',
              params:{
                parameters: {
                  patente: patente
                }
              }
        });
    };

      return {
        getParkings: getParkings,
        getParking: getParking,
        getParkingsFilter: getParkingsFilter,
        addParking: addParking,
        getParkingByPatente: getParkingByPatente
      }
  })
