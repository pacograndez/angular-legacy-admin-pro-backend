const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../helpers/jwt')
const User = require('../models/user');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDb = await User.findOne({ email });

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

const googleSignIn = async (req, res = response) => {

    try {
        const {email, name, picture} = await googleVerify(req.body.token);
        const userDb = await User.findOne({email});
        let user;

        if (!userDb) {
            user = new User({
                name: name,
                email: email,
                img: picture,
                password: '@@@',
                google: true
            })
        } else {
            user = userDb;
            user.google = true;
        }

        await user.save();

        //Generate JWT
        const token = await generateToken(user.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }

}

module.exports = { login, googleSignIn }