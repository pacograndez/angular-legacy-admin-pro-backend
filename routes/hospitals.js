/*
    Ruta: /api/hospitals
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateField } = require('../middlewares/validate-field');
const { validateJwt } = require('../middlewares/validate-jwt');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals');

const router = Router();

router.get('/', validateJwt, getHospitals);

router.post('/', [
    validateJwt,
    check('name', 'The name of hospital is required').not().isEmpty(),
    validateField
], createHospital);

router.put('/:id', [], updateHospital);

router.delete('/:id', validateJwt, deleteHospital)

module.exports = router;