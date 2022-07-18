# gRPC-Web-Example: A simple Golang API server and TypeScript frontend

# grpc-web-video-streaming

Video Streaming service built using grpc-web. Project itself was written on Windows 10

In my case, I placed protoc-gen-go in `C:\Users\justi\.local`.

### Get started (with HTTP 1.1)

* `npm install`
* `npm start` to start the Golang server and Webpack dev server
* Go to `http://localhost:8081`

### Using HTTP2

HTTP2 requires TLS. This repository contains certificates in the `../misc` directory which are used by the server. You can optionally generate your own replacements using the `gen_cert.sh` in the same directory.
You will need to import the `../misc/localhostCA.pem` certificate authority into your browser, checking the "Trust this CA to identify websites" so that your browser trusts the localhost server.

* `npm run start:tls` to start the Golang server and Webpack dev server with the certificates in `misc`
* Go to `https://localhost:8082`

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
* https://github.com/improbable-eng/grpc-web/tree/master/go/grpcwebproxy (at the bottom specifies what two proxies could be used)
* https://github.com/improbable-eng/ts-protoc-gen