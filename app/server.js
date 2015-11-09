  const chalk = require('chalk');
  var app = require('express')()
  , dbconfig = require('./config/database')
  , expressconfig = require('./config/express')(app)
  , passportconfig = ('./config/passport')
  , routes = require('./app/routes')(app)
  , port = 3000
  , server = app.listen(port,function(){console.log('Express listening on port: '+port)})
  , io = require('socket.io').listen(server)
  , chat = require('./app/socket/chat')(io);

  app.use(express.static(__dirname + '/public'));