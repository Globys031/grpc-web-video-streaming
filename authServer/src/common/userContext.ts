import React from 'react';
import User from "../protoLibrary/auth_pb";

// https://www.digitalocean.com/community/tutorials/react-manage-user-login-react-context
// https://reactjs.org/docs/context.html#when-to-use-context
const userContext = React.createContext<User.User | null>(null);

export { userContext };