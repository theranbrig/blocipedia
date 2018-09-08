const bcrypt = require('bcryptjs');

module.exports = {
	ensureAuthenticated(req, res, next) {
		if (!req.user) {
			req.flash('notice', 'You must be signed in to do that.');
			return res.redirect('/users/sign_in');
		} else {
			next();
		}
	},
	comparePass(userPassword, databasePassword) {
		return bcrypt.compareSync(userPassword, databasePassword);
	},
	ensurePremium(req, res, next) {
		if (req.user.role == 0) {
			req.flash('notice', 'You must be Premium Member to do that.');
			return res.redirect('/wikis');
		}
	}
};
