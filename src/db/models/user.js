'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: { msg: 'must be a valid email' }
				}
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 0
			}
		},
		{}
	);

	User.associate = function(models) {
		User.hasMany(models.Wiki, {
			foreignKey: 'userId',
			as: 'wikis'
		});

		User.hasMany(models.Collaborator, {
			foreignKey: 'userId',
			as: 'collaborators'
		});
	};

	User.prototype.isAdmin = function() {
		return this.role == 2;
	};

	User.prototype.isPremium = function() {
		return this.role == 1;
	};

	User.prototype.isStandard = function() {
		return this.role == 0;
	};

	return User;
};
