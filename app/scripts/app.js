'use strict';

/**
 * @ngdoc overview
 * @name dsLanduseApp
 * @description
 * # dsLanduseApp
 *
 * Main module of the application.
 */
var DsLandApp = angular
  .module('dsLanduseApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'AgavePlatformScienceAPILib'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('AgavePlatformScienceAPILib', ['ngStorage']).factory('Configuration', ['$localStorage', '$rootScope', '$timeout', function ($localStorage, $rootScope, $timeout) {

      var Configuration = {
          BASEURI: $localStorage.tenant ? $localStorage.tenant.baseUrl : 'https://agaveauth.its.hawaii.edu',
          oAuthAccessToken: $localStorage.token ? $localStorage.token.access_token : '34dd97b2682e4ea2d9fe11676cf6c15',
          setToken: function(token) {
            this.oAuthAccessToken = token;
          },
          setBaseUri: function(baseUri) {
            this.BASEURI = baseUri;
          }
      };

      $rootScope.$watch('$localStorage.token', function(){
          $timeout(function () {
              Configuration.oAuthAccessToken = $localStorage.token ? $localStorage.token.access_token : '34dd97b2682e4ea2d9fe11676cf6c15';
          }, 0);
      }, true);

      $rootScope.$watch('$localStorage.tenant', function(){
          $timeout(function () {
              Configuration.BASEURI = $localStorage.tenant ? $localStorage.tenant.baseUrl : 'hawaii';
          }, 0);
      }, true);

      return Configuration;

    }]);
