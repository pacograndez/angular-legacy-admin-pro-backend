const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt')
const User = require('../models/user');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const userDb = await User.findOne({email});

        if (!userDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Email not found'
            })
        }

        const validatePassword = bcrypt.compareSync(password, userDb.password);

        if (!validatePassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Password is invalid'
            })
        }

        //Generate JWT
        const token = await generateToken(userDb.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = { login }