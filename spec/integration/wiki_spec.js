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
		sequelize.sync({ force: true }).then(() => {
			User.create({
				email: 'example@example.com',
				username: 'userMan',
				password: '123456789',
				role: 0
			})
				.then(user => {
					this.user = user;
					Wiki.create({
						title: 'JS Frameworks',
						body: 'There is a lot of them',
						userId: this.user.id,
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
					done();
				});
		});
	});

	describe('admin user performing CRUD actions for wiki', () => {
		beforeEach(done => {
			User.create({
				email: 'admin@example.com',
				password: '123456',
				role: 0,
				username: 'user'
			}).then(user => {
				request.get(
					{
						url: 'http://localhost:3000/auth/fake',
						form: {
							role: user.role,
							userId: user.id,
							email: user.email,
							username: user.username
						}
					},
					(err, res, body) => {
						done();
					}
				);
			});
		});

		describe('GET /wikis', () => {
			it('should respond with all wikis', done => {
				request.get(base, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Browse Wikis');
					expect(body).toContain('JS Frameworks');
					done();
				});
			});
		});

		describe('GET /wikis/new', () => {
			it('should render a view with a new wiki form', done => {
				request.get(`${base}new`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Create a New Wiki');
					done();
				});
			});
		});

		describe('POST /wikis/create', () => {
			const options = {
				url: `${base}create`,
				form: {
					title: 'blink-182 songs',
					body: "What's your favorite blink-182 song?",
					private: false
				}
			};

			it('should create a new wiki and redirect', done => {
				request.post(options, (err, res, body) => {
					Wiki.findOne({ where: { title: 'blink-182 songs' } })
						.then(wiki => {
							expect(wiki.title).toBe('blink-182 songs');
							expect(wiki.body).toBe("What's your favorite blink-182 song?");
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
					expect(body).toContain('JS Frameworks');
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
						Wiki.all().then(wikis => {
							expect(err).toBeNull();
							expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
							done();
						});
					});
				});
			});
		});

		describe('GET /wikis/:id/edit', () => {
			it('should render a view with an edit wiki form', done => {
				request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
					expect(err).toBeNull();
					expect(body).toContain('Edit Wiki');
					expect(body).toContain('JS Frameworks');
					done();
				});
			});
		});
	});
});

//////////////////////////////
// Member Tests

describe('member user performing CRUD actions for wiki', () => {
	beforeEach(done => {
		request.get({
			url: 'http://localhost:3000/auth/fake',
			form: {
				role: 0
			}
		});
		done();
	});

	describe('GET /wikis', () => {
		it('should respond with all wikis', done => {
			request.get(base, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('wikis');
				expect(body).toContain('JS Frameworks');
				done();
			});
		});
	});

	describe('GET /wikis/new', () => {
		it('should redirect to wikis view', done => {
			request.get(`${base}new`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('Wikis');
				done();
			});
		});
	});
});
