function genES (genES) {
  //¿DEBO CONSTRUIR EL OBJETO PASANDOLE POR PARAMETRO EL CLIENTE Y BODYBUILDER O NO?
  genES.version = "0.0.1";

  ///////////////////////////////PRUEBAS//////////////////////////////////////
  genES.getIndicesNames = function(client){
    client.cat.indices({
      h: ['index', 'doc_count']
    }).then(function (body) {
      let lines = body.split('\n');
      let indices = lines.map(function (line) {
        let row = line.split(' ');
        return {name: row[0], count: row[1]};
      });
      indices.pop();
      return indices;
    }, function (err) {
        return "ERROR"
        console.trace(err.message);
    });
  }
  ////////////////////////////////////////////////////////////////////////////

  //Monta el objeto bodybuilder
  genES.buildBodybuilderObject = function(statements, bodybuilder) {
    if(statements.length > 1){
      var bodyQuery = bodybuilder().aggregation(statements[0].aggregationType, statements[0].aggregationField, statements[0].aggregationOptions, (agg) => {
        var index = 1;
        var nestedAgg;
        function makeNestedAgg(aggBuilder) {
          if (!statements[index]) return nestedAgg;
          var type = statements[index].aggregationType;
          var field = statements[index].aggregationField;
          var options = statements[index].aggregationOptions;
          index++;
          return aggBuilder.aggregation(type, field, options, (agg) => makeNestedAgg(nestedAgg = agg));
        }
        return makeNestedAgg(agg);
      })
    }else{
      var bodyQuery = bodybuilder().aggregation(statements[0].aggregationType, statements[0].aggregationField, statements[0].aggregationOptions);
    }
    genES.objBB = bodyQuery;
    return genES;
  }
  //Devuelve el objeto bodybuilder
  genES.getBodybuilderObject = function() {
    return genES.objBB;
  }


  //Monta la query
  genES.buildQuery = function() {
    genES.query = genES.objBB.build()
    return genES;
  }
  //Devuelve la query montada
  genES.getQuery = function() {
    return genES.query;
  }


  //Este metodo devuelve una promesa por que esta haciendo una búsqueda externa
  genES.executeSearch = function(client, indexName){
    var promise = client.search({
      index: indexName,
      type: 'items',
      size: 5,
      body: genES.query
    })
    return promise
  }

	return genES;
}


/*$scope.exexcuteSearch = function(query){
  ESService.client.search({
    index: 'opnfv',
    type: 'items',
    size: $scope.sizeSelected,
    body: query

    {
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
      $scope.aggregationsToShow = JSON.stringify(resp.aggregations, undefined, 2);
      $scope.aggregations = resp.aggregations;
      console.log("RESPUESTA: ", resp)
      //$scope.build3DChart();
  }, function (err) {
      $scope.hits = "NO RESULTS"
      console.trace(err.message);
  });
}*/
