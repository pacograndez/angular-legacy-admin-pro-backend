/*
    Ruta: /api/todo/:search
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJwt } = require('../middlewares/validate-jwt');
const { getSearch, getCollectionSearch } = require('../controllers/search');

const router = Router();

router.get('/:search', [
    validateJwt
], getSearch);

router.get('/collection/:table/:search', [
    validateJwt
], getCollectionSearch);

module.exports = router;