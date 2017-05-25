function genES () {
  //¿DEBO CONSTRUIR EL OBJETO PASANDOLE POR PARAMETRO EL CLIENTE Y BODYBUILDER O NO?
  var genEs = {};
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
    var index = 0;
    if(statements.length > 1){
      var bodyQuery = bodybuilder().aggregation(statements[index].aggregationType, statements[index].aggregationField, statements[index].aggregationOptions, (agg) => {
        var nestedAgg;
        function makeNestedAgg(aggBuilder) {
          index++;
          if (!statements[index]) return nestedAgg;
          var type = statements[index].type;

          //Si es metric no hay que hacer un nestedAgg, ahora son todas agregaciones en paralelo
          if (type == "metric"){
            //Ahora las metricas
            for (var i = index; i < statements.length; i++) {
              //No meto las de count
              if(statements[i].aggregationType != "count"){
                aggBuilder.aggregation(statements[i].aggregationType, statements[i].aggregationField, statements[i].aggregationOptions);
              }
            }
            return aggBuilder;
          }

          var aggtype = statements[index].aggregationType;
          var field = statements[index].aggregationField;
          var options = statements[index].aggregationOptions;
          //index++;
          return aggBuilder.aggregation(aggtype, field, options, (agg) => makeNestedAgg(nestedAgg = agg));
        }
        return makeNestedAgg(agg);
      })
    }else{
      //Solo una agregación
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
    console.log(genES.query)
    return genES;
  }
  //Devuelve la query montada
  genES.getQuery = function() {
    return genES.query;
  }


  //Este metodo devuelve una promesa por que esta haciendo una búsqueda externa
  genES.executeSearch = function(client, indexName, typeName){
    var promise = client.search({
      index: indexName,
      type: typeName,
      size: 5,
      body: genES.query
    })
    return promise
  }

  //Cargar todas las visualizaciones
  genES.loadAllVis = function(client){

    var promise = client.search({
      index: ".vboard",
      type: 'visthreed',
      size: 10000,
      body: { "query": { "match_all": {} } }
    });

    return promise;
  }

  //Cargar todos los paneles
  genES.loadAllPanels = function(client){

    var promise = client.search({
      index: ".vboard",
      type: 'panelthreed',
      size: 10000,
      body: { "query": { "match_all": {} } }
    });

    return promise;
  }

  //Cargar todos los dashboards
  genES.loadAllDashboards = function(client){

    var promise = client.search({
      index: ".vboard",
      type: 'dashthreed',
      size: 10000,
      body: { "query": { "match_all": {} } }
    });

    return promise;
  }

  //COMPROBAR VISUALIZACIÓN EN ES
  genES.checkVis = function(client, nameP, descriptionP, vistype){

    var promise = client.search({
      index: '.vboard',
      type: 'visthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ vistype+"_"+nameP ]
          }
        }
      }
    })

    return promise;
  }

  //COMPROBAR PANEL EN ES
  genES.checkPanel = function(client, nameP){

    var promise = client.search({
      index: '.vboard',
      type: 'panelthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ nameP ]
          }
        }
      }
    })

    return promise;
  }

  //COMPROBAR PANEL EN ES
  genES.checkDashboard = function(client, nameP){

    var promise = client.search({
      index: '.vboard',
      type: 'dashthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ nameP ]
          }
        }
      }
    })

    return promise;
  }

  //Cargar Visualizacion
  genES.getVis = function(client, idtosearch){

    var promise = client.search({
      index: '.vboard',
      type: 'visthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ idtosearch ]
          }
        }
      }
    })

    return promise;
  }

  //Cargar Panel
  genES.getPanel = function(client, idtosearch){

    var promise = client.search({
      index: '.vboard',
      type: 'panelthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ idtosearch ]
          }
        }
      }
    })

    return promise;
  }

  //Cargar Dashboard
  genES.getDash = function(client, idtosearch){

    var promise = client.search({
      index: '.vboard',
      type: 'dashthreed',
      size: 5,
      body: {
        "query": {
          "terms": {
            "_id": [ idtosearch ]
          }
        }
      }
    })

    return promise;
  }

  //Actualizar VISUALIZACIÓN ES
  genES.updateVis = function(client, nameP, descriptionP, vistype, dataP, index, type, metrics, buckets){

    var promise = client.update({
      index: '.vboard',
      type: 'visthreed',
      id: vistype + "_" + nameP,
      body: {
        doc: {
          chartType: vistype,
          description: descriptionP,
          name: nameP,
          data: dataP,
          indexOfES: index,
          typeOfES: type,
          metricsSelected: metrics,
          bucketsSelected: buckets,
        }
      }
    });
    return promise;
  }

  //Actualizar PANEL ES
  genES.updatePanel = function(client, nameP, descriptionP, positionP, rowsP, columnsP, dim, op, chartsP){

    var promise = client.update({
      index: '.vboard',
      type: 'panelthreed',
      id: nameP,
      body: {
        doc: {
          description: descriptionP,
          name: nameP,
          position: positionP,
          rows: rowsP,
          columns: columnsP,
          dimension: dim,
          opacity: op,
          charts: chartsP,
        }
      }
    });
    return promise;
  }

  //Actualizar DASHBOARD ES
  genES.updateDashboard = function(client, nameP, descriptionP, chartsP, panelsP){

    var promise = client.update({
      index: '.vboard',
      type: 'dashthreed',
      id: nameP,
      body: {
        doc: {
          description: descriptionP,
          name: nameP,
          charts: chartsP,
          panels: panelsP,
        }
      }
    });
    return promise;
  }

  //CREAR VISUALIZACIÓN ES
  genES.createVis = function(client, nameP, descriptionP, vistype, dataP, index, type, metrics, buckets){

    var promise = client.create({
      index: '.vboard',
      type: 'visthreed',
      id: vistype + "_" + nameP,
      body: {
        chartType: vistype,
        description: descriptionP,
        name: nameP,
        data: dataP,
        indexOfES: index,
        typeOfES: type,
        metricsSelected: metrics,
        bucketsSelected: buckets,
      }
    });// function (error, response) {
      //console.log(error, response, "OK")
    //});
    return promise;
  }

  //CREAR PANEL ES
  genES.createPanel = function(client, nameP, descriptionP, positionP, rowsP, columnsP, dim, op, chartsP){

    var promise = client.create({
      index: '.vboard',
      type: 'panelthreed',
      id: nameP,
      body: {
        description: descriptionP,
        name: nameP,
        position: positionP,
        rows: rowsP,
        columns: columnsP,
        dimension: dim,
        opacity: op,
        charts: chartsP,
      }
    });

  return promise;
}

  //CREAR DASHBOARD ES
  genES.createDashboard = function(client, nameP, descriptionP, chartsP, panelsP){

    var promise = client.create({
      index: '.vboard',
      type: 'dashthreed',
      id: nameP,
      body: {
        description: descriptionP,
        name: nameP,
        charts: chartsP,
        panels: panelsP,
      }
    });

    return promise;
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


/*///ESTILO DEL ARRAY
var statements = [{
  "id": 0,
  "type": "bucket",
  "aggregationType":"terms",
  "aggregationField":"author_org_name.keyword",
  "aggregationOptions": {"size" : "10"}
}, {
  "id": 1,
  "type": "bucket",
  "aggregationType":"terms",
  "aggregationField":"repo_name.keyword"
}, {
  "id": 2,
  "type": "bucket",
  "aggregationType":"date_histogram",
  "aggregationField":"author_date" ,
  "aggregationOptions": {"interval" : "1M"}
}, {
  "id": 3,
  "type": "bucket",
  "aggregationType":"histogram",
  "aggregationField":"lines_changed",
  "aggregationOptions": {"interval" : "2000"}
}]*/
