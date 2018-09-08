const wikiQueries = require('../db/queries.wiki.js');
const authorizer = require('../policies/wiki');

module.exports = {
	index(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			if (err) {
				res.redirect(500, '/');
			} else {
				res.render('wikis/wiki', { wikis });
			}
		});
	},
	new(req, res, next) {
		const authorized = new authorizer(req.user).new();
		if (authorized) {
			res.render('wikis/new');
		} else {
			req.flash('notice', 'You need to be signed in first to create a wiki.');
			res.redirect('/wikis');
		}
	},
	create(req, res, next) {
		const premium = new authorizer(req.user).premium();
		const authorized = new authorizer(req.user).new();
		if (authorized) {
			let newWiki = {
				title: req.body.title,
				body: req.body.body,
				private: req.body.private,
				image1: req.body.image1,
				image2: req.body.image2,
				userId: req.user.id
			};
			if (newWiki.private && !premium) {
				req.flash('notice', 'You must be a premium user to create a Private Wiki');
				res.redirect('/wikis/new');
			}
			wikiQueries.addWiki(newWiki, (err, wiki) => {
				if (err) {
					res.redirect(500, '/wikis/new');
				} else {
					res.redirect(303, `/wikis/${wiki.id}`);
				}
			});
		} else {
			req.flash('notice', 'You are not authorized to do that');
			req.redirect('/wikis');
		}
	},
	show(req, res, next) {
		const premium = new authorizer(req.user).premium();
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				if ((wiki.private && premium) || !wiki.private) {
					res.render('wikis/show', { wiki });
				} else {
					req.flash('notice', 'You must be a Premium Member to view that Wiki.');
					res.redirect('/wikis');
				}
			}
		});
	},
	destroy(req, res, next) {
		wikiQueries.deleteWiki(req, (err, wiki) => {
			if (err) {
				res.redirect(500, `/wikis/${wiki.id}`);
			} else {
				res.redirect(303, '/wikis');
			}
		});
	},
	edit(req, res, next) {
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				const premium = new authorizer(req.user, wiki).premium();
				const authorized = new authorizer(req.user, wiki).edit();
				if (authorized || (wiki.private && premium)) {
					res.render('wikis/edit', { wiki });
				} else {
					req.flash('notice', 'You are not authorized to do that.');
					res.redirect(`/wikis/${req.params.id}`);
				}
			}
		});
	},
	update(req, res, next) {
		wikiQueries.updateWiki(req, req.body, (err, wiki) => {
			if (err || wiki == null) {
				req.flash('notice', 'Oops. Something went wrong with your edit.');
				res.redirect(404, `/wikis/${req.params.id}`);
			} else {
				req.flash('notice', `You updated the ${wiki.title} Wiki.`);
				res.redirect(301, `/wikis/${req.params.id}`);
			}
		});
	}
};
