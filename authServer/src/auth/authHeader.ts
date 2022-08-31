// For when a user needs to access a protected resource

import { Metadata } from "grpc-web";

export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) {
    user = JSON.parse(userStr);
  }


  const metadata = {} as Metadata;
  metadata["test"] = "test"
  metadata["test2"] = "test"
  // const metadata = new Headers();
  if (user && user.accessToken) {
    // https://stackoverflow.com/questions/69948951/is-token-based-authentication-for-grpc-adds-metadata-for-each-call
    metadata["custom-auth-header"] = user.accessToken

    // return { Authorization: 'Bearer ' + user.accessToken };
    // return {'custom-auth-header': user.accessToken};
    // metadata.append('custom-auth-header', user.accessToken);
  } else {
    metadata["custom-auth-header"] = ""

    // return { Authorization: '' };
    // return {'custom-auth-header': ""};
    // metadata.append('custom-auth-header', "");
  }
  return metadata;
}