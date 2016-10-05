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

      getUsuario = function (id) {
          return $http.get(getUrlForId(id));
      };

      addUsuario = function (object) {
          return $http.post(getUrl(), object);
      };

      updateUsuario = function (id, object) {
          return $http.put(getUrlForId(id), object);
      };

      deleteUsuario = function (id) {
          return $http.delete(getUrlForId(id));
      };

      doLogin = function (login) {

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

      return {
        getUsuarios: getUsuarios,
        getUsuario: getUsuario,
        addUsuario: addUsuario,
        updateUsuario: updateUsuario,
        deleteUsuario: deleteUsuario,
        doLogin: doLogin,
        validateUserByEmail: validateUserByEmail
      }
  })
