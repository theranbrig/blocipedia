const User = require('./models').User;

module.exports = {
	getAllUsers(callback) {
		return User.all()
			.then(users => {
				callback(null, users);
			})
			.catch(err => {
				callback(err);
			});
	}
};
