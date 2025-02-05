/*
    Ruta: /api/users
*/
const { Router } = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');
const { validateJwt } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJwt, getUsers);

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').notEmpty(),
    check('email', 'Email is required').isEmail(),
    validateField
], createUser);

router.put('/:id', [
    validateJwt,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('role', 'Role is required').notEmpty(),
    validateField
], updateUser);

router.delete('/:id', validateJwt, deleteUser)

module.exports = router;