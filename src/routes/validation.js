module.exports = {
	validateWikis(req, res, next) {
		if (req.method === 'POST') {
			req.checkBody('title', 'Must be between 2 and 30 characters').isLength({ min: 2, max: 30 });
			req.checkBody('body', 'Must be at least 5 characters ').isLength({ min: 5 });
		}
		const errors = req.validationErrors();

		if (errors) {
			req.flash('error', errors);
			return res.redirect(303, req.headers.referer);
		} else {
			return next();
		}
	},
	validateUsers(req, res, next) {
		if (req.method === 'POST') {
			req.checkBody('email', 'must be valid').isEmail();
			req.checkBody('password', 'must be at least 6 characters in length').isLength({ min: 6 });
			req
				.checkBody('username', 'must be between 5 and 15 characters')
				.isLength({ min: 5, max: 15 });
			req
				.checkBody('passwordConfirmation', 'Passwords must match')
				.optional()
				.matches(req.body.password);
		}

		const errors = req.validationErrors();

		if (errors) {
			req.flash('error', errors);
			return res.redirect(req.headers.referer);
		} else {
			return next();
		}
	}
};
