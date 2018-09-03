'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		let wikis = [];

		for (let i = 1; i <= 15; i++) {
			wikis.push({
				title: faker.hacker.noun(),
				description: faker.hacker.phrase(),
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}
		return queryInterface.bulkInsert('Wikis', wikis, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Wikis', null, {});
	}
};

// sequelize db:seed:all
