'use strict';

/**
 * @ngdoc function
 * @name dsLanduseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dsLanduseApp
 */
angular.module('dsLanduseApp')
  .controller('MainCtrl', function ($scope,  Configuration, MetaController,$localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    Configuration.oAuthAccessToken = $localStorage.token
    $scope.getWells = function(){
        MetaController.listMetadata("{'name':'Well'}",10,0)
          .then(function(response){
               $scope.wells = response.result;
         });
    }
    $scope.getWells();



  });
