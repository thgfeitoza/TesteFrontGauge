(function() {
  'use strict';

  angular
    .module('main.factory', [])
    .factory('MainFactory', MainFactory);

  /** @ngInject */
  function MainFactory($http) {
    var _factory = function (data) {
      angular.extend(this, data);
    };

    _factory.getBrands = function(){
      return $http.get('assets/json/brands.json')
        .then(function(response){
          return response.data;
        });
    };

    _factory.getInteractions = function(){
      return $http.get('assets/json/interactions.json')
        .then(function(response){
          return response.data;
        });
    };

    _factory.getUsers = function(){
      return $http.get('assets/json/users.json')
        .then(function(response){
          return response.data;
        });
    };

    return _factory;
  }
})();
