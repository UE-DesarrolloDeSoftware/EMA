angular.module('ema.services')

.service('VendedorService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'vendors/';


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
              }
          });
      };

      addVendedor = function (object) {
          
          return $http.post(getUrl(), object);
      };
      updateVendedor = function (id, object) {
          return $http.put(getUrlForId(id), object);
      };

      deleteVendedor = function (id) {
          return $http.delete(getUrlForId(id));
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
        updateVendedor:updateVendedor,
        deleteVendedor:deleteVendedor,
        getVendedorByIdUsuario: getVendedorByIdUsuario
    }
})
