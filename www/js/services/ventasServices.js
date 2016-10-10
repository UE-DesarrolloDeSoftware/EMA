angular.module('ema.services')

.service('VentasService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'sales/';


      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getSales = function () {
          return $http.get(getUrl());
      };

      getSale = function (id) {
          return $http.get(getUrlForId(id));
      };



      return {
        getSales: getSales,
        getSale: getSale
      }
  })
