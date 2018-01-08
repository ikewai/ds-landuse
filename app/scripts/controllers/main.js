'use strict';

/**
 * @ngdoc function
 * @name dsLanduseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dsLanduseApp
 */
angular.module('dsLanduseApp')
  .controller('MainCtrl', function ($scope,  Configuration, MetaController, $localStorage,leafletDrawEvents) {

    Configuration.oAuthAccessToken = $localStorage.token

    $scope.getWells = function(){
        MetaController.listMetadata("{'name':'Well'}",10,0)
          .then(function(response){
               $scope.wells = response.result;
         });
    }
    //$scope.getWells();

    //Landuse data search/fetch
    $scope.getLanduseData = function(){
      //this will use the 0 indexed feature, which hsould be a GeoJSON polygon, for the spatial search boundry
      //query = "{$and:[{'name':'Landuse'},{'value.name':'testunit3'},{'value.loc': {$geoWithin: {'$geometry':"+angular.toJson(angular.fromJson(drawnItems.toGeoJSON()).features[0].geometry).replace(/"/g,'\'')+"}}]}";
        MetaController.listMetadata("{'name':'Landuse','value.name':'testunit3'}",10,0)//"{'name':'Landuse','value.name':'testunit3'}"
          .then(function(response){
               $scope.landuse = response.result;
         });
    }
    //$scope.getLanduseData();

    function getSum(total, num) {
       return total + num;
    }

    $scope.fetchCovJson = function(){
      $.getJSON( "data/base0.covjson", function( data ) {
        $scope.recharge = data.ranges.recharge.values
        $scope.base_sum = $scope.recharge.reduce(getSum)
        $scope.$apply()
      });
    }
    $scope.fetchCovJson()

    $scope.calculate_new_recharge = function(){
      $scope.new_recharge  = $scope.recharge.slice(); //clone array
      var landuse_type = 1
      var scenario = 'recharge_scenario0'
      angular.forEach($scope.landuse, function(val, key) {
        var new_index = val.value.y*732 + val.value.x
        $scope.new_recharge[new_index] = val.value[scenario][landuse_type]
      });
      $scope.landuse_sum = $scope.new_recharge.reduce(getSum)
      //$scope.$apply()
    }
    ////////LEAFLET//////////////////
    $scope.markers=[];

    //Setup the map defaults
    angular.extend($scope, {
        drawControl: true,
        hawaii: {
                lat: 21.289373,
                lng: -157.91,
                zoom: 7
        },
        events: {
            map: {
                enable: ['click', 'drag', 'blur', 'touchstart'],
                logic: 'emit'
            }
        },
        defaults: {
                scrollWheelZoom: false
        },
    });

    //this is object to store the drawn polygons for access them as geojson for search later
    var drawnItems = new L.FeatureGroup();
    $scope.drawnItemsCount = function() {
      return drawnItems.getLayers().length;
    }

    //Setup the map drawing options
    angular.extend($scope, {
      map: {
        center: {
            lat: 21.289373,
            lng: -157.91,
            zoom: 7
        },
        default:{
          attributionControl: false
        },
        drawOptions: {
          position: "bottomright",
          draw: {
            polyline: false,
            polygon: {
              metric: false,
              showArea: true,
              drawError: {
                color: '#b00b00',
                timeout: 1000
              },
              shapeOptions: {
                color: 'blue'
              }
            },
            circle: false,
            marker: false
          },
          edit: {
            featureGroup: drawnItems,
            remove: true
          }
        }
      }
    });


    var handle = {
      created: function(e,leafletEvent, leafletObject, model, modelName) {
        drawnItems.addLayer(leafletEvent.layer);
        //hide toolbar
        //angular.element('.leaflet-draw-toolbar-top').hide();
      },
      edited: function(arg) {},
      deleted: function(arg) {},
      drawstart: function(arg) {},
      drawstop: function(arg) {},
      editstart: function(arg) {},
      editstop: function(arg) {},
      deletestart: function(arg) {

      },
      deletestop: function(arg) {}
    };

    var drawEvents = leafletDrawEvents.getAvailableEvents();

    drawEvents.forEach(function(eventName){
        $scope.$on('leafletDirectiveDraw.' + eventName, function(e, payload) {
          var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
          leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
          modelName = payload.modelName;
          handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
        });
    });
    $scope.fetchMoreSpatialSearch = function(offset){
      Configuration.oAuthAccessToken = $localStorage.token
      //this will use the 0 indexed feature from the leaflet map, which should be a GeoJSON polygon, for the spatial search boundry
      var query = "{'$and':[{'name':'Landuse'},{'value.name':'testunit3'},{'value.loc': {$geoWithin: {'$geometry':"+angular.toJson(angular.fromJson(drawnItems.toGeoJSON()).features[0].geometry).replace(/"/g,'\'')+"}}}]}";
        MetaController.listMetadata(query,1000,offset)//"{'name':'Landuse','value.name':'testunit3'}"
          .then(function(response){
               $scope.landuse = $scope.landuse.concat(response.result);
               console.log("Count:" + $scope.landuse.length.toString())
               if(response.result.length == 1000){
                 $scope.fetchMoreSpatialSearch(offset+1000)
               }else{
                 $scope.calculate_new_recharge()
               }
         });
    }

    function fetchMetadataFromAPI(query="",limit=100,offset=0){
      $.ajax({
        type: "GET",
        url: "https://agaveauth.its.hawaii.edu:443/meta/v2/data?q="+encodeURI(query)+"&limit="+limit.toString()+"&offset="+offset.toString(),
        dataType: 'json',
        async: false,
        headers: {
          "Authorization": "Bearer " + $localStorage.token,
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data: {},
        success: function (response){
          $scope.landuse = response.result;
          console.log("Count:" + $scope.landuse.length.toString())
          $scope.calculate_new_recharge()
        }
      });
    }
    //SPATIAL FETCH
    //Landuse data search/fetch with geojson boundry
    $scope.spatialSearch = function(){
      Configuration.oAuthAccessToken = $localStorage.token
      //this will use the 0 indexed feature from the leaflet map, which should be a GeoJSON polygon, for the spatial search boundry
      var query = "{'$and':[{'name':'Landuse'},{'value.name':'testunit3'},{'value.loc': {$geoWithin: {'$geometry':"+angular.toJson(angular.fromJson(drawnItems.toGeoJSON()).features[0].geometry).replace(/"/g,'\'')+"}}}]}";
      /*  MetaController.listMetadata(query,1000,0)//"{'name':'Landuse','value.name':'testunit3'}"
          .then(function(response){
               $scope.landuse = response.result;
               console.log("Count:" + $scope.landuse.length.toString())
               if(response.result.length == 1000){
                 $scope.fetchMoreSpatialSearch(1000)
               }else{
                 $scope.calculate_new_recharge()
              }
         });
         */

      //
      $.ajax({
        type: "GET",
        url: "https://agaveauth.its.hawaii.edu:443/meta/v2/data?q="+encodeURI(query)+"&limit=10000&offset=0",
        dataType: 'json',
        async: false,
        headers: {
          "Authorization": "Bearer " + $localStorage.token,
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data: {},
        success: function (response){
          $scope.landuse = response.result;
          console.log("Count:" + $scope.landuse.length.toString())
          $scope.calculate_new_recharge()
        }
      });
    }



  });
