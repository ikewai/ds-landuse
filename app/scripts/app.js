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

  DsLandApp.config(['$localStorageProvider',
      function ($localStorageProvider) {
          $localStorageProvider.get('token');

          $localStorageProvider.set('token', '34dd97b2682e4ea2d9fe11676cf6c15');

          var Configuration = {
              BASEURI: 'https://agaveauth.its.hawaii.edu',
              oAuthAccessToken: '34dd97b2682e4ea2d9fe11676cf6c15',
              setToken: function(token) {
                this.oAuthAccessToken = token;
              },
              setBaseUri: function(baseUri) {
                this.BASEURI = baseUri;
              }
          };
          return Configuration
      }]);
