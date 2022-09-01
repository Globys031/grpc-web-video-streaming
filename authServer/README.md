## Starting the project separately

Needs 3 terminals and have docker desktop started.
```
cd grpc-web-video-streaming
docker run --rm -it -p 5432:5432 --name postgreserver sqlserver
go run authServer/go/main.go

cd grpc-web-video-streaming/authServer
npm start
```

### Using postgresql container database

```
list databases: \l
connect to database: \c auth_svc
list tables: \dt
list table data: SELECT * FROM users;
```

## Improbable grpc-web doesn't support deadlines

improbable-eng grpc-web implementation does not support timeouts/deadlines. [Read more here](https://github.com/improbable-eng/ts-protoc-gen/issues/113) [and here](https://grpc.io/blog/state-of-grpc-web/).

I've moved over to google's grpc-web version to avoid this. The following are of importance:
[https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase.js](https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase.js)
[https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78](https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78)

The following is in case for whatever reason I'll need to move back over to improbable's grpc implementation:
```
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
        --go-grpc_out ${GO_OUT} \
```



## Vscode debug mode

launch.json:
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:8082/login",
      "webRoot": "${workspaceFolder}/authServer"
    }
  ]
}
```

## References

- https://www.bezkoder.com/react-typescript-login-example/
- https://github.com/grpc/grpc-web#typescript-support
- https://www.npmjs.com/package/bootstrap/v/4.6.0
- https://formik.org/docs/guides/validation
- https://github.com/jquense/yup
- https://medium.com/@apzuk3/input-validation-in-golang-bc24cdec1835
- https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context

react-bootstrap is just bootstrap made into react components
- https://getbootstrap.com/
- https://react-bootstrap.github.io/getting-started/introduction

Because of that, these are equivalent:
```html
                <div className="btn-group">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {/* <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" hidden={notAdmin}> */}
                    Choose user type
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/">Regular user</a></li>
                    <li><a className="dropdown-item" href="/">moderator</a></li>
                    <li><a className="dropdown-item" href="/">administrator</a></li>
                  </ul>
                </div>
```

```jsx
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Dropdown Button
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Regular user</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">moderator</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">administrator</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
```