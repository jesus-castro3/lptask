FROM node:12.14.1-slim

RUN mkdir /app
WORKDIR /app

COPY . ./

RUN apt-get -qy update && apt-get -qy install openssl
RUN npm install -g @prisma/cli
RUN npm install -g @prisma/client

ARG POSTGRES_URL
ENV POSTGRES_URL "$POSTGRES_URL"

RUN npm install
# RUN npx prisma migrate save --experimental
# RUN npx prisma migrate up --experimental
# RUN prisma generate
CMD ["sh","-c","npx prisma migrate save --experimental -c && npx prisma migrate up --experimental -c && prisma generate && node ./prisma/seed  && npm run local"]
