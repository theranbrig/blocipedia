const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('./validation');
const passport = require('passport');

router.get('/users/sign_up', userController.signUp);
router.post('/users', validation.validateUsers, userController.create);
router.get('/users/sign_in', userController.signInForm);
router.post(
	'/users/sign_in',
	passport.authenticate('local', {
		failureRedirect: '/users/sign_in',
		failureFlash: true
	}),
	userController.signIn
);
router.get('/users/sign_out', userController.signOut);

module.exports = router;
