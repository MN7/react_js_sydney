import React from 'react';
import { Button, Grid } from '@material-ui/core';

export default function MyAppsList (props) {

  return(
    <section className="AppsListSection">
      <Grid container direction="column" justify="space-around" alignItems="flex-start" spacing={1}>
        <Grid item>
          <Button variant="text" color="default" size="medium"
              type="button" onClick={()=>props.updateForm("WGMain")} >Word Games Helper</Button>
        </Grid>
        <Grid item>
          <Button variant="text" color="default" size="medium"
              type="button" onClick={()=>props.updateForm("WGMain")} >Sample App 2</Button>
        </Grid>
      </Grid>
    </section>
  );
}
