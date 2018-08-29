const userQueries = require('../db/queries.users.js');

module.exports = {
	index(req, res, next) {
		userQueries.getAllUsers((err, users) => {
			if (err) {
				res.redirect(500, '/');
			} else {
				res.render('users/all', { users });
			}
		});
	}
};
