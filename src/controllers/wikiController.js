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
		wikiQueries.getWiki(req.params.id, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				res.render('wikis/show', { wiki });
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
				const authorized = new authorizer(req.user, wiki).edit();
				if (authorized) {
					res.render('wikis/edit', { wiki });
				} else {
					req.flash('Notice', 'You are not authorized to do that.');
					res.redirect(`/wikis/${req.params.id}`);
				}
			}
		});
	},
	update(req, res, next) {
		wikiQueries.updateWiki(req, req.body, (err, wiki) => {
			if (err || wiki == null) {
				res.redirect(404, `/wikis/${req.params.id}/edit`);
			} else {
				res.redirect(`/wikis/${req.params.id}`);
			}
		});
	}
};
