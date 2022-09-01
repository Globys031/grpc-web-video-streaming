# Google grpc-web generavimui, o ne improbable grpc-web generavimui. veliau perdaryt
# Ir likusi koda.
SERVER_TYPE=auth
SERVER=${SERVER_TYPE}Server
PROTO_FILE_DIR=".\\${SERVER}\\protos"
GO_OUT=".\\${SERVER}\\go"
JS_OUT=".\\${SERVER}\\src\\protoLibrary"
PROTOC_GEN_TS=".\\${SERVER}\\node_modules\\.bin\\protoc-gen-ts.cmd"
protoc \
        -I ${PROTO_FILE_DIR} ${SERVER_TYPE}.proto \
        --js_out="import_style=commonjs,binary:${JS_OUT}" \
        --grpc-web_out="import_style=typescript,mode=grpcweb:${JS_OUT}" \
        --go_out ${GO_OUT} \
        --go-grpc_out ${GO_OUT}




###### WARNING
# This part is for improbable's grpc-web implementation. Will be updated
# the same way as the above auth implemnetation in the future
for SERVER_TYPE in chat comment streaming
do
    SERVER=${SERVER_TYPE}Server
    PROTO_FILE_DIR=".\\${SERVER}\\protos"
    GO_OUT=".\\${SERVER}\\go" # go_package in .proto file adds additional child directory it will be output to
    JS_OUT=".\\${SERVER}\\ts\\protoLibrary" # Note that the directory has to be already created (unlike with go)
    PROTOC_GEN_TS=".\\${SERVER}\\node_modules\\.bin\\protoc-gen-ts.cmd"
    protoc \
        --plugin="protoc-gen-ts=${PROTOC_GEN_TS}" \
        -I ${PROTO_FILE_DIR} \
        --js_out="import_style=commonjs,binary:${JS_OUT}" \
        --go_out ${GO_OUT} \
        --go-grpc_out ${GO_OUT} \
        --ts_out="service=grpc-web:${JS_OUT}" \
        -I={$PROTO_FILE_DIR} ${SERVER_TYPE}.proto
done




