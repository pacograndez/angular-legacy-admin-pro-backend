const { response } = require('express');
const bcrypt = require('bcryptjs');
const Doctor = require('../models/doctor');
const { generateToken } = require('../helpers/jwt');
const hospital = require('../models/hospital');

const getDoctors = async (req, res) => {

    const doctors = await Doctor.find().populate('user', 'name').populate('hospital', 'name');

    res.json({
        ok: true,
        doctors,
        uid: req.uid
    })
}

const createDoctor = async (req, res = response) => {

    const { name } = req.body;
    const userId = req.uid;

    try {

        const doctorExists = await Doctor.findOne({ name });

        if (doctorExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El Doctor ya está registrado'
            })
        }

        const doctor = new Doctor({
            user: userId,
            ...req.body
        });

        // Save user
        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorDB
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const updateDoctor = async (req, res = response) => {

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

const deleteDoctor = async (req, res) => {

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

module.exports = { getDoctors, createDoctor, updateDoctor, deleteDoctor }