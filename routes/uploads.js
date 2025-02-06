/*
    Ruta: /api/upload/:table/:id
*/
const { Router } = require('express');
const { validateJwt } = require('../middlewares/validate-jwt');
const { fileUpload, getFile } = require('../controllers/upload');
const expressFileUpload = require('express-fileupload');

const router = Router();

router.use(expressFileUpload());

router.put('/:table/:id', [
    validateJwt,
], fileUpload);

router.get('/:table/:file', [
    validateJwt,
], getFile);

module.exports = router;