'use strict';

const faker = require('faker');

let wikis = [];
for (let i = 1; i < 15; i++) {
	wikis.push({
		title: `${faker.commerce.productName()}`,
		body: faker.lorem.paragraph(),
		image1: 'https://picsum.photos/500/1100/?random',
		image2: 'https://picsum.photos/400/600/?random',
		userId: faker.random.number({ min: 1, max: 10 }),
		fastFacts: faker.lorem.paragraph(),
		private: false,
		createdAt: new Date(),
		updatedAt: new Date()
	});
}

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Wikis', wikis, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Wikis', null, {});
	}
};
