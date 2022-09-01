# grpc-web-video-streaming

Video Streaming service built using grpc-web. Project itself was written on Windows 10

In my case, I placed protoc-gen-grpc-web in `C:\Users\justi\.local`.

Each microservice's documentation is written in their respected folders in `README.md`

Important to note, that depending on what grpc mode was defined when using protobuf, grpc-web will behave differently and may not having server or client side streaming
[Read more here](https://github.com/grpc/grpc-web#wire-format-mode)


### How this microservice works

There's 3 roles:
- regular user (USER)
- moderator (MOD) - has the ability to delete comments
- administrator (ADMIN) - has moderator's privileges. On top of that, can create other mods/admins and can upload videos.

The registration window has input control and will redirect user 2 seconds to login page after a successful registration. After logging in, the user will be redirected to its profile page.

The backend side additionally validates that input conforms to restrictions set on the frontend side.


### Get started (with HTTP 1.1)

Change directory into the root of the project
* `docker compose --env-file ./config/env/dev.env up`
* `npm install`
* `npm start` to start the Golang server and Webpack dev server
* Go to `http://127.0.0.1:8080/`

### Using HTTP2

***Work in progress, ignore this part***

HTTP2 requires TLS. This repository contains certificates in the `../misc` directory which are used by the server. You can optionally generate your own replacements using the `gen_cert.sh` in the same directory.
You will need to import the `../misc/localhostCA.pem` certificate authority into your browser, checking the "Trust this CA to identify websites" so that your browser trusts the localhost server.

<!-- * `docker compose --env-file ./config/env/prod.env up` -->
* `npm run start:tls` to start the Golang server and Webpack dev server with the certificates in `misc`
* Go to `https://localhost:8081`

### Generating proto files

Use `protogen.sh` locatd in the root of the project.

## Docker

### Running a single microservice

`.env` files are used to store all environment variables. They're only used to put values into docker-compose.yml. It has nothing to do with ENV, ARG. It’s exclusively a docker-compose.yml thing. Refer to config/*.env files for arguments when building the image.

First, change into the root directory of this project. The instructions below use `sqlServer` microservice for reference. Replace it as necessary.

The following command will build and run image `sqlserver` in an interactive environment.
Use the `--rm` argument to remove the container as well as all the data associated (will remove any volumes set in Dockerfile)
```
docker build -t sqlserver -f sqlServer/Dockerfile --build-arg POSTGRES_USER=postgres --build-arg POSTGRES_PASSWORD=example --build-arg POSTGRES_VERSION=14.4 --build-arg POSTGRES_PORT=5432 --build-arg POSTGRES_FULL_VERSION=14.4 --build-arg POSTGRES_MAJOR_VERSION=14  sqlServer
docker run --rm -it -p 5432:5432 --name postgreserver sqlserver
```

Refer to the following to [use volume from previous container](https://github.com/moby/moby/issues/30647#issuecomment-277048695)


##### Accessing postgresql database container

After starting the sqlserver container, run the following in a different terminal:
```
docker exec -it postgreserver bash
su - postgres
psql
```

##### Remove all previous volumes:

```
docker volume ls | awk '{print $2}' | xargs docker volume rm
```


### Common issues

##### protoc-gen-ts

If you get errors about protoc-gen-ts, make sure the node module is installed for that microservice (warnings can be ignored):
```
npm install -D ts-protoc-gen
```

##### /var/lib/postgresql/data is empty

This means that a database cluster hasn't been created. Make sure the mounted storage path is correct. For example, works with the following:
```
docker run --rm -it -e POSTGRES_PASSWORD=example -p 5432:5432 -v data:/var/lib/postgresql/data --name postgreserver postgres:14.4 bash
```

##### Accessing Docker volumes

Docker volumes are saved in the docker virtual machine. It can be accessed via docker desktop -> Volumes

##### postgresql is down

It's likely because the database cluster couldn't be initialised because /var/lib/postgresql/data wasn't empty. Remove the mounted volume "data" to fix.

If removing the mounted volume doesn't fix it, manually create clusters and initialise database
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
* https://docs.docker.com/engine/reference/builder/
* https://www.bezkoder.com/react-typescript-login-example/
* grpc headers: https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md