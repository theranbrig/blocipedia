'use strict';

const faker = require('faker');

let users = [];
for (let i = 1; i < 15; i++) {
	users.push({
		email: faker.internet.exampleEmail(),
		password: faker.internet.password(),
		username: faker.internet.userName(),
		createdAt: new Date(),
		updatedAt: new Date()
	});
}

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Users', users, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Wikis', null, {});
	}
};
