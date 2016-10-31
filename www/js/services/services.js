angular.module('ema.services', [])

.service('UsuarioService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'usuarios/';
      

      function getUrl() {
          return Backand.getApiUrl() + baseUrl + objectName;
      }

      function getUrlForId(id) {
          return getUrl() + id;
      }

      getUsuarios = function () {
          return $http.get(getUrl());
      };

      getUsuariosPage = function (pageSize, pageNumber) {
          return $http({
              method: 'GET',
              url: getUrl(),
              params: {
                  pageSize: pageSize,
                  pageNumber: pageNumber
              }
          });
      };

      getUsuario = function (id) {
          return $http.get(getUrlForId(id));
      };

      addUsuario = function (object) {

          var usuario = Object.assign({}, object);
          // Encriptar password
          usuario.password = hex_md5(usuario.password);

          return $http.post(getUrl(), usuario);
      };

      updateUsuario = function (id, object) {
          return $http.put(getUrlForId(id), object);
      };

      deleteUsuario = function (id) {
          return $http.delete(getUrlForId(id));
      };

      doLogin = function (login) {
            // Encriptar password
            var passwordMD5 = hex_md5(login.password);

			return $http({
							method:"GET",
							url:Backand.getApiUrl() + '/1/query/data/getUserByEmailAndPass',
							params:{
								parameters: {
								  email: login.email,
								  pass: passwordMD5
								}
							}
						});
	  };

      validateUserByEmail = function (login) {
			return $http({
                method:"GET",
                url:Backand.getApiUrl() + '/1/query/data/validateUserByEmail',
                params:{
                    parameters: {
                      email: login.email
                    }

                }
            });
      };

      verificarUsuario = function (scope) {
          return $http({
              method: "GET",
              url: Backand.getApiUrl() + '/1/query/data/verificacionEmail',
              params: {
                  parameters: {
                      email: scope.email,
                      verificationHash: scope.verificationHash
                  }

              }
          });
      };


      return {
        getUsuarios: getUsuarios,
        getUsuariosPage: getUsuariosPage,
        getUsuario: getUsuario,
        addUsuario: addUsuario,
        updateUsuario: updateUsuario,
        deleteUsuario: deleteUsuario,
        doLogin: doLogin,
        validateUserByEmail: validateUserByEmail,
        verificarUsuario: verificarUsuario
      }
  })

.service('ConfigurationsService', function ($http, Backand){
    var baseUrl = '/1/objects/';
    var objectName = 'configurations/';
      

    function getUrl() {
        return Backand.getApiUrl() + baseUrl + objectName;
    }

    function getUrlForId(id) {
        return getUrl() + id;
    }

    getConfigurations = function () {
        return $http.get(getUrl());
    };

    getConfiguration = function (id) {
        return $http.get(getUrlForId(id));
    };

    getConfigurationByKey = function (key) {
        return $http({
            method: "GET",
            url: getUrl(),
            params: {
                filter: {
                    fieldName: "key",
                    operator: "equals",
                    value: key
                }

            }
        });
    };

    return {
        getConfigurations: getConfigurations,
        getConfiguration: getConfiguration,
        getConfigurationByKey: getConfigurationByKey
    }
})