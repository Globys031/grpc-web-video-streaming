# grpc-web-video-streaming

Video Streaming service built using grpc-web. Project itself was written on Windows 10

In my case, I placed protoc-gen-go in `C:\Users\justi\.local`.

### Get started (with HTTP 1.1)

Change directory into the root of the project
* `docker compose up` (not necessary. Not sure why, but works fine without envoy. For now skip this)
* `npm install`
* `npm start` to start the Golang server and Webpack dev server
* Go to `http://127.0.0.1:8080/`

Run `docker exec -it envoy-container bash` to attach to the envoy container.

Modified these part in package.json to exclude:
```
"start": "concurrently --kill-others \"go run go/exampleserver/exampleserver.go\" \"npm run webpack-dev\""
```
so additionally have to run `go run go/exampleserver/exampleserver.go`

Change from "development", to "production" to emit css files instead of loading them in DOM. Set it in package.json:
```
cross-env NODE_ENV=development
```

For whatever reason localhost isn't resolving properly when using envoy, so specifiy "127.0.0.1" instead of localhost.

### Using HTTP2

***Work in progress, ignore this part***

HTTP2 requires TLS. This repository contains certificates in the `../misc` directory which are used by the server. You can optionally generate your own replacements using the `gen_cert.sh` in the same directory.
You will need to import the `../misc/localhostCA.pem` certificate authority into your browser, checking the "Trust this CA to identify websites" so that your browser trusts the localhost server.

* `docker run --name envoy-container --rm envoyproxy/envoy-dev:2ee5600abd1c64da0c0d0c8b12a9f6f5a3bf98e2`
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

### References

Written by referencing the following sources:
* https://github.com/improbable-eng/grpc-web/tree/master/client/grpc-web-react-example
* https://github.com/improbable-eng/ts-protoc-gen
* https://github.com/grpc/grpc-go/blob/master/Documentation/grpc-metadata.md
* https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/cors
* https://github.com/envoyproxy/envoy/tree/main/examples/grpc-bridge
* https://www.polarsignals.com/blog/posts/2022/02/22/how-we-build-our-apis-from-scratch/
* https://medium.com/wesionary-team/grpc-console-chat-application-in-go-dd77a29bb5c3