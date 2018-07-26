
FROM node:10-alpine

ARG VERSION=latest
ENV NODE_ENV=production PORT=3000
EXPOSE 3000

ADD . /app
WORKDIR /app

RUN addgroup -S buddy \
&&  adduser -S -g buddy buddy \
&&  chown -R buddy /app

USER buddy


RUN npm i

ENTRYPOINT ["npm"]
CMD ["start"]
