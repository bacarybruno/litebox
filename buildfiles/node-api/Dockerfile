FROM node:latest
LABEL MAINTAINER "bacarybruno"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install all packages
RUN apt-get update && apt-get install -y default-jdk ghostscript unoconv libav-tools imagemagick
RUN ln -s /usr/bin/avconv /usr/bin/ffmpeg

# Env variables
ENV NODE_ENV=development
ENV MONGO_HOST=mongodb
ENV MONGO_PORT=27017
ENV MONGO_DB=SupFileDB
ENV SERVER_NAME=https://5a94625f.ngrok.io
ENV STORAGE_DIR=/storage/
ENV JWT_SECRET=Supinf0!
ENV MAX_UPLOAD_SIZE=1gb
# ENV PORT=3000

CMD [ "npm", "start" ]