// https://create-react-app.dev/docs/adding-custom-environment-variables/
// here is also a built-in environment variable called NODE_ENV that's used
// to find whether the app is in production or development mode

// https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5
// It’s common practice to use the original .env file for your production build
// React-scripts will use either .env or .env.development depending on which start script was used


// The entrypoint is index.tsx, but this is where
// all of the app logic resides.

import {Component} from "react";
import { Routes, Route, Link } from "react-router-dom";

// https://react-bootstrap.github.io/getting-started/introduction#stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from 'react-bootstrap';
import "./app.css";

import Authentication from "./auth/grpcMethods";

import User from "./protoLibrary/auth_pb";

import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import PageNotFound from "./routes/404";
import Home from "./routes/home";

import EventBus from "./common/eventBus";
import Storage from "./common/storage";
import {userContext} from './common/userContext';

// // // // for environment variables
// // import path from "path";
// import * as dotenv from "dotenv";
// // dotenv.config({ path: path.resolve(__dirname, "../../config/env/dev.env") });
// dotenv.config()
// // require('dotenv').config({ path: path.resolve(__dirname, "../../config/env/dev.env") })
// // process.env.

type Props = {};

type State = {
  user: User.User | null,
  isMod: boolean,
  isAdmin: boolean,
  hasError: boolean,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    // Sets user info in constructor for when page gets reloaded after login
    const currentUser = Storage.getCurrentUserInfo();
    if (currentUser) {
      // Should not use setState in the constructor since the component is not mounted yet
      // Instead, initialize the state directly
      this.state = {
        user: currentUser,
        isMod: currentUser.getRole() === "MOD",
        isAdmin: currentUser.getRole() === "ADMIN",
        hasError: false,
      }
    } else {
      this.state = {
        user: currentUser,
        isMod: false,
        isAdmin: false,
        hasError: false,
      };
    }
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // componentDidMount() is invoked immediately after
  // a component is mounted (inserted into the tree).
  componentDidMount() {
    // Setup an event listener for the "logout" event.
    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);

    // patikrinau kad sitas panaikins localstorage jeigu
    // isjungsi sena tab'a.
    localStorage.clear();
  }

  // For error handling https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  async logOut() {
    await Authentication.logout();
    this.setState({
      isMod: false,
      isAdmin: false,
      user: null,
    });
  }

  render() {
    const { user, isAdmin } = this.state;
    if (this.state.hasError) {
      return <div>Couldn't load app UI</div>;
    }

    return (
      <div>
        <div>
        </div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            root
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
  
          </div>

          {/* Also show "sign up" if current user is an admin */}
          {user ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Welcome, {user.getUsername()}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="/settings">Settings (not yet implemented)</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              {isAdmin && (
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
              )}

              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        {/* Depending on whether user is logged in or not,
        it will get a 404 page when trying to access certain resources that
        would otherwise be available */}
        <div className="container mt-3">
          {/* https://reactrouter.com/docs/en/v6/components/routes */}
          {user ? (
            <Routes>
              {/* https://reactrouter.com/docs/en/v6/upgrading/v5
              If you want to match more of the URL because you have child routes use 
              a trailing * as in <Route path="users/*">. */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              {/* if logged in, only show registration page for admin user */}
              {isAdmin && (
                <Route path="/register" element={<Register />} />
              )}
              <userContext.Provider value={this.state.user}>
                <Route path="/profile" element={<Profile />} />
              </userContext.Provider>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          )}
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;