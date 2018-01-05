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



    ////////LEAFLET//////////////////
    $scope.markers=[];

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


    var drawnItems = new L.FeatureGroup();
    $scope.drawnItemsCount = function() {
      return drawnItems.getLayers().length;
    }
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
        angular.element('.leaflet-draw-toolbar-top').hide();
        //drawControl.hideDrawTools();
        //alert(angular.toJson(angular.fromJson(drawnItems.toGeoJSON()).features[0].geometry));
      },
      edited: function(arg) {},
      deleted: function(arg) {
        if (angular.fromJson(drawnItems.toGeoJSON()).features[0] == null){
          angular.element('.leaflet-draw-toolbar-top').show();
        }
      },
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
          //{leafletEvent, leafletObject, model, modelName} = payload
          var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
          leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
          modelName = payload.modelName;
          handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
        });
    });

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

    //Landuse data search/fetch
    $scope.spatialSearch = function(){
      Configuration.oAuthAccessToken = $localStorage.token
      //this will use the 0 indexed feature, which hsould be a GeoJSON polygon, for the spatial search boundry
      var query = "{'$and':[{'name':'Landuse'},{'value.name':'testunit3'},{'value.loc': {$geoWithin: {'$geometry':"+angular.toJson(angular.fromJson(drawnItems.toGeoJSON()).features[0].geometry).replace(/"/g,'\'')+"}}}]}";
        MetaController.listMetadata(query,1000,0)//"{'name':'Landuse','value.name':'testunit3'}"
          .then(function(response){
               $scope.landuse = response.result;
         });
    }

  });
