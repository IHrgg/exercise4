require('dotenv').config();

var express = require('express');
const bodyParser = require('body-parser');
var app = express();
const dbService = require('./dbService/dbService');



app.use(bodyParser.urlencoded({ limit: '1mb', extended: false }))
app.use(bodyParser.json({ limit: '1mb' }))
app.use((err, req, res, next) =>{  
  if (err instanceof SyntaxError) {
    res.status(400).json({status: "INVALID JSON FORMAT"})
  } else if (err) {
    res.status(500).json({status: "SERVER ERROR"})  
  } else {
    next();
  }
})

dbService.connect();


const messageRoutes = require('./routes/messages');
app.use('/message', messageRoutes);
const creditRoutes = require('./routes/credit');
app.use('/credit', creditRoutes);

app.listen(9001, function () {
  console.log('Server listening on port 9001');
});