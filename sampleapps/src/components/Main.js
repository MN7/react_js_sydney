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
    const newarr = [...this.state.prevForms, newForm];
    this.setState({prevForms: newarr, showForm: newForm});
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
    this.setState({"loading": true})
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
            this.setState({"userinfo": ""});
            console.log("User login failed with message: "+json.message);
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({"userinfo": ""});
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
            <LoginAcct state={this.state} updateForm={nf=>this.updateForm(nf)} doLogin={u=>this.doLogin(u)} doLogout={()=>{this.setState({"userinfo": ""})}} />
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
