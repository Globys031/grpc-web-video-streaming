for SERVER_TYPE in auth chat comment streaming
do
    SERVER=${SERVER_TYPE}Server
    PROTO_FILE_DIR=".\\${SERVER}Server\\protos"
    GO_OUT=".\\${SERVER}Server\\go" # go_package in .proto file adds additional child directory it will be output to
    JS_OUT=".\\${SERVER}Server\\ts\\protoLibrary" # Note that the directory has to be already created (unlike with go)
    PROTOC_GEN_TS=".\\${SERVER}Server\\node_modules\\.bin\\protoc-gen-ts.cmd"
    protoc \
        --plugin="protoc-gen-ts=${PROTOC_GEN_TS}" \
        -I ${PROTO_FILE_DIR} \
        --js_out="import_style=commonjs,binary:${JS_OUT}" \
        --go_out ${GO_OUT} \
        --go-grpc_out ${GO_OUT} \
        --ts_out="service=grpc-web:${JS_OUT}" \
        -I={$PROTO_FILE_DIR} ${SERVER_TYPE}.proto
done