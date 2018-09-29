#!/bin/bash

set -e

if [ "$ELASTICSEARCH_URL" != "" ]; then
        # If defined in the docker-compose
        sed -e "s|host: 'http://localhost:9200',$|host: '$ELASTICSEARCH_URL',|" -i /VBoard/app/service/ESService.js
else
        IP_HOST=$(/sbin/ip route|awk '/default/ { print $3 }')
        sed -e "s|host: 'http://localhost:9200',$|host: 'http://$IP_HOST:9200',|" -i /VBoard/app/service/ESService.js
fi

http-server