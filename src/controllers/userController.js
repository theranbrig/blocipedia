const userQueries = require('../db/queries.users.js');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');

module.exports = {
	signUp(req, res, next) {
		res.render('users/sign_up');
	},
	create(req, res, next) {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		let newUser = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation
		};
		const msg = {
			to: newUser.email,
			from: 'admin@blocipedia.com',
			subject: 'Welcome to Blocipedia',
			html:
				'<h1>Welcome to Blocipedia.</h1> <a href="https://blocipedia-theranbrig.herokuapp.com/">Visit us and start exploring.</a>'
		};
		userQueries.createUser(newUser, (err, user) => {
			console.log(newUser);
			if (err) {
				req.flash('error', err);
				res.redirect('/users/sign_up');
			} else {
				passport.authenticate('local')(req, res, () => {
					sgMail.send(msg);
					req.flash('notice', "You've successfully signed in!");
					res.redirect('/');
				});
			}
		});
	},
	signInForm(req, res, next) {
		res.render('users/sign_in');
	},
	signIn(req, res, next) {
		passport.authenticate('local')(req, res, function() {
			if (!req.user) {
				req.flash('notice', 'Sign in failed.  Please try again');
				res.redirect('/users/sign_in');
			} else {
				req.flash('notice', "You've successfully signed in!");
				res.redirect('/');
			}
		});
	},
	signOut(req, res, next) {
		req.logout();
		req.flash('notice', "You've successfully signed out!");
		res.redirect('/');
	},
	show(req, res, next) {
		userQueries.getUser(req.params.id, (err, result) => {
			if (err || result.user === undefined) {
				req.flash('notice', 'No user found with that ID.');
				res.redirect('/');
			} else {
				res.render('users/show', { ...result });
			}
		});
	}
};
