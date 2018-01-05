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
    'AgavePlatformScienceAPILib',
    'ui-leaflet',
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

          $localStorageProvider.set('token', 'mytoken');
      }]);
