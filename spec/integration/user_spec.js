const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/users/';
const User = require('../../src/db/models').User;
const sequelize = require('../../src/db/models/index').sequelize;

describe('routes : users', () => {
	beforeEach(done => {
		sequelize
			.sync({ force: true })
			.then(() => {
				done();
			})
			.catch(err => {
				console.log(err);
				done();
			});
	});

	describe('GET /users', () => {
		it('should return a status code 200', done => {
			request.get(`${base}sign_up`, (err, res, body) => {
				expect(body).toContain('Join Blocipedia');
				expect(res.statusCode).toBe(200);
				done();
			});
		});

		it('should return a status code 200', done => {
			request.get(`${base}sign_in`, (err, res, body) => {
				expect(body).toContain('Sign In Now');
				expect(res.statusCode).toBe(200);
				done();
			});
		});
	});
});

describe('POST /users', () => {
	it('should create a new user with valid values and redirect', done => {
		const options = {
			url: base,
			form: {
				email: 'user@example.com',
				password: '123456789',
				username: 'username'
			}
		};

		request.post(options, (err, res, body) => {
			User.findOne({ where: { email: 'user@example.com' } })
				.then(user => {
					expect(user).not.toBeNull();
					expect(user.email).toBe('user@example.com');
					expect(user.id).toBe(1);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
	});

	it('should not create a new user with invalid attributes and redirect', done => {
		request.post(
			{
				url: base,
				form: {
					email: 'no',
					password: '123456789',
					username: 'username'
				}
			},
			(err, res, body) => {
				User.findOne({ where: { email: 'no' } })
					.then(user => {
						expect(user).toBeNull();
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			}
		);
	});
});

describe('User', () => {
	beforeEach(done => {
		sequelize
			.sync({ force: true })
			.then(() => {
				done();
			})
			.catch(err => {
				console.log(err);
				done();
			});
	});

	describe('#create()', () => {
		it('should create a User object with a valid email and password', done => {
			User.create({
				email: 'user@example.com',
				password: '1234567890',
				username: 'curly'
			})
				.then(user => {
					expect(user.email).toBe('user@example.com');
					expect(user.id).toBe(1);
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		it('should not create a user with invalid email or password', done => {
			User.create({
				email: "It's-a me, Mario!",
				password: '1234567890',
				username: 'curly'
			})
				.then(user => {
					done();
				})
				.catch(err => {
					expect(err.message).toContain('Validation error: must be a valid email');
					done();
				});
		});

		it('should not create a user with an email already taken', done => {
			User.create({
				email: 'user@example.com',
				password: '1234567890',
				username: 'curly'
			})
				.then(user => {
					User.create({
						email: 'user@example.com',
						password: 'nananananananananananananananana BATMAN!',
						username: 'larry'
					})
						.then(user => {
							done();
						})
						.catch(err => {
							expect(err.message).toContain('Validation error');
							done();
						});

					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});
	});

	describe('POST /users', () => {
		it('should create a new user with valid values and redirect', done => {
			const options = {
				url: base,
				form: {
					email: 'user@example.com',
					password: '123456789',
					username: 'curly'
				}
			};

			request.post(options, (err, res, body) => {
				// #2
				User.findOne({ where: { email: 'user@example.com' } })
					.then(user => {
						expect(user).not.toBeNull();
						expect(user.email).toBe('user@example.com');
						expect(user.id).toBe(1);
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});

		it('should not create a new user with invalid attributes and redirect', done => {
			request.post(
				{
					url: base,
					form: {
						email: 'no',
						password: '123456789',
						username: 'curly'
					}
				},
				(err, res, body) => {
					User.findOne({ where: { username: 'user' } })
						.then(user => {
							expect(user).toBeNull();
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				}
			);
		});
	});
});
