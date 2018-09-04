'use strict';
module.exports = (sequelize, DataTypes) => {
	const Wiki = sequelize.define(
		'Wiki',
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false
			},
			body: {
				type: DataTypes.STRING,
				allowNull: false
			},
			image1: {
				type: DataTypes.STRING
			},
			image2: {
				type: DataTypes.STRING
			},
			private: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			userId: {
				type: DataTypes.INTEGER,
				onDelete: 'CASCADE',
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId'
				}
			}
		},
		{}
	);
	Wiki.associate = function(models) {
		Wiki.belongsTo(models.User, {
			foreignKey: 'userId',
			onDelete: 'CASCADE'
		});
	};
	return Wiki;
};
