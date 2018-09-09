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
				type: DataTypes.TEXT,
				allowNull: false
			},
			image1: {
				type: DataTypes.STRING
			},
			image2: {
				type: DataTypes.STRING
			},
			fastFacts: {
				type: DataTypes.TEXT
			},
			private: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false
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
