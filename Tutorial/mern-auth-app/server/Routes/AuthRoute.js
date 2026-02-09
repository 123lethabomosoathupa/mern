const { Signup, Login } = require('../Controllers/AuthController');
const { userVerification } = require('../Middlewares/AuthMiddleware');
const router = require('express').Router();

// Route for user signup
router.post('/signup', Signup);

// Route for user login
router.post('/login', Login);

// Route to verify user authentication status
router.post('/', userVerification);

module.exports = router;