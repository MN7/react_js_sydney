import React from 'react';
import { Button, TextField } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

let my_RECAPTCHA_SITE_KEY="";

export default class LoginAcct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmp: "",
      err_username: "",
      err_email: "",
      err_password: "",
      err_confirmp: "",
      alertMessage: "",
      recaptchaDone: false,
      token: ""
    }
  }

// componentWillUnmount(){console.log("LogIn will unmount");}
  componentDidMount(){
    const ps=this.props.state;
    my_RECAPTCHA_SITE_KEY=ps.grecapkey;
    console.log("LogIn has mounted with parent-state: "+JSON.stringify(ps));
    if (ps.hasOwnProperty("userinfo")) {
      if (ps.userinfo.hasOwnProperty("username")) {this.setState({"username": ps.userinfo.username});}
      if (ps.userinfo.hasOwnProperty("email")) {this.setState({"email": ps.userinfo.email});}
    }

    const notLoaded = document.getElementById("grecaptcha001") == null;
    console.log("state.recaptchaDone: "+this.state.recaptchaDone+" notLoaded: "+notLoaded);

    if (!this.setState.recaptchaDone && notLoaded) {
      const script = document.createElement("script");
      const gr_url="https://www.google.com/recaptcha/api.js?render="+my_RECAPTCHA_SITE_KEY;
      // const gr_url="https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.src = gr_url;
      script.id="grecaptcha001";
      document.body.appendChild(script);
    }
  }

  handleError = (objArr) => {
    let ns ={};
    let nr = objArr.map((o) => {return ns[o.elt]=o.msg});
    if (nr) nr=null; // to avoid "warning" that nr is not used.
    this.setState(ns);

    // for (let i = 0; i < objArr.length; i++) {
    //   this.setState({[objArr[i].elt]:objArr[i].msg});
    // }
  }

  handleAlert = (msg) => {
    this.setState({"alertMessage":msg});
    setTimeout(()=>this.setState({"alertMessage":""}), 2500);
  }

  clearState = () => {
    this.setState({ username: "", email: "", password: "", confirmp: "", alertMessage: "", recaptchaDone: false,
      err_username: "", err_email: "", err_password: "", err_confirmp: "", token: ""})
  }

  clearError = () => {
    this.setState({ err_username: "", err_email: "", err_password: "", err_confirmp: "", token: ""});
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  validate = (email, password, e) => {
    e.preventDefault();
    this.clearError();
    const onSuccess = (token) => {
      if (token) {
        this.setState({"recaptchaDone":true});
        this.props.doLogin({"email":email,"password":password,"handleError":(o)=>this.handleError(o),"captchaToken":token});
      }
    }
    if (email.length>0 && password.length>0) {
      // this.props.doLogin({"email":email,"password":password,"handleError":(o)=>this.handleError(o)});
      window.grecaptcha.ready(function() {
        window.grecaptcha.execute(my_RECAPTCHA_SITE_KEY, {action: 'submit'})
        .then(function(token) {
            // Add your logic to submit to your backend server here.
            onSuccess(token);
        }, onSuccess);
      }, onSuccess);
    } else {
      this.setState({err_username: "Username or password blank or invalid",
                     err_password: "Username or password blank or invalid"})
    }
  }

  validateNewUser = (username, email, password, confirmp, e) => {
    e.preventDefault();
    this.clearError();
    if (confirmp === password && password.length>0) {
      if (email.length>0 && username.length>0) {
        // do further validation of email. Enforce user-name restrictions. Enforce minimum password complexities here.
        this.props.doRegister({"username":username, "email":email, "password":password,"handleError":(o)=>this.handleError(o)});
      } else {
        username.length?this.setState({err_email: "Email blank or invalid"})
                    :this.setState({err_username: "Username blank or invalid"})
      }
    } else {
      this.setState({err_confirmp: "Confirm password does not match."});
    }
  }

  validateUpdateUser = (username, email, password, confirmp, e) => {
    e.preventDefault();
    this.clearError();
    if (confirmp === password) {
      if (email.length>0 && username.length>0) {
        // do further validation of email. Enforce user-name restrictions. Enforce minimum password complexities here.
        this.props.doUpdateUser({"username":username, "email":email, "password":password,
                  "handleError":(o)=>this.handleError(o), "handleAlert":(msg)=>this.handleAlert(msg)});
      } else {
        username.length?this.setState({err_email: "Email blank or invalid"})
                      :this.setState({err_username: "Username blank or invalid"})
      }
    } else {
      this.setState({err_confirmp: "Confirm password does not match."});
    }
  }

  render() {

    let {username, email, password, confirmp} = this.state;
    const {err_username, err_email, err_password, err_confirmp} = this.state;
    my_RECAPTCHA_SITE_KEY =  "6LdsAbMZAAAAAEr8d6HAYwzISGfLFRUDnXRDdlk2";
    const updateForm = this.props.updateForm;
    const doLogout = this.props.doLogout;

    const showSimpleLogin =
      <div className="LoginInfo">
        <div className="LItext">
          <TextField className="GenericInput" type="text" placeholder="Enter Username" value={username}
            helperText={err_username} error={err_username.length>0}
            name="username" required autoComplete="current-username" onChange={e => this.onChange(e)} />
          <TextField className="GenericInput" type="password" placeholder="Enter Password" value={password}
            helperText={err_password} error={err_password.length>0}
            name="password" required autoComplete="current-password" onChange={e => this.onChange(e)} />
        </div>
        <div className="LIbuttons">
          <Button
             variant="contained" color="primary" endIcon={<Icon>done</Icon>} size="small"
             type="submit" onClick={(e)=>this.validate(username, password,e)}>
             Login
           </Button>
           <Button variant="contained" color="default" endIcon={<Icon>cancel</Icon>} size="small"
            type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
        </div>
        <div className="LIbuttons">
          <Button variant="contained" color="default" endIcon={<Icon>add</Icon>} size="small"
            type="button"onClick={()=>{this.clearState();updateForm("NewUser");}}>
            New User
          </Button>
          <Button variant="contained" color="secondary" endIcon={<Icon>send</Icon>} size="small"
            type="button">Reset</Button>
        </div>
      </div>
    ;

    const showNewUser =
    <div className="LoginInfo">
      <div className="LItext">
        <TextField className="GenericInput" type="text" placeholder="Enter Username" value={username}
          helperText={err_username} error={err_username.length>0}
          name="username" required autoComplete="current-username" onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="text" placeholder="Enter Email to verify" value={email}
          helperText={err_email} error={err_email.length>0}
          name="email" required autoComplete="current-email" onChange={e => this.onChange(e)} />
      </div>
      <div className="LItext">
        <TextField className="GenericInput" type="password" placeholder="Enter Password" value={password}
          helperText={err_password} error={err_password.length>0}
          name="password" required autoComplete="new-password" onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="password" placeholder="Confirm Password" value={confirmp}
          helperText={err_confirmp} error={err_confirmp.length>0}
          name="confirmp" required onChange={e => this.onChange(e)} />
      </div>
      <div className="LIbuttons">
        <Button variant="contained" color="primary" endIcon={<Icon>add</Icon>} size="small"
          type="submit" onClick={(e)=>this.validateNewUser(username, email, password, confirmp, e)}>
          Create
        </Button>
        <Button variant="contained" color="secondary" endIcon={<Icon>cancel</Icon>} size="small"
          type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
      </div>
    </div>
    ;

    const alertMessage = this.state.alertMessage.length?
          <div className="alertMessage"><p>{this.state.alertMessage}</p></div>
          :null ;
    const showUserInfo =
    <div className="LoginInfo">
      <div className="LItext">
        <TextField className="GenericInput" type="text" placeholder={username} value={username}
          helperText={err_username} error={err_username.length>0}
          name="username" autoComplete="on" onChange={e => this.onChange(e)} />
        <label className="GenericInput">{email}</label>
        <TextField className="GenericInput" type="password" placeholder="Optional - New Password" value={password}
          helperText={err_password} error={err_password.length>0}
          name="password" required autoComplete="new-password" onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="password" placeholder="If New Password, re-enter" value={confirmp}
          helperText={err_confirmp} error={err_confirmp.length>0}
          name="confirmp" required autoComplete="new-password" onChange={e => this.onChange(e)} />
        {alertMessage}
      </div>
      <div className="LIbuttons">
        <Button variant="contained" color="primary" endIcon={<SaveIcon />} size="small"
          type="submit" onClick={(e)=>this.validateUpdateUser(username, email, password, confirmp, e)}>
          Save Changes
        </Button>
        <Button variant="contained" color="default" endIcon={<Icon>cancel</Icon>} size="small"
          type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
        <Button variant="contained" color="secondary" endIcon={<Icon>cancel</Icon>} size="small"
          type="button" onClick={()=>{this.clearState(); doLogout(); updateForm("Main");}}>
          Log Out
        </Button>
      </div>
    </div>
    ;


    switch (this.props.state.showForm) {
      case "Login": return showSimpleLogin;
      case "NewUser": return showNewUser;
      case "Account": return showUserInfo;
      default: return;
    }
  }


}
