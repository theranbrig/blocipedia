'use strict';

const faker = require('faker');

let wikis = [];
for (let i = 1; i < 15; i++) {
	wikis.push({
		title: `${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
		body: `${faker.commerce.productName()}`,
		image1: 'https://picsum.photos/800/1200/?random',
    image2: 'https://picsum.photos/400/600/?random',
    userId: faker.random.number({ min: 1, max: 10 }),
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
