FROM node:latest as uibuild
WORKDIR /app

COPY ["package.json", "./"]
# COPY ["package-lock.json", "./"]

RUN npm i

COPY . .

# RUN npm run lint

RUN npm run build

FROM nginx:alpine
COPY --from=uibuild /app/dist/green-dashboard /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
