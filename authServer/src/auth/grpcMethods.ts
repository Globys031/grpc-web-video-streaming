// For JWT handling

import {AuthServiceClient} from "../protoLibrary/AuthServiceClientPb";
import * as library from "../protoLibrary/auth_pb";

import authHeaders from "./authHeader";

const host = process.env.REACT_APP_USE_TLS ? "http://127.0.0.1:" + process.env.REACT_APP_AUTH_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_AUTH_BACKEND_SSL_PORT;

class Authentication {
  // POST {username, password} & save JWT to Local Storage
  async login(username: string, password: string) : Promise<[number, string]> {
    const client = new AuthServiceClient(host)
    const loginRequest = new library.LoginRequest();
    loginRequest.setUsername(username);
    loginRequest.setPassword(password);

    let metadata = authHeaders()

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 5);
    // https://github.com/grpc/grpc-web/pull/1063/files
    // The "deadline" header is used to timeout xhr http request
    // and it converts deadline header to "grpc-timeout" header.
    // Making it so that the server also check for when it should timeou
    // example:
    // https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78
    metadata["deadline"] = deadline.getTime().toString()

    // let loginResponse : library.LoginResponse;
    let [responseStatus, responseError] = [400, "something went wrong"]

    // gRPC makes calls asynchronously in javascript.
    // client.login needs a promise wrapper to force the client to wait 
    // before running the function return statement
    //
    // https://stackoverflow.com/questions/63635233/how-to-use-async-await-pattern-with-grpc-web
    // Without the catch statement, the app gets stuck at react-dom/cjs/react-dom.development.js
    // while (parent !== null) {
    try {
      // response = await new Promise((resolve, reject) => client.login(
      await new Promise((resolve, reject) => client.login(
        loginRequest, 
        metadata,
        (err, response) => {
          if (err) { // Will return an error if message is null
            console.log(new Error(err.code + "\n" + err.message));

            [responseStatus, responseError] = [err.code, err.message]
            return reject(err.message)
          } else {
            if (response?.getStatus() > 199 && response?.getStatus() < 300) {
              localStorage.setItem("user", JSON.stringify(response));
              console.log(localStorage.getItem("user"))
            }
            [responseStatus, responseError] = [response.getStatus(), response.getError()]
            resolve(response as library.LoginResponse)
          }
          console.log("login.onEnd.message", response);
        }
        ));
    } catch (error) {
      // Error already handled in "if (err)"
      // Catch statement is necessary to avoid infinite loop after rejection
    }
    return [responseStatus, responseError]
  }


  // remove JWT from Local Storage
  logout() {
    localStorage.removeItem("user");
    // pretty sure kad reiketu istrint ir is serverio puses though
  }

  // POST {username, email, password}
  async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
    const client = new AuthServiceClient(host)
    const registerRequest = new library.RegisterRequest();
    registerRequest.setUsername(username);
    registerRequest.setEmail(email);
    registerRequest.setPassword(password);
    registerRequest.setRole(role);

    let metadata = authHeaders()

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 5);
    // https://github.com/grpc/grpc-web/pull/1063/files
    // The "deadline" header is used to timeout xhr http request
    // and it converts deadline header to "grpc-timeout" header.
    // Making it so that the server also check for when it should timeou
    // example:
    // https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78
    metadata["deadline"] = deadline.getTime().toString()

    // Register user and attempt to login right away
    // Return response in a way that makes it clear if an error comes from
    // login, registration server side or if it's a client side error.
    let [responseStatus, responseError] = [400, "something went wrong"]
    try {
      await new Promise((resolve, reject) => client.register(
        registerRequest, 
        metadata,
        async (err, response) => {
          if (err) {
            console.log(new Error(err.code + "\n" + err.message));

            [responseStatus, responseError] = [err.code, err.message]
            return reject(err.message)
          } else {
            [responseStatus, responseError] = [response.getStatus(), response.getError()]
            resolve(response as library.RegisterResponse)
          }
          console.log("register.onEnd.message", response);
        }
        ));
    } catch (error) {
      // Error already handled in "if (err)"
      // Catch statement is necessary to avoid infinite loop after rejection
    }
    return [responseStatus, responseError]
  }
  
  // get stored user information (including JWT)
  getCurrentUser() {
    const userStr = localStorage.getItem("user");

    // If userStr isn't empty or null
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new Authentication();