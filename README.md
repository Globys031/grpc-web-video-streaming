# grpc-web-video-streaming

Video Streaming service built using grpc-web. Project itself was written on Windows 10

In my case, I placed protoc-gen-go in `C:\Users\justi\.local`.

### Get started (with HTTP 1.1)

Change directory into the root of the project
* `docker compose --env-file ./config/env/dev.env up`
* `npm install`
* `npm start` to start the Golang server and Webpack dev server
* Go to `http://127.0.0.1:8080/`

Run `docker exec -it envoy-container bash` to attach to the envoy container.

Modified these part in package.json to exclude:
```
"start": "concurrently --kill-others \"go run go/exampleserver/exampleserver.go\" \"npm run webpack-dev\""
```
so additionally have to run `go run go/exampleserver/exampleserver.go`

For whatever reason localhost isn't resolving properly when using envoy, so specify "127.0.0.1" instead of localhost.

### Using HTTP2

***Work in progress, ignore this part***

HTTP2 requires TLS. This repository contains certificates in the `../misc` directory which are used by the server. You can optionally generate your own replacements using the `gen_cert.sh` in the same directory.
You will need to import the `../misc/localhostCA.pem` certificate authority into your browser, checking the "Trust this CA to identify websites" so that your browser trusts the localhost server.

* `docker compose --env-file ./config/env/prod.env up`
* `npm run start:tls` to start the Golang server and Webpack dev server with the certificates in `misc`
* Go to `https://localhost:8081`

### Generating proto files

To regenerate proto files:
```
PROTO_FILE_DIR=".\\proto\\examplecom\\library"
GO_OUT=".\\go\\proto"
JS_OUT=".\\ts\\proto\\examplecom\\library"
PROTOC_GEN_TS=".\\node_modules\\.bin\\protoc-gen-ts.cmd"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS}" \
    -I ${PROTO_FILE_DIR} \
    --js_out="import_style=commonjs,binary:${JS_OUT}" \
    --go_out ${GO_OUT} \
    --go-grpc_out ${GO_OUT} \
    --ts_out="service=grpc-web:${JS_OUT}" \
    -I=$PROTO_DIR book_service.proto
```

### Changing environment from devevelopment to production

Change from "development", to "production" to emit css files instead of loading them in DOM. Set it in package.json:
```
cross-env NODE_ENV=development
```

Modify `config/env/envType.env` from `ENV=dev` to `ENV=prod` and vice versa

### Common issues

* If you get errors about protoc-gen-ts, make sure the node module is installed for that microservice (warnings can be ignored):
```
npm install -D ts-protoc-gen
```
* If /var/lib/postgresql/data is empty (a database cluster hasn't been created), make sure the mounted storage path is correct. For example, works with the following:
```
docker run --rm -it -e POSTGRES_PASSWORD=example -p 5432:5432 -v data:/var/lib/postgresql/data --name postgreserver postgres:14.4 bash
```
* Docker volumes are saved in the docker virtual machine. It can be accessed via docker desktop -> Volumes
* If postgreql is down, it's likely because the database cluster couldn't be initialised because /var/lib/postgresql/data wasn't empty. Remove the mounted volume "data" to fix.
* If removing the mounted volume doesn't fix it, manually create clusters and initialise database
```
su - postgres
initdb
pg_ctl -D /var/lib/postgresql/data -l logfile start
pg_createcluster 14 main
/etc/init.d/postgresql start 14
```

### References

Written by referencing the following sources:
* https://github.com/improbable-eng/grpc-web/tree/master/client/grpc-web-react-example
* https://github.com/improbable-eng/ts-protoc-gen
* https://github.com/grpc/grpc-go/blob/master/Documentation/grpc-metadata.md
* https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/cors
* https://github.com/envoyproxy/envoy/tree/main/examples/grpc-bridge
* https://www.polarsignals.com/blog/posts/2022/02/22/how-we-build-our-apis-from-scratch/
* https://medium.com/wesionary-team/grpc-console-chat-application-in-go-dd77a29bb5c3
* https://levelup.gitconnected.com/microservices-with-go-grpc-api-gateway-and-authentication-part-1-2-393ad9fc9d30