/*
    Ruta: /api/login
*/
const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');

const router = Router();

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
    validateField
], login);


router.post('/google', [
    check('token', 'El Token de Google es obligatorio').notEmpty(),
    validateField
], googleSignIn);


module.exports = router;