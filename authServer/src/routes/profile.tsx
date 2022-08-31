import React from "react";
import { Component } from "react";
import { Navigate } from "react-router-dom";
import Authentication from "../auth/grpcMethods";
import IUser from "../types/user";

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { accessToken: string }
}
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { accessToken: "" }
    };
  }

  // Redirect to /home in case not logged in.
  componentDidMount() {
    const currentUser = Authentication.getCurrentUser();
    console.log("\n\nuser: ", currentUser)

    // If user is not logged in, redirect him to /home
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.username}</strong> Profile
              </h3>
            </header>
            <p>
              {/* Remove later. Leave for testing purposes for now */}
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p>
            <p>
              <strong>Id:</strong>{" "}
              {currentUser.userID}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <p>
              <strong>Role:</strong>{" "}
              {currentUser.role}
            </p>
          </div> : null}
      </div>
    );
  }
}