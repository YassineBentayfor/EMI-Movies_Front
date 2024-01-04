const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || "localhost";

const app = express();

app.use('/',express.static(path.join(__dirname, 'angular', 'browser')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'angular','browser', 'index.html'));
  }
);

app.listen(PORT, HOST, () => {
    console.log("Running on http://${HOST}:${PORT}");
  }
);
