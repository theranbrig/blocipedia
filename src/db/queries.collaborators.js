const Collaborator = require('./models').Collaborator;
const sequelize = require('./models/index').sequelize;
const Authorizer = require('../policies/wiki');
const User = require('./models').User;
const Wiki = require('./models').Wiki;

module.exports = {
	createCollaborator(newCollaborator, callback) {
		Collaborator.all().then(collaborations => {
			return Collaborator.create({
				userId: newCollaborator.userId,
				wikiId: newCollaborator.wikiId
			})
				.then(collaborator => {
					callback(null, collaborator);
				})
				.catch(err => {
					callback(err);
				});
		});
	},

	deleteCollaborator(id, callback) {
		return Collaborator.destroy({ where: { id: id } })
			.then(collaborator => {
				callback(null, collaborator);
			})
			.catch(err => {
				callback(err);
			});
	},

	getCollaborators(wikiId, callback) {
		Collaborator.findAll({ where: { wikiId: wikiId } })
			.then(collaborators => {
				console.log(collaborators);
				callback(null, collaborators);
			})
			.catch(err => {
				callback(err);
			});
	},

	checkCollaboration(wikiId, userId, callback) {
		return Collaborator.findAll({
			where: {
				wikiId: wikiId,
				userId: userId
			}
		})
			.then(collaboration => {
				callback(null, collaboration);
			})
			.catch(err => {
				callback(err);
			});
	},

	allCollaborations(callback) {
		return Collaborator.all()
			.then(collaborations => {
				callback(null, collaborations);
			})
			.catch(err => {
				callback(err);
			});
	}
};
