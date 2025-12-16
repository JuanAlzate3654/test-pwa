FROM 011248589833.dkr.ecr.us-east-1.amazonaws.com/isoftco/node:20-alpine3.20 AS builder
WORKDIR /app

ARG NPM_TOKEN_PACKAGE
ENV token $NPM_TOKEN_PACKAGE

COPY package*.json ./
COPY . .

RUN npm config set @integral-software:registry https://npm.pkg.github.com --location=project
RUN npm config set //npm.pkg.github.com/:_authToken $token

RUN npm install
RUN npm run build

FROM 011248589833.dkr.ecr.us-east-1.amazonaws.com/isoftco/busybox:1.36.1-glibc
WORKDIR /app

COPY --from=builder /app/dist /app/build

ENTRYPOINT ["sh", "-c", "cp -r /app/build/* ${VOLUME_PATH}"]
