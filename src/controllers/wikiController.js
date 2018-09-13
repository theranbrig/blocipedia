const wikiQueries = require('../db/queries.wiki.js');
const userQueries = require('../db/queries.users.js');
const collaboratorQueries = require('../db/queries.collaborators');
const authorizer = require('../policies/wiki');
const markdown = require('markdown').markdown;

module.exports = {
	index(req, res, next) {
		wikiQueries.getAllWikis((err, wikis) => {
			collaboratorQueries.allCollaborations((err, collaborations) => {
				collaborations.forEach(collab => {
					console.log(collab.userId, collab.wikiId);
				});
				if (err) {
					res.redirect(500, '/');
				} else {
					res.render('wikis/wiki', { wikis, collaborations });
				}
			});
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
				fastFacts: req.body.fastFacts,
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
		wikiQueries.getWiki(req.params.id, (err, result) => {
			wiki = result['wiki'];
			collaborators = result['collaborators'];
			let wikiMarkdown = {
				body: markdown.toHTML(wiki.body),
				fastFacts: markdown.toHTML(wiki.fastFacts)
			};
			let collabAuth = false;
			collaborators.forEach(collab => {
				if (collab.userId === req.user.id) {
					return (collabAuth = true);
				}
				return (collabAuth = false);
			});
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				if ((wiki.private && premium) || !wiki.private || collabAuth) {
					res.render('wikis/show', { wiki, wikiMarkdown, collabAuth });
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
		wikiQueries.getWiki(req.params.id, (err, result) => {
			wiki = result['wiki'];
			if (err || wiki == null) {
				res.redirect(404, '/');
			} else {
				const premium = new authorizer(req.user, wiki).premium();
				const authorized = new authorizer(req.user, wiki).edit();
				if (authorized || (wiki.private && premium)) {
					res.render('wikis/edit', { wiki });
				} else {
					req.flash('notice', 'You are not authorized to do that.');
					res.render(`/wikis/${req.params.id}`);
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
				res.redirect(303, `/wikis/${req.params.id}`);
			}
		});
	}
};
