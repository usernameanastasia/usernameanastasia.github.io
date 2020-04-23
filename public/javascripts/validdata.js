var validdata = {
	username: function(message) {
		if ("" == message) return "Can not be empty";
		else if (message.length < 6) return "At least 6 signs";
		else if (message.length > 18) return "No more than 18 signs";
		else if (!/^[a-z]/i.test(message)) return "Must start with an English letter";
		else if (!/^\w*$/.test(message)) return "Can only be English letters, numbers or underscores";
		else return "ok";
	},
	email: function(message) {
		if ("" == message) return "Can not be empty";
		else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(message)) return "Wrong mailbox format";
		else return "ok";
	},
	password: function(message) {
		if ("" == message) return "Can not be empty";
		else if (message.length < 6 || message.length > 12) return "The password must be 6-12 digits ";
		else if (!/^[a-z0-9_\-]*$/i.test(message)) return "The password must have numbers, uppercase and lowercase letters, underscores.";
		else {
			_password = message;
			return "ok";
		}
	},
	repassword: function(message) {
		if ("" == message) return "Can not be empty";
		else return _password == message ? "ok" : "Two passwords are inconsistent";
	},
	nikiname: function(message) {
		if ("" == message) return "Can not be empty";
		else return /^\w*$/.test(message) ? "ok" : "Can only be English letters, numbers or underscores.";
	}
};


var _password;


if (typeof module == 'object') {
	module.exports = validdata;
}