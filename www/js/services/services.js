'use strict';

/* Services */

/*
 http://docs.angularjs.org/api/ngResource.$resource
 Default ngResources are defined as
 'get':    {method:'GET'},
 'save':   {method:'POST'},
 'query':  {method:'GET', isArray:true},
 'remove': {method:'DELETE'},
 'delete': {method:'DELETE'}
 */

var services = angular.module('ema.services.services', []);

/* USUARIO
Lo dejo para consultar.
services.factory('UsuarioFactory', function ($resource) {
	return $resource('/tracker/rest/usuario/:id', {}, {
        show: { method: 'GET' },
        remove: { method: 'DELETE' },
        update: { method: 'PUT' },
        create: { method: 'POST' },
        query: { method: 'GET', params: {}, isArray: true },
    });
});
*/
