bcrypt = require('bcrypt')
, SALT_WORK_FACTOR = 10;

var salt = function(next){
	var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
        if(err) return next(err);
        user.password = hash;
        next();
    });
}

module.exports = {
	salt: salt
}