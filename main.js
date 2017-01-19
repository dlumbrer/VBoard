var myApp = angular.module('myApp', ['elasticsearch']);

myApp.service('client', function (esFactory) {
  return esFactory({
    host: 'http://localhost:9200',
  });
});

myApp.controller('MainController', function($scope, client, esFactory) {
  $scope.foo = "David"

  //////////////////////////////////PRIMERO OBTENER INDICES////////////////////////////////
  client.cat.indices({
    h: ['index', 'docs.count']
  }).then(function (body) {
    let lines = body.split('\n');
    let indices = lines.map(function (line) {
      let row = line.split(' ');
      return {name: row[0], count: row[1]};
    });
    indices.pop(); //the last line is empty by default
    $scope.indexes = indices;
    console.log("INDICES", indices)
  });


  /////////////////////////////SHOW MAPPING OF THE INDEX SELECTED IF YOU WANT////////////////////////////
  $scope.searchMappingFromIndex = function(){
    $scope.showMapping = true;
    $scope.indexName = $("#indexesList").val();
    client.indices.getMapping({index: $scope.indexName}, function(error, resp) {
      if (error) {
          console.log(error);
      } else {
          console.log(resp);
          $scope.mapping = JSON.stringify(resp, undefined, 2);
      }
    });
  }
  $scope.hideMappingFromIndex = function(){
    $scope.showMapping = false;
  }
  ///////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////Mostrar tipos disponibles///////////////////
  $scope.typeFromIndex = function(){
    $scope.showTypeForm = true;

    $scope.indexName = $("#indexesList").val();
    client.indices.getMapping({index: $scope.indexName}, function(error, resp) {
      if (error) {
          console.log(error);
      } else {
          //console.log(resp);
          $scope.mapping = resp;
          $scope.types = Object.keys($scope.mapping[$scope.indexName].mappings);
          console.log($scope.mapping[$scope.indexName].mappings);
      }
    });
  }
  $scope.hideTypeForm = function(){
    $scope.showTypeForm = false;

  }
  //////////////////////////////////////////////////////////////////////

  /////////////////////////////////////Una vez con el indice y el tipo podemos buscar metricas y buckets///////////////

  $scope.showMetricsBuckets = function(){
    $scope.showMetricBucketsForm = true;
    $scope.typeName = $("#typesList").val();
    $scope.fields = Object.keys($scope.mapping[$scope.indexName].mappings[$scope.typeName].properties);
  }
  $scope.hideMetricsBucketsForm = function(){
    $scope.showMetricBucketsForm = false;

  }

  ///////////////////////////////////////////////////////////////////////

  /////////////////////////////////////Mostramos datos///////////////

  $scope.showData = function(){

    $scope.metricSelected = $("#metricList").val();
    $scope.bucketSelected = $("#bucketsList").val();
    $scope.sizeSelected = $("#sizeValue").val();

    client.search({
      index: 'opnfv',
      type: 'items',
      size: $scope.sizeSelected,
      body: {
        "query": {
          "bool": {
            "must": [
              {
                "query_string": {
                  "query": "*",
                  "analyze_wildcard": true
                }
              },
            ],
            "must_not": []
          }
        },
        "aggs": {
          "author": {
            "terms": {
              "field": $scope.bucketSelected + ".keyword",
              "size": $scope.sizeSelected,
              "order": {
                "_count": "desc"
              }
            }
          }
        }
      }
    }).then(function (resp) {
        //$scope.hits = resp.hits.hits;
        $scope.hits = JSON.stringify(resp.hits, undefined, 2);

        $scope.aggregations = JSON.stringify(resp.aggregations, undefined, 2);
        console.log(resp)
    }, function (err) {
        $scope.hits = "NO RESULTS"
        console.trace(err.message);
    });
  };

});
