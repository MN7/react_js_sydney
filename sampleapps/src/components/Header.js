import React from 'react';

export default function Header (props) {

  const hdrtxt = props.hasOwnProperty("txt") ? props.txt : "No Header text for form";
  const hdrstyle = props.hasOwnProperty("styl") ? props.styl : {};
  const appstate = props.hasOwnProperty("state") ? props.state : {};
  const showloginbtn = appstate.hasOwnProperty("showForm") &&
          !(["Account","Login","NewUser"].includes(appstate.showForm));
  const logintext = appstate.hasOwnProperty("userinfo") && appstate.userinfo.hasOwnProperty("username")
                    && appstate.userinfo.username.length>0 ? appstate.userinfo.username : "Log In / Sign Up";
  const login = <input className="Login-btn" type="button"
    value={logintext}
    onClick={() => props.userLogin()}
    />

  return (
    <div className={hdrstyle}>
      <a> {hdrtxt} </a>
      { showloginbtn ?
        <div className="Login-header">
          {login}
        </div> : ""
      }
    </div>
  );
}
