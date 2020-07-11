import React from 'react';
import { Button, TextField } from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';


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
      token: ""
    }
  }

// componentWillUnmount(){console.log("LogIn will unmount");}
// componentDidMount(){console.log("LogIn has mounted");}

  clearState = () => {
    this.setState({ username: "", email: "", password: "", confirmp: "",
      err_username: "", err_email: "", err_password: "", err_confirmp: "", token: ""})
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {

    const {username, email, password, confirmp} = this.state;
    const {err_username, err_email, err_password, err_confirmp} = this.state;
    const updateForm = this.props.updateForm;

    const showSimpleLogin =
      <div className="LoginInfo">
        <div className="LItext">
          <TextField className="GenericInput" type="text" placeholder="Enter Username" value={username}
            helperText={err_username} error={err_username}
            name="username" required autoComplete="current-username" onChange={e => this.onChange(e)} />
          <TextField className="GenericInput" type="password" placeholder="Enter Password" value={password}
            helperText={err_password} error={err_password}
            name="password" required autoComplete="current-password" onChange={e => this.onChange(e)} />
        </div>
        <div className="LIbuttons">
          <Button variant="contained" color="primary" endIcon={<Icon>done</Icon>} size="small"
             type="submit">Login</Button>
           <Button variant="contained" color="default" endIcon={<Icon>cancel</Icon>} size="small"
            type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
        </div>
        <div className="LIbuttons">
          <Button variant="contained" color="default" endIcon={<Icon>add</Icon>} size="small"
            type="button"
            onClick={()=>{
              this.clearState();
              updateForm("NewUser");
            }}>
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
          helperText={err_username} error={err_username}
          name="username" required autoComplete="current-username" onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="text" placeholder="Enter Email to verify" value={email}
          helperText={err_email} error={err_email}
          name="email" required autoComplete="current-email" onChange={e => this.onChange(e)} />
      </div>
      <div className="LItext">
        <TextField className="GenericInput" type="new-password" placeholder="Enter Password" value={password}
          helperText={err_password} error={err_password}
          name="password" required autoComplete="new-password" onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="new-password" placeholder="Confirm Password" value={confirmp}
          helperText={err_confirmp} error={err_confirmp}
          name="confirmp" required onChange={e => this.onChange(e)} />
      </div>
      <div className="LIbuttons">
        <Button variant="contained" color="primary" endIcon={<Icon>add</Icon>} size="small"
          type="submit">Create</Button>
        <Button variant="contained" color="secondary" endIcon={<Icon>cancel</Icon>} size="small"
          type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
      </div>
    </div>
    ;

    const showUserInfo =
    <div className="LoginInfo">
      <div className="LItext">
        <TextField className="GenericInput" type="text" placeholder={username} value={username}
          helperText={err_username} error={err_username}
          name="username" autoComplete="on" onChange={e => this.onChange(e)} />
        <label className="GenericInput">{email}</label>
        <TextField className="GenericInput" type="password" placeholder="Optional - New Password" value={password}
          helperText={err_password} error={err_password}
          name="password" required onChange={e => this.onChange(e)} />
        <TextField className="GenericInput" type="password" placeholder="If New Password, re-enter" value={confirmp}
          helperText={err_confirmp} error={err_confirmp}
          name="confirmp" required onChange={e => this.onChange(e)} />
      </div>
      <div className="LIbuttons">
        <Button variant="contained" color="primary" endIcon={<SaveIcon />} size="small"
          type="submit">Save Changes</Button>
        <Button variant="contained" color="default" endIcon={<Icon>cancel</Icon>} size="small"
          type="button" onClick={()=>updateForm("Main")} >Cancel</Button>
        <Button variant="contained" color="secondary" endIcon={<Icon>cancel</Icon>} size="small"
          type="button">Log Out</Button>
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
