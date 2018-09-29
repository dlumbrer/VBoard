# Docker images of VBoard

There are 2 images of VBoard availables in [docker-hub](https://hub.docker.com/r/dlumbrer/vboard/): `dlumbrer/vboard:aframedc` and `dlumbrer/vboard:threedc`.

### aframedc

This image uses aframedc as render engine. This one is the one used to view the dashboard in VR. Dockerfile available in the `docker/docker-aframedc/` folder

### threedc

This image uses threedc (Three.js charts API) as render engine.Dockerfile available in the `docker/docker-threedc/` folder

## Composes

In order to deploy it well, I recomend to use docker-compose following the ones that are inside the `composes/` folder.

### Aframedc + ElasticSearch

If you want a full installation with the **Aframedc** version and a **ElasticSearch**, I recommend to use this docker-compose:
```
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:5.6.0
  ports:
    - "9200:9200"
  volumes:
    - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
  environment:
    - ES_JAVA_OPTS=-Xms2g -Xmx2g
    - transport.host=127.0.0.1
    - xpack.security.enabled=false

vboard:
  image: dlumbrer/vboard:aframedc
  ports:
    - "8080:8080"
```

**Note** that the VBoard app will be connected to ElasticSearch automatically! 

### Threedc + ElasticSearch

If you want a full installation with the **Threedc** version and a **ElasticSearch**, I recommend to use this docker-compose:
```
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:5.6.0
  ports:
    - "9200:9200"
  volumes:
    - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
  environment:
    - ES_JAVA_OPTS=-Xms2g -Xmx2g
    - transport.host=127.0.0.1
    - xpack.security.enabled=false

vboard:
  image: dlumbrer/vboard:threedc
  ports:
    - "8080:8080"
```

**Note** that the VBoard app will be connected to ElasticSearch automatically! 

### Aframe or Threedc (without ElasticSearch)

This compose will deploy just VBoard:

```
vboard:
  image: dlumbrer/vboard:aframedc
  ports:
    - "8080:8080"
  environment:
    - ELASTICSEARCH_URL=http://localhost:9200
```

or

```
vboard:
  image: dlumbrer/vboard:threedc
  ports:
    - "8080:8080"
  environment:
    - ELASTICSEARCH_URL=http://localhost:9200
```

**IMPORTANT: You have to modify the environment variable `ELASTICSEARCH_URL` to you ElasticSearch url.**


### ElasticSearch (in order to connect to VBoard)

This compose will deploy just ElasticSearch with a custom configuration in order to deploy it with a VBoard already launched:
```
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:5.6.0
  ports:
    - "9200:9200"
  volumes:
    - ./config/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
  environment:
    - ES_JAVA_OPTS=-Xms2g -Xmx2g
    - transport.host=127.0.0.1
    - xpack.security.enabled=false

```