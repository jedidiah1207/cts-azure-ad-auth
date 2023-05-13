import logo from "./logo.svg";
import "./App.css";
import { config } from "./Config";
import { PublicClientApplication } from "@azure/msal-browser";
import { Component } from "react";
import axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isAuthenticated: false,
      user: {},
    };
    this.login = this.login.bind(this);
    //Initialize the MSAL Applicaation object
    this.PublicClientApplication = new PublicClientApplication({
      auth: {
        clientId: config.appId,
        redirectUri: config.redirectUri,
        authority: config.authority,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      },
    });
  }
  async login() {
    try {
      //login via popup
      await this.PublicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      this.setState({ isAuthenticated: true });
    } catch (err) {
      this.setState({
        isAuthenticated: false,
        user: {},
        error: err,
      });
    }
    const keys = Object.keys(sessionStorage);
    const token = window.sessionStorage.getItem(keys[0]);
    console.log(token);
    axios
      .post(
        `http://localhost:8080/secretParams?token=${token.secret}`,
        JSON.parse(token),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // logout() {
  //   this.PublicClientApplication.logout();
  // }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.isAuthenticated ? (
            <p>Succesfully Logged In</p>
          ) : (
            <p>
              <button onClick={() => this.login()}>Login</button>
            </p>
          )}
        </header>
      </div>
    );
  }
}

export default App;
