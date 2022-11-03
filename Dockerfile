# !Important
# Since the code relies on the environmental variables
# This can only run with docker-compose

FROM node:18-buster-slim as development

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get -y install procps
RUN npm install

COPY . .

RUN npm run build

####################
###  PRODUCTION  ###
####################

FROM node:18-buster-slim as production

WORKDIR /app

COPY --from=development /app .

EXPOSE 8080

CMD ["sh", "/app/start.sh"]
