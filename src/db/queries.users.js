const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const bcrypt = require('bcryptjs');

module.exports = {
	createUser(newUser, callback) {
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);
		return User.create({
			email: newUser.email,
			password: hashedPassword,
			username: newUser.username
		})
			.then(user => {
				callback(null, user);
			})
			.catch(err => {
				callback(err);
			});
	},
	getUser(id, callback) {
		let result = {};
		User.findById(id).then(user => {
			if (!user) {
				callback(404);
			} else {
				result['user'] = user;
				console.log(user.username);
				Collaborator.scope({ method: ['collaborationsFor', id] })
					.all()
					.then(collaborations => {
						result['collaborations'] = collaborations;
						console.log(result);
						callback(null, result);
					})
					.catch(err => {
						callback(err);
					});
			}
		});
	},
	getAllUsers(callback) {
		return User.all()
			.then(users => {
				callback(null, users);
			})
			.catch(err => {
				callback(err);
			});
	},
	upgrade(id, callback) {
		return User.findById(id).then(user => {
			return user
				.update({ role: 1 })
				.then(() => {
					callback(null, user);
				})
				.catch(err => {
					callback(err);
				});
		});
	},
	downgrade(id, callback) {
		return User.findById(id).then(user => {
			return user
				.update({ role: 0 })
				.then(() => {
					callback(null, user);
				})
				.catch(err => {
					callback(err);
				});
		});
	}
};
