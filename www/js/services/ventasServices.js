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

      getSalesFilter = function (filter) {
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
      addVenta = function (venta) {          
          return $http.post(getUrl(), venta);
      };
      

      deleteVenta = function (id) {
          return $http.delete(getUrlForId(id));
      };

      getSalesByParkingId = function (parking_id) {

        return $http({
              method:"GET",
              url:Backand.getApiUrl() + '/1/query/data/getSalesByParkingId',
              params:{
                parameters: {
                  parking_id: parking_id
                }
              }
        });
    };




      return {
        getSales: getSales,
        getSale: getSale,
        getSalesFilter: getSalesFilter,
        addVenta: addVenta,
        deleteVenta: deleteVenta,
        getSalesByParkingId: getSalesByParkingId
      }
  })
