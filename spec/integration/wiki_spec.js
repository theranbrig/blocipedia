const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/wikis/';
const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;

describe('routes : wikis', () => {
	beforeEach(done => {
		this.user;
		this.wiki;
		sequelize.sync({ force: true }).then(res => {
			User.create({
				username: 'masterchief',
				email: 'admin@example.com',
				password: '123456789',
				role: 1
			})
				.then(user => {
					this.user = user;
					request.get({
						url: 'http://localhost:3000/auth/fake',
						form: {
							id: user.id,
							username: user.name,
							email: user.email,
							role: user.role
						}
					});
					Wiki.create({
						title: 'JavaScript',
						body: 'JS frameworks and fundamentals',
						userId: user.id,
						private: false
					})
						.then(wiki => {
							this.wiki = wiki;
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
	});
	describe('GET /wikis', () => {
		it('should render the wiki index page', done => {
			request.get(`${base}`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('Browse Recent Wikis');
				done();
			});
		});
	});
	describe('POST /wikis/create', () => {
		it('should create a new wiki and redirect', done => {
			const options = {
				url: `${base}create`,
				form: {
					title: 'Wikiwhat',
					body: 'Some new info',
					private: false,
					userId: this.user.id
				}
			};
			request.post(options, (err, res, body) => {
				Wiki.findOne({ where: { title: 'Wikiwhat' } })
					.then(wiki => {
						expect(wiki.title).toBe('Wikiwhat');
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});
	});
	describe('GET /wikis/:id', () => {
		it('should render a view with the selected wiki', done => {
			request.get(`${base}${this.wiki.id}`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('JS frameworks');
				done();
			});
		});
	});
	describe('POST /wikis/:id/destroy', () => {
		it('should delete the wiki with the associated ID', done => {
			Wiki.all().then(wikis => {
				const wikiCountBeforeDelete = wikis.length;
				expect(wikiCountBeforeDelete).toBe(1);
				request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
					Wiki.all()
						.then(wikis => {
							expect(err).toBeNull();
							expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				});
			});
		});
	});
});
