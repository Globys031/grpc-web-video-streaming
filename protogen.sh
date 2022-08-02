for SERVER in authServer chatServer commentServer streamingServer
do
    PROTO_FILE_DIR=".\\${SERVER}\\protos"
    GO_OUT=".\\${SERVER}\\go" # go_package in .proto file adds additional child directory it will be output to
    JS_OUT=".\\${SERVER}\\ts\\protoLibrary"
    PROTOC_GEN_TS=".\\node_modules\\.bin\\protoc-gen-ts.cmd"

    protoc \
        --plugin="protoc-gen-ts=${PROTOC_GEN_TS}" \
        -I ${PROTO_FILE_DIR} \
        --js_out="import_style=commonjs,binary:${JS_OUT}" \
        --go_out ${GO_OUT} \
        --go-grpc_out ${GO_OUT} \
        --ts_out="service=grpc-web:${JS_OUT}" \
        -I={$PROTO_FILE_DIR} chat.proto
done