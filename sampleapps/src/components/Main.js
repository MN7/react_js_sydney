import React, { Component } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';
import MyAppsList from './MyAppsList';
import LoginAcct from './LoginAcct';


export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showForm: "Main",
      prevForms: [],
      loading: false
    };
  }

  updateForm = newForm => {
    if (newForm === "prev") {
      const prevForm = this.state.prevForms.pop();
      this.setState({showForm: prevForm});
    } else {
      const newarr = [...this.state.prevForms, newForm];
      this.setState({prevForms: newarr, showForm: newForm});
    }
  }

  userLogin = () => {
    let newForm="";
    if (this.state.hasOwnProperty("userinfo") && this.state.userinfo.hasOwnProperty("username") && this.state.userinfo.username.length>0) {
      newForm = "Account";
    } else {
      newForm = "Login";
    }
    this.updateForm(newForm);
  }

  doLogin = async (user) => {
    this.setState({"loading": true});
    let tmptoken="";
    fetch( "./api/v1/user/login", {
          method: "POST", headers: { "Content-Type" : "application/json" },
          body: JSON.stringify({"email": user.email, "password": user.password})
        })
        .then(res => {
          this.setState({"loading": false});
          tmptoken=res.headers.get('auth-token');
          return res.json();
        })
        .then(json => {
          if (json.success) {
            const uinfo={"username":json.username, "email":json.email, "token":tmptoken, "uid":json.id}
            this.setState({"userinfo": uinfo});
            console.log("User login successful. Result: "+JSON.stringify(json));
            this.updateForm("Main"); // on successful log-in display the Main/home page.
          } else {
            user.handleError([{elt:"err_username",msg:json.message},{elt:"err_password",msg:json.message}]);
            console.log("User login failed with message: "+json.message);
          }
        })
        .catch(err => {
          user.handleError([{elt:"err_username",msg:err},{elt:"err_password",msg:err}]);
          console.log(err);
        })
        ;
  }

  doRegister = async (user) => {
    this.setState({"loading":true});
    let tmptoken="";
    fetch("./api/v1/user/register", {
      method: "POST", headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"email": user.email, "password": user.password, "username": user.username, "confirmemail": false})
    })
    .then(res => {
      this.setState({"loading": false});
      tmptoken=res.headers.get('auth-token');
      return res.json();
    })
    .then(json => {
      if (json.success) {
        const uinfo={"username":json.username, "email":json.email, "token":tmptoken, "uid":json.id}
        this.setState({"userinfo": uinfo});
        console.log("User registration successful. Result: "+JSON.stringify(json));
        this.updateForm("Main"); // on successful log-in display the Main/home page.
      } else {
        user.handleError([{elt: json.message.startsWith("User")?"err_username":"err_email",msg:json.message}]);
        console.log("User registration failed with message: "+json.message);
      }
    })
    .catch(err => {
      user.handleError([{elt:"err_username",msg:err},{elt:"err_email",msg:err}]);
      console.log(err);
    })
    ;
  }

  doUpdateUser = async (user) => {
    this.setState({"loading":true});
    let tmptoken="";
    fetch("./api/v1/user/update", {
      method: "POST", headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"email": user.email, "password": user.password, "username": user.username})
    })
    .then(res => {
      this.setState({"loading": false});
      tmptoken=res.headers.get('auth-token');
      return res.json();
    })
    .then(json => {
      if (json.success) {
        const uinfo={"username":json.username, "email":json.email, "token":tmptoken, "uid":json.id}
        this.setState({"userinfo": uinfo});
        console.log("User update successful. Result: "+JSON.stringify(json));
        user.handleAlert("User information has been updated!");
      } else {
        user.handleError([{elt: json.message.startsWith("User")?"err_username":"err_email",msg:json.message}]);
        console.log("User update failed with message: "+json.message);
      }
    })
    .catch(err => {
      user.handleError([{elt:"err_username",msg:err},{elt:"err_email",msg:err}]);
      console.log(err);
    })
    ;
  }

  render() {
      switch (this.state.showForm) {
        case "Main": return(
          <form className="MainForm">
            <Header txt="Select Sample App" styl="Main-header" state={this.state} userLogin={() => this.userLogin()}/>
            <MyAppsList state={this.state} />
            <Footer txt="" styl="Main-footer" state={this.state}/>
          </form>
        );
        case "Login":
        case "Account":
        case "NewUser":
        const hdrtxt = this.state.showForm === "Login"? "User Login" : this.state.showForm === "NewUser" ? "User Registration" : "User Account Information";
        return(
          <form className="LoginForm">
            <Header txt={hdrtxt} styl="Form-header" state={this.state} userLogin={() => this.userLogin()}/>
            <LoginAcct state={this.state} updateForm={nf=>this.updateForm(nf)}
              doLogin={u=>this.doLogin(u)} doLogout={()=>{this.setState({"userinfo": ""})}}
              doRegister={u=>this.doRegister(u)} doUpdateUser={u=>this.doUpdateUser(u)}
              />
            <Footer txt="" styl="Main-footer" state={this.state}/>
          </form>
        );
        default: return(
          <form className="MainForm">
            <Header txt="Select Sample App" styl="Main-header" state={this.state} userLogin={() => this.userLogin()}/>
            <Footer txt="" styl="Main-footer" state={this.state}/>
          </form>
        );
      }
  }
}
