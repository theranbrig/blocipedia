const userQueries = require('../db/queries.users.js');
const wikiQueries = require('../db/queries.wiki.js');
const collaboratorQueries = require('../db/queries.collaborators.js');
const Wiki = require('../db/models').Wiki;
const authorizer = require('../policies/wiki');


module.exports = {
	index(req, res, next) {
		const authorized = new authorizer(req.user)._isPremium();
		if (authorized) {
			this.wiki;
			wikiQueries.getWiki(req.params.id, (err, wiki) => {
				this.wiki = wiki;
				userQueries.getAllUsers((err, users) => {
					if (err) {
						res.redirect('/');
					} else {
						res.render('collaborate/add_collaboration', { wiki, users });
					}
				});
			});
		} else {
			req.flash('notice', 'You are not authorized to do that');
			res.redirect(req.headers.referer);
		}
	},

	create(req, res, next) {
		const authorized = new authorizer(req.user)._isPremium();
		if (authorized) {
			let newCollaborator = {
				userId: req.body.userId,
				wikiId: req.params.id
			};
			collaboratorQueries.checkCollaboration(
				newCollaborator.wikiId,
				newCollaborator.userId,
				(err, collaboration) => {
					if (collaboration.length === 0) {
						collaboratorQueries.createCollaborator(newCollaborator, (err, collaborator) => {
							if (err) {
								req.flash('error', err);
								res.redirect(`/wikis/${req.params.id}/collaborate`);
							} else {
								req.flash('notice', 'You added a new collaborator to your Wiki.');
								res.redirect(`/wikis/${req.params.id}`);
							}
						});
					} else {
						req.flash('notice', 'Collaboration already exists');
						res.redirect(`/wikis/${req.params.id}/collaborate`);
					}
				}
			);
		} else {
			req.flash('notice', 'You are not authorized to do that');
			res.redirect(req.headers.referer);
		}
	},

	edit(req, res, next) {
		const authorized = new authorizer(req.user)._isPremium();
		if (authorized) {
			wikiQueries.getWiki(req.params.id, (err, result) => {
				wiki = result['wiki'];
				collaborators = result['collaborators'];
				if (err) {
					req.flash('notice', 'Something went wrong with the collaboration.');
					res.redirect(`/wikis/${req.params.id}`);
				} else {
					res.render('collaborate/remove_collaboration', { wiki, collaborators });
				}
			});
		} else {
			req.flash('notice', 'You are not authorized to do that');
			res.redirect(req.headers.referer);
		}
	},

	remove(req, res, next) {
		const authorized = new authorizer(req.user)._isPremium();
		if (authorized) {
			collaboratorQueries.deleteCollaborator(req.body.id, (err, collaborator) => {
				if (err) {
					req.flash('notice', 'Something went wrong.');
					res.redirect(500, `/wikis/${req.params.id}/edit`);
				} else {
					res.redirect(303, `/wikis/${req.params.id}`);
				}
			});
		} else {
			req.flash('notice', 'You are not authorized to do that');
			res.redirect(req.headers.referer);
		}
	}
};
