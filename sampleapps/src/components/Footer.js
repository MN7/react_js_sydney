import React from 'react';

export default function Footer (props) {

  const REACT_VERSION = React.version;
  const ftrtxt = props.hasOwnProperty("txt") ? props.txt : "No Footer text for form";
  const ftrstyle = props.hasOwnProperty("styl") ? props.styl : {};

  return (
    <sub className={ftrstyle}>
      <marquee direction="left" width="60%" scrollamount="8">
        {ftrtxt}
        <br/>
         React Version used on this page: {REACT_VERSION} ---- {JSON.stringify(props.state)} ----
      </marquee>
    </sub>
  );
}
