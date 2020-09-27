import React from 'react';
// import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
// import Icon from '@material-ui/core/Icon';
import { Button, Grid, TextField, Tooltip, Select, MenuItem, InputLabel } from '@material-ui/core';

export default class WGMain extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputword: "",
      err_inputword: "",
      showRawSel: false,
      csvWL: "",
      csvDL: "",
      selWL: "ALL",
      selDL: "ALL",
      dictList: [],
      wordsList: []
    }
  }

  handleError = (message) => {

  }

  handleSuccess = (wordsList, dictList) => {
    console.log("wl: "+wordsList+" dl: "+dictList);
    let csv="", csvDL="";
    wordsList.sort((a,b)=>a.length-b.length).map((v)=>csv+=v.toUpperCase()+", ");
    csv=csv.slice(0,-2); // drop the last comma+space from csv
    dictList.sort((a,b)=>a.length-b.length).map((v)=>csvDL+=v.toUpperCase()+", ");
    csvDL=csvDL.slice(0,-2);
    this.setState({wordsList: wordsList, csvWL: csv, dictList: dictList, csvDL: csvDL});
  }

  generateWords = (e) => {
    e.preventDefault();
    let [inpw] = [this.state.inputword];
    if (inpw.length<3) { this.setState({err_inputword: "Word should be of length 3 or more"})}
    else {
      this.props.doWordSearch({"inputword": inpw, "handleSuccess": (wl,dl)=>this.handleSuccess(wl,dl), "handleError":(msg)=>this.handleError(msg)});
    }
  }

  onClickShowHide = (e) => {
    const cur=this.state.showRawSel;
    this.setState({showRawSel:!cur});
  }

  onChangeInpText = (e) => {
    const inp=e.target.value;
    if (!/[^a-z]/i.test(inp)) {this.setState({inputword: inp.toUpperCase(), err_inputword: ""})}
    else {this.setState({inputword: inp, err_inputword: "Only alphabetical characters permitted"})}
  }

  onMenuChange = (e) => {
    const tgtlen=e.target.value, tgtname=e.target.name;
    let c="";
    switch (tgtname) {
      case "DictSel":
        this.state.dictList.filter((e) => tgtlen==="ALL"||e.length===tgtlen).map((v)=>c+=v.toUpperCase()+", ");
        this.setState({csvDL:c.slice(0,-2), selDL:tgtlen});
        break;
      case "RawSel":
        this.state.wordsList.filter((e) => tgtlen==="ALL"||e.length===tgtlen).map((v)=>c+=v.toUpperCase()+", ");
        this.setState({csvWL:c.slice(0,-2), selWL:tgtlen});
        break;
      default:
    }

  }

  render() {

    // const [inputword, err_inputword, csvWL, csvDL] = [this.state];
    const [inputword, err_inputword, csvWL, csvDL, showRawSel] =
    [this.state.inputword, this.state.err_inputword, this.state.csvWL, this.state.csvDL, this.state.showRawSel];
    // const [inputword, err_inputword, csvWL, wordsList] = [this.state.inputword, this.state.err_inputword, this.state.csvWL, this.state.wordsList];
    const generateWords = this.generateWords;

    const body =
    <div className="PadAll">
      <Grid container direction="column" justify="center" alignItems="stretch" spacing={4}>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <Tooltip title="Enter the input letters to generate possible words" placement="top-start">
              <TextField className="GenericInput" type="text" placeholder="Enter letters" value={inputword}
                helperText="" error={err_inputword.length>0}
                name="inputword" autoComplete="off" onChange={e => this.onChangeInpText(e)} />
            </Tooltip>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="default" size="medium"
                type="submit" onClick={(e)=>generateWords(e)} >Generate Words</Button>
          </Grid>
        </Grid>
        {(csvWL.length > 0) ?
          <Grid className="PadTop" container direction="row" spacing={2}>
            <Grid item xs={6}> <TextField className="WordSpace" variant="outlined" margin="dense" fullWidth={true} value={csvDL}
                          multiline label="Dictionary Words"/>
            </Grid>
            <Grid item xs={3}>
              <InputLabel>Length</InputLabel>
              <Select name="DictSel" value={this.state.selDL} onChange={e => this.onMenuChange(e)} label="Length">
                <MenuItem value="ALL">ALL</MenuItem>
                {[...Array(inputword.length+1).keys()].slice(3).map((v) =>
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                )}
              </Select>
            </Grid>
            <Grid item xs={9}> <Button variant="outlined"
              onClick={(e)=>this.onClickShowHide(e)}>
              SHOW / HIDE All Raw Word Combinations
              </Button>
            </Grid>
            {showRawSel ?
                <Grid item xs={6}> <TextField variant="outlined" margin="dense" fullWidth={true} value={csvWL}
                              multiline label="All Raw Combinations"/>
                </Grid>
              : <p></p>
            }
            {showRawSel ?
              <Grid item xs={3}>
                <InputLabel>Length</InputLabel>
                <Select name="RawSel" value={this.state.selWL} onChange={e => this.onMenuChange(e)} label="Length">
                  <MenuItem value="ALL">ALL</MenuItem>
                  {[...Array(inputword.length+1).keys()].slice(3).map((v) =>
                    <MenuItem key={v} value={v}>{v}</MenuItem>
                  )}
                </Select>
              </Grid>
              : <p></p>
            }
          </Grid>
        : <p></p>}
      </Grid>
    </div>
    ;

    return body;

    }

}
