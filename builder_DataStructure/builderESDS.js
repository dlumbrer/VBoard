function builderESDS (builderESDS) {

  builderESDS.version = "0.0.1";

  builderESDS.buildDataStructure = function(){
    var statements = [{
      "aggregationType":"terms",
      "aggregationField":"author_org_name.keyword"
    }, {
      "aggregationType":"terms",
      "aggregationField":"repo_name.keyword"
    }, {
      "aggregationType":"date_histogram",
      "aggregationField":"author_date" ,
      "aggregationOptions": {"interval" : "1M"}
    }, {
      "aggregationType":"histogram",
      "aggregationField":"lines_changed",
      "aggregationOptions": {"interval" : "2000"}
    }]

    builderESDS.dataStucture = statements;
    return builderESDS;
  }
  
  builderESDS.getDataStructure = function(){
    return builderESDS.dataStucture;
  }


	return builderESDS;
}
