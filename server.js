const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const indexroutes = require('./routes/index.routes.js');

const app = express();

dotenv.config();

app.use(indexroutes);

// Serve static assets to Heroku - IF we are in Production (ie, Heroku)

if (process.env.NODE_ENV === "production") {
  // Set the static assets folder (ie, client build)
  app.use(express.static('sampleapps/build'));

  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'sampleapps', 'build', 'index.html'))
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
