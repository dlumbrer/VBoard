# Vboard (WP)
Platform to create (3D) charts of ElasticSearch data.

## Installation Steps

> **Important:** It is necessary to have installed and launched an  "**ElasticSearch 5.x in your localhost:9200**"
```
git clone https://github.com/dlumbrer/VBoard-UI
cd VBoard-UI
python -m SimpleHTTPServer
```

Go in your browser to http://localhost:8000/ and enjoy!


## Tab Visualize (to build a chart)

Follow this steps to build a a visualization:

* Select the index of your ElasticSearch (the index should have a type called "items")

![Screenshot](images/selectindex.png)

* Select Chart type
  * Pie, Bars, Line, Curve, 3DBars, Bubbles

![Screenshot](images/selectvistype.png)

* Select Data (metrics and buckets)
  * Each chart require more or less metrics/buckets

![Screenshot](images/selectdata.png)

* Play!

![Screenshot](images/example1.png)
![Screenshot](images/example2.png)
![Screenshot](images/example3.png)


### Options

* **Show Mapping**: With this button you can see at the bottom of the page the mapping of the index.
![Screenshot](images/examplemapping.png)

* **Show Response (JSON)**: With this button you can see at the bottom of the page the response of ElasticSearch (Hits and Aggregations in JSON) of the data previously selected.
![Screenshot](images/exampleresponse.png)

* **Save Visualization**: This button open a modal in order to save the visualization in ElasticSearch. The visualization will be saved in the index (**Previously created**) **.vboard**. (See __Creation of the index .vissthreed__)
![Screenshot](images/examplesave.png)

* **Load Visualization**: This button open a modal in order to load a visualization.
![Screenshot](images/exampleload.png)


## Tab Panels (to build a panels with charts)

Work in progress..

### Options

* **New Panel**:

* **Save Panel**:

* **Load Panel**:


## Tab Dashboard (to build a dashboard with charts and panels)

Work in progress..

### Options

Work in progress..


## Creation of the index .vboard

To save visualizations you must have created the index **.vboard**, this is the mapping of the index (__Recommended use Sense or CURL to create it__):

```
PUT .vboard
{
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "visthreed" : {
            "properties" : {
                "chartType" : { "type" : "text" },
                "name" : { "type" : "text" },
                "description" : { "type" : "text" },
                "indexOfES" : {"type" : "text"},
                "typeOfES" : {"type": "text"},
                "metricsSelected" : { "type": "object" },
                "bucketsSelected" : { "type": "object" },
                "visobject" : { "type": "object" }
            }
        }
    }
}

PUT .vboard/_mapping/panelthreed
{
  "properties": {
    "position" : { "type" : "text" },
    "rows" : { "type" : "text" },
    "columns" : { "type" : "text" },
    "dimension" : { "type" : "text" },
    "opacity" : { "type" : "text" },
    "charts" : { "type" : "object" },
    "name" : { "type" : "text" },
    "description" : { "type" : "text" }
  }
}
```
