FROM node:lts-buster
RUN mkdir build
ADD . build
WORKDIR /build
RUN npm install
RUN npm run build
WORKDIR /
RUN mkdir /var/www/lgarduinowebapi -p
RUN cp build/* /var/www/lgarduinowebapi -r
RUN rm -rf build
WORKDIR /var/www/lgarduinowebapi
RUN npm install
EXPOSE 3000
CMD ["node", "build/app.js", "3000"]