/*
    Ruta: /api/doctors
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');
const { validateJwt } = require('../middlewares/validate-jwt');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctors');

const router = Router();

router.get('/', validateJwt, getDoctors);

router.post('/', [
    validateJwt,
    check('name', 'The name of Doctor is required').not().isEmpty(),
    check('hospital', 'The hospital ID must be valid').isMongoId(),
    validateField
], createDoctor);

router.put('/:id', [], updateDoctor);

router.delete('/:id', validateJwt, deleteDoctor)

module.exports = router;