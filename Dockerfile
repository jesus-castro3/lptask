FROM node:12.14.1-slim

RUN mkdir /app
WORKDIR /app

COPY . ./

RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install -g @prisma/cli
RUN npm install -g @prisma/client

# npm run migrate && npm run seed &
ARG POSTGRES_URL
ENV POSTGRES_URL "$POSTGRES_URL"
ARG ENVIROMENT
ENV ENVIROMENT "$ENVIROMENT"

CMD ["sh","-c","npm run ${ENVIROMENT}"]
