<<<<<<< HEAD
angular.module('ema.services', [])
=======

angular.module('ema.services.services', [])
>>>>>>> 9d24726eb7bbee20bd8d7a8dab735b3acac420d4

.service('UsuarioService', function ($http, Backand){
      var baseUrl = '/1/objects/';
      var objectName = 'usuarios/'
      

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
			return $http({
							method:"GET",
							url:Backand.getApiUrl() + '/1/query/data/getUserByEmailAndPass',
							params:{
								parameters: {
								  email: login.email,
								  pass: login.password
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
      $state.go('login');
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
