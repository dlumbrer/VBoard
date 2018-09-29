FROM node:8.12

MAINTAINER David Moreno Lumbreras "dmorenolumb@gmail.com"

RUN apt-get update -y

# Clone the repository
RUN git clone https://github.com/dlumbrer/VBoard -b integration-aframedc

# Install dependencies
WORKDIR VBoard
RUN npm install

# Install http-server
RUN npm install -g http-server

# Copy entrypoint
COPY docker-entrypoint.sh .
RUN chmod 755 docker-entrypoint.sh

# Expose port ant init application
EXPOSE 8080
CMD ["./docker-entrypoint.sh"]