var express = require('express')
  , app = express()
  , dbconfig = require('./config/database')
  , expressconfig = require('./config/express')(app)
  , passportconfig = ('./config/passport')
  , routes = require('./app/routes')(app);

  app.listen(80, function() {console.log('Express server listening on port 80');});