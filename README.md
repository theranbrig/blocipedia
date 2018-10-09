

![Header](https://i.imgur.com/4z4ngjB.png)

# Wiki Collaboration Tool

Wiki-What is a fully-functioning site to allow public and private user-created wiki content.  It was built as back-end project to utilize full RESTful API architecture primarily by using [Node.js](https://github.com/nodejs/node) and [Express 4](https://github.com/expressjs/express).  It is built with usability in mind and a clean responsive design (Something missing from most of the those other "Big Wiki" sties.)

## About

Wiki-What was a project that was part of my Bloc Mentorship Program curriculum.  We were tasked with building a functioning wiki site using the Agile process and with only user stories given to us.

## Features

* Full REST API using built using Node.js and Express for users and wikis.
* API is modular to allow for easy scaling and feature addition.  Separation of concerns was carefully thought out in the build process.
* Databases for wikis and users use PostgreSQL with Sequelize as the ORM.
* Two user classifications are built in for free and premium users who can access extra features.
* Premium users can add private wikis that are only available to other premium users.  They also can add and edit the collaborators of private wikis.  Private wikis are marked with a lock when browsing.
* Passport utilized for user sign-up and authentication.
* Stripe payments were used to upgrade premium users.
* PureCSS was used for a mobile responsive grid layout.  Other styling was built using Sass for a clean and modern look.
* Wikis are edited using markdown in the browser.  It has been tailored to have keep a clean and modern look, and has a styling guide for users to follow.
* Integration and unit testing was done using Jasmine.

## Live Demo

https://wikiwhat-theranbrig.herokuapp.com

**Free user login:**

Email: **user@email.com**
Password: **password**

![Imgur](https://i.imgur.com/MKnPtcn.jpg)

## Installation

### Running Locally

Make sure you have [Node.js](http://nodejs.org/), [PostgreSQL](https://github.com/postgres/postgres), and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

Download and install dependencies.

```sh
git clone git@github.com:theranbrig/wiki-what # or clone your own fork
cd wiki-what
npm install
```

Check that `src/db/config/config.json` is setup like below (You may need to change your "username" and "password" depending upon your local setup) and make sure that Postgres is running:

```json
{
	"development": {
		"username": "postgres",
		"password": null,
		"database": "blocipedia-dev",
		"host": "127.0.0.1",
		"dialect": "postgres",
		"logging": false,
		"operatorsAliases": false
	},
	"test": {
		...
	},
	"production": {
		...
	}
}
```

Init and seed database :

```sh
sequelize db:migrate

sequelize db:seed:all
```

Run the project :

```sh
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

### Deploying to Heroku

```sh
heroku create
git push heroku master
heroku open
```

## Built With

* [Node](https://github.com/nodejs/node)
* [Express 4](https://github.com/expressjs/express)
* [PostgreSQL](https://github.com/postgres/postgres)
* [Passport](https://github.com/jaredhanson/passport)
* [Stripe](https://github.com/stripe/stripe-node)
* [EJS](http://ejs.co/)
* [Jasmine](https://github.com/jasmine/jasmine)
* [Heroku](https://github.com/heroku)

## Author

## Author

Theran Brigowatz is a Full-stack Web Developer currently out of Seoul, South Korea, but transitioning back to the US.  Check him out at the following:

* [theran.co](https://www.theran.co)
* theran.brigowatz@gmail.com
* [twitter.com/wellBuilt](https://www.twitter.com/wellBuilt)
* [github.com/theranbrig](https://www.github.com/theranbrig)

> Made with :heart: and :coffee:.



