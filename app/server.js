var express = require('express')
  , app = express()
  , dbconfig = require('./config/database')
  , expressconfig = require('./config/express')(app)
  , passportconfig = ('./config/passport')
  , routes = require('./app/routes')(app);

  app.use(express.static(__dirname + '/public')); 
  app.listen(3000, function() {console.log('Express server listening on port 80');});