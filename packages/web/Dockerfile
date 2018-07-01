FROM nginx:latest

EXPOSE 8080

RUN mkdir /opt/app
WORKDIR /opt/app
COPY public .
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-c", "/etc/nginx/nginx.conf"]
