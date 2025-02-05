const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../helpers/jwt');

const getUsers = async (req, res) => {

    const users = await User.find({}, 'name email role google');

    res.json({
        ok: true,
        users,
        uid: req.uid
    })
}

const createUser = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const user = new User(req.body);

        // Encrypt
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Save user
        await user.save();

        //Generate JWT
        const token = await generateToken(user.id);

        res.json({
            ok: true,
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const updateUser = async (req, res = response) => {

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

const deleteUser = async (req, res) => {

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

module.exports = { getUsers, createUser, updateUser, deleteUser }