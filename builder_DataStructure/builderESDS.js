function builderESDS (builderESDS) {

  builderESDS.version = "0.0.1";

  builderESDS.metrics = [];
  builderESDS.buckets = [];

  builderESDS.metricId = 0;
  builderESDS.bucketId = 0;


  ////////////////////////////////UNIR METRICAS Y BUCKETS EN LA ESTRUCTURA DE DATOS/////////////////////////////////////
  builderESDS.buildDataStructure = function(){
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
    }]

    builderESDS.dataStucture = builderESDS.buckets.concat(builderESDS.metrics);

    console.log(builderESDS.dataStucture)

    //builderESDS.dataStucture = statements;
    return builderESDS;
  }

  builderESDS.getDataStructure = function(){
    return builderESDS.dataStucture;
  }
  ////////////////////////////////////////////////////////////////////////

  /////////////////////////////AÑADIR METRICAS Y BUCKETS////////////
  builderESDS.addMetric = function(aggType, field, options){
    var agg = {
      id : builderESDS.metricId,
      type: "metric",
      aggregationType: aggType,
      aggregationField: field,
      aggregationOptions: options
    };
    builderESDS.metricId++;
    builderESDS.metrics.push(agg)

    return builderESDS;
  }

  builderESDS.addBucket = function(aggType, field, options){
    var agg = {
      id : builderESDS.bucketId,
      type: "bucket",
      aggregationType: aggType,
      aggregationField: field,
      aggregationOptions: options
    };
    builderESDS.bucketId++;
    builderESDS.buckets.push(agg)

    return builderESDS;
  }


	return builderESDS;
}
