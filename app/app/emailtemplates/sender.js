var path           = require('path')
  , templatesDir   = path.join(__dirname)
  , emailTemplates = require('email-templates')
  , nodemailer = require('nodemailer')
  , options = {
    host: 'smtp.udag.de',
    port: 587,
    auth: {
        user: 'steinbockinfo-0013',
        pass: 'patrick.fieger'
    },
    secure: true
    },
    emailHeaders = [
    	['welcomeuser','Herzlich Willkommen bei Goldbock'],
    	['forgot','Sie möchten ihr Passwort zurücksetzen'],
    	['forgot_complete','Passwort erfolgreich zurückgesetzt'],
    	['register_verify','Verifizieren sie Ihre Email'],
    	['register_complete','Ihre Email wurde erfolgreich verifiziert'],
    	['check_offer','Angebot zur Prüfung eingereicht']
    ],
    sub_ = function(path_){
		for (var i = 0; i < emailHeaders.length; i++) {
	  		if(emailHeaders[i][0] == path_){
	  			return emailHeaders[i][1]
	  		}
	  	};
	}

var SendEmail = function(emailcontent,path_){
	emailTemplates(templatesDir, function(err, template) {
	  if (err) {
	    console.log(err);
	  } else {
	  	transport = nodemailer.createTransport("SMTP",options)
	    template(path_, emailcontent, function(err, html, text) {
	      if (err) {
	        console.log(err);
	      } else {
	        transport.sendMail({
	          from: 'Goldbock <info@goldbock.de>',
	          to: emailcontent.email,
	          subject: sub_(path_),
	          html: html,
	          generateTextFromHTML: true
	        }, function(err, responseStatus) {
	          if (err) {
	            console.log(err);
	          } else {
	            console.log(responseStatus.message);
	          }
	        });
	      }
	    });
	  }
	});
}

module.exports = {
	sendEmail: SendEmail
}