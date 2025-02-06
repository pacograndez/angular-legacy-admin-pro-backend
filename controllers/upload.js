const { response } = require('express');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const { v4: uuidv4 } = require('uuid');
const { updateImg } = require('../helpers/update-img');
const path = require("path");
const fs = require("fs");

const fileUpload = async (req, res = response) => {
    const table = req.params.table;
    const id = req.params.id;

    const validTables = ['users', 'hospitals', 'doctors'];

    if (!validTables.includes(table)) {
        return res.status(404).json({
            ok: false,
            msg: 'It is not users, hospitals or doctors'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded.'
        });
    }

    const file = req.files.imagen;
    const shortName = file.name.split('.');
    const extensionFile = shortName[shortName.length - 1];


    const validTypes = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validTypes.includes(extensionFile)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un tipo válido de archivo.'
        });
    }

    const nameFile = `${uuidv4()}.${extensionFile}`;
    const path = `./uploads/${table}/${nameFile}`;

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        updateImg(table, id, nameFile);

        res.json({
            ok: true,
            msg: 'Imagen subida',
            nameFile
        });
    });
}

const getFile = async (req, res = response) => {
    const table = req.params.table;
    const file = req.params.file;

    const pathFile = path.join(__dirname, `../uploads/${table}/${file}`);

    if (!fs.existsSync(pathFile)) {
        res.sendFile(path.join(__dirname, `../uploads/images.png`));
    } else {
        res.sendFile(pathFile);
    }
}

module.exports = { fileUpload, getFile }