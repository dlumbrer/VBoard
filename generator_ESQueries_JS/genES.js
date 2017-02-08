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
