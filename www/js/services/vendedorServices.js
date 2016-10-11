angular.module('ema.services')

.service('VendedorService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'vendor/';


      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getVendedores = function () {
          return $http.get(getUrl());
      };

      getVendedor = function (id) {
          return $http.get(getUrlForId(id));
      };

      getVendedoresFilter = function (filter) {
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

      addVendedor = function (object) {

          var venta = Object.assign({}, object);
          
          return $http.post(getUrl(), venta);
      };

      getVendedorByIdUsuario = function (idUsuario) {

        return $http({
              method:"GET",
              url:Backand.getApiUrl() + '/1/query/data/getVendedorByIdUsuario',
              params:{
                parameters: {
                  idUsuario: idUsuario
                }
              }
        });
    };

      return {
        getVendedores: getVendedores,
        getVendedor: getVendedor,
        getVendedoresFilter: getVendedoresFilter,
        addVendedor: addVendedor,
        getVendedorByIdUsuario: getVendedorByIdUsuario
      }
  })
