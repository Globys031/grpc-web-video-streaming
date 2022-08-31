// https://create-react-app.dev/docs/adding-custom-environment-variables/
// here is also a built-in environment variable called NODE_ENV that's used
// to find whether the app is in production or development mode

// https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5
// It’s common practice to use the original .env file for your production build
// React-scripts will use either .env or .env.development depending on which start script was used


// The entrypoint is index.tsx, but this is where
// all of the app logic resides.

// The navbar dynamically changes by login status and current User’s roles:
// * Home: always
// * Login & Sign Up: if user hasn’t signed in yet
// * User: AuthService.getCurrentUser() returns a value
// * Board Moderator: roles includes ROLE_MODERATOR
// * Board Admin: roles includes ROLE_ADMIN

import {Component} from "react";
import { Routes, Route, Link } from "react-router-dom";

// https://react-bootstrap.github.io/getting-started/introduction#stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
// import { Button, Dropdown } from 'react-bootstrap';
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./app.css";

import AuthService from "./auth/grpcMethods";
import IUser from './types/user';

import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";

import Home from "./routes/home";

import BoardUser from "./roles/user";
import BoardModerator from "./roles/moderator";
import BoardAdmin from "./roles/admin";

import EventBus from "./common/eventBus";

// // // // for environment variables
// // import path from "path";
// import * as dotenv from "dotenv";
// // dotenv.config({ path: path.resolve(__dirname, "../../config/env/dev.env") });
// dotenv.config()
// // require('dotenv').config({ path: path.resolve(__dirname, "../../config/env/dev.env") })
// // process.env.

type Props = {};

type State = {
  showModeratorBoard: boolean,
  showAdminBoard: boolean,
  currentUser: IUser | undefined,
  hasError: boolean,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      hasError: false,
    };
  }

  // https://reactjs.org/docs/react-component.html#componentdidmount
  // componentDidMount() is invoked immediately after
  // a component is mounted (inserted into the tree).
  //
  // If user is connected, get all of its login details
  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.role === "MODERATOR",
        showAdminBoard: user.role === "ADMIN",
      });
    }
    // Setup an event listener for the "logout" event.
    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);

    // patikrinau kad sitas panaikins localstorage jeigu
    // isjungsi sena tab'a. Kas nera gerai. Noriu kad istrintu isjungus is serverio puses programa
    localStorage.clear();
  }

  // For error handling
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    if (this.state.hasError) {
      return <div>Couldn't load app UI</div>;
    }
    return (
      <div>
        
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

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
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

        <div className="container mt-3">
          {/* https://reactrouter.com/docs/en/v6/components/routes */}
          <Routes>
            {/* https://reactrouter.com/docs/en/v6/upgrading/v5
            all paths match exactly by default. If you want to match more of 
            the URL because you have child routes use 
            a trailing * as in <Route path="users/*">. */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/*" element={<BoardUser />} />
            <Route path="/mod/*" element={<BoardModerator />} />
            <Route path="/admin/*" element={<BoardAdmin />} />
          </Routes>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;