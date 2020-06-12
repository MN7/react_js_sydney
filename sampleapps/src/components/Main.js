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
    if (this.state.hasOwnProperty("username") && this.state.username.length>0) {
      newForm = "Account";
    } else {
      this.setState({username: ""});
      newForm = "Login";
    }
    this.updateForm(newForm);
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
            <LoginAcct state={this.state} updateForm={nf=>this.updateForm(nf)} />
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
