#!/bin/sh
ROOT_DIR=$(pwd)

# Create docker directories
mkdir -p data

# Install all packages
cd $ROOT_DIR/client
npm install
cd $ROOT_DIR/core
npm install

# Create docker images
cd $ROOT_DIR/buildfiles/nginx-web/
docker build -t supfile/nginx-web:latest .
cd $ROOT_DIR/buildfiles/node-api/
docker build -t supfile/node-api:latest .
cd $ROOT_DIR/buildfiles/haproxy-web/
docker build -t supfile/haproxy-web:latest .
cd $ROOT_DIR/buildfiles/haproxy-node/
docker build -t supfile/haproxy-node:latest .
cd $ROOT_DIR

# Launch and enjoy
# docker-compose down
# docker-compose up -d