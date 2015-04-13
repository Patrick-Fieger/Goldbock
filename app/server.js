var express = require('express')
  , app = express()
  , dbconfig = require('./config/database')
  , expressconfig = require('./config/express')(app)
  , passportconfig = ('./config/passport')
  , routes = require('./app/routes')(app)
  , port = 3000

  app.use(express.static(__dirname + '/public')); 
  app.listen(port, function() {console.log('Express server listening on port ' + port);});