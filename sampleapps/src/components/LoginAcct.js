import React from 'react';

export default class LoginAcct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmp: "",
      token: ""
    }
  }

// componentWillUnmount(){console.log("LogIn will unmount");}
// componentDidMount(){console.log("LogIn has mounted");}

  clearState = () => {
    this.setState({ username: "", email: "", password: "", confirmp: "", token: ""})
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {

    const {username, email, password, confirmp} = this.state;
    const updateForm = this.props.updateForm;

    const showSimpleLogin =
      <div className="LoginInfo">
        <div className="LItext">
          <input className="GenericInput" type="text" placeholder="Enter Username" value={username}
            name="username" required autoComplete="on" onChange={e => this.onChange(e)} />
          <input className="GenericInput" type="password" placeholder="Enter Password" value={password}
            name="password" required autoComplete="on" onChange={e => this.onChange(e)} />
        </div>
        <div className="LIbuttons">
          <button className="GenericButton" type="submit">Login</button>
          <button className="GenericButton" type="button" onClick={()=>updateForm("Main")} >Cancel</button>
        </div>
        <div className="LIbuttons">
          <button className="GenericButton" type="button"
            onClick={()=>{
              this.clearState();
              updateForm("NewUser");
            }}>
            New User
            </button>
          <button className="GenericButton" type="button">Reset</button>
        </div>
      </div>
    ;

    const showNewUser =
    <div className="LoginInfo">
      <div className="LItext">
        <input className="GenericInput" type="text" placeholder="Enter Username" value={username}
          name="username" required autoComplete="on" onChange={e => this.onChange(e)} />
        <input className="GenericInput" type="text" placeholder="Enter Email to verify" value={email}
          name="email" required autoComplete="on" onChange={e => this.onChange(e)} />
        <input className="GenericInput" type="new-password" placeholder="Enter Password" value={password}
          name="password" required autoComplete="on" onChange={e => this.onChange(e)} />
        <input className="GenericInput" type="new-password" placeholder="Confirm Password" value={confirmp}
          name="confirmp" required onChange={e => this.onChange(e)} />
      </div>
      <div className="LIbuttons">
        <button className="GenericButton" type="submit">Create</button>
        <button className="GenericButton" type="button" onClick={()=>updateForm("Main")} >Cancel</button>
      </div>
    </div>
    ;

    const showUserInfo =
    <div className="LoginInfo">
      <div className="LItext">
        <input className="GenericInput" type="text" placeholder={username} value={username}
          name="username" autoComplete="on" onChange={e => this.onChange(e)} />
        <label className="GenericInput">{email}</label>
        <input className="GenericInput" type="password" placeholder="Optional - New Password" value={password}
          name="password" required onChange={e => this.onChange(e)} />
        <input className="GenericInput" type="password" placeholder="If New Password, re-enter" value={confirmp}
          name="confirmp" required onChange={e => this.onChange(e)} />
      </div>
      <div className="LIbuttons">
        <button className="GenericButton" type="submit">Save Changes</button>
        <button className="GenericButton" type="button" onClick={()=>updateForm("Main")} >Cancel</button>
        <button className="GenericButton" type="button">Log Out</button>
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
