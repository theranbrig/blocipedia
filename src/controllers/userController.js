const userQueries = require('../db/queries.users.js');
const wikiQueries = require('../db/queries.wiki.js');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const User = require('../db/models').User;
const Wiki = require('../db/models').Wiki;

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
				'<h1>Welcome to Blocipedia.</h1> <br> <a href="https://blocipedia-theranbrig.herokuapp.com/">Visit us and start exploring.</a>'
		};
		userQueries.createUser(newUser, (err, user) => {
			if (err) {
				req.flash('error', err);
				console.log(err);
				res.redirect('/users/sign_up');
			} else {
				passport.authenticate('local')(req, res, () => {
					sgMail.send(msg);
					req.flash(
						'notice',
						"You've successfully signed up for Blocipedia! Check your email for more information."
					);
					res.redirect('/wikis');
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
				res.redirect('/wikis');
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
			user = result['user'];
			Wiki.findAll({ where: { userId: user.id } }).then(wikis => {
				console.log(wikis);
				if (err || user === undefined) {
					req.flash('notice', 'User not found');
					res.redirect('/');
				} else {
					res.render(`users/show`, { user, wikis });
				}
			});
		});
	},

	upgradeUser(req, res, next) {
		User.findById(req.params.id)
			.then(user => {
				const stripeToken = req.body.stripeToken;
				stripe.charges.create(
					{
						amount: 1500,
						currency: 'usd',
						description: 'Upgrade tp premium User',
						source: stripeToken
					},
					userQueries.upgrade(user.id, (err, user) => {
						req.flash('notice', 'You are now a Premium User.  Start creating today.');
						res.redirect(`/users/${user.id}`);
					})
				);
			})
			.catch(err => {
				console.log(err);
				req.flash('notice', 'Oops. Something went wrong.  Please try again.');
				res.redirect(`/users/${req.params.id}`);
			});
	},

	downgradeUser(req, res, next) {
		const stripeToken = req.body.stripeToken;
		stripe.refunds.create(
			{
				amount: 1000,
				currency: 'usd',
				description: 'Refund from Premium Membership',
				source: stripeToken
			},
			wikiQueries.publicWikis(req.params.id),
			userQueries.downgrade(req.params.id, (err, user) => {
				if (err) {
					req.flash('notice', 'Something went wrong.  Please try again.');
					res.redirect(`/users/${user.id}`);
				} else {
					req.flash('notice', 'Sorry to see you go.  You should receive your refund shortly.');
					res.redirect(301, `/users/${user.id}`);
				}
			})
		);
	}
};
