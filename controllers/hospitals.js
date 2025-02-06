const { response } = require('express');
const bcrypt = require('bcryptjs');
const Hospital = require('../models/hospital');
const { generateToken } = require('../helpers/jwt');

const getHospitals = async (req, res) => {

    const hospitals = await Hospital.find().populate('user', 'name img');

    res.json({
        ok: true,
        hospitals,
        uid: req.uid
    })
}

const createHospital = async (req, res = response) => {

    const { name } = req.body;
    const userId = req.uid;

    try {

        const hospitalExists = await Hospital.findOne({ name });

        if (hospitalExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El hospital ya está registrado'
            })
        }

        const hospital = new Hospital({
            user: userId,
            ...req.body
        });

        // Save user
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const updateHospital = async (req, res = response) => {

    // TODO: validar token y si es el usuario correcto

    const uid = req.params.id;

    try {

        const userDb = await User.findById(uid);

        if (!userDb) {
            return res.status(404).json({
                ok: false,
                msg: 'User by id not exists'
            })
        }

        const {password, email, google, ...fields} = req.body;

        if (userDb.email !== email) {
            const emailExists = await User.findOne({email});

            if (emailExists) {
                return res.status(404).json({
                    ok: false,
                    msg: 'There is already a user with that email'
                })
            }
        }

        fields.email = email;
        /* delete fields.password;
        delete fields.google; */


        const updateUser = await User.findByIdAndUpdate(uid, fields, { new: true });

        res.json({
            ok: true,
            user: updateUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const deleteHospital = async (req, res) => {

    const uid = req.params.id;
    
    try {

        const userDb = await User.findById(uid);

        if (!userDb) {
            return res.status(404).json({
                ok: false,
                msg: 'User by id not exists'
            })
        }

        await User.findOneAndDelete(uid);
        
        res.json({
            ok: true,
            msg: 'User deleted'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

module.exports = { getHospitals, createHospital, updateHospital, deleteHospital }