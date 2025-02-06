const { response } = require('express');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const getSearch = async (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    // const users = await User.find({}, 'name email role google').skip(skip).limit(5);
    // const total = await User.count();

    const [users, hospitals, doctors] = await Promise.all([
        User.find({ name: regex }),
        Hospital.find({ name: regex }), // .populate('user', 'name').populate('hospital', 'name'),
        Doctor.find({ name: regex }), // .populate('user', 'name').populate('hospital', 'name')
    ])

    res.json({
        ok: true,
        users,
        hospitals,
        doctors
    })
}

const getCollectionSearch = async (req, res) => {
    const table = req.params.table;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    let data = [];

    switch (table) {
        case 'users': data = await User.find({ name: regex }); break;
        case 'hospitals': data = await Hospital.find({ name: regex }); break;
        case 'doctors': data = await Doctor.find({ name: regex }); break;
        default:
            return res.status(404).json({
                ok: false,
                msg: 'La table tiene que ser users, hospitals or doctors'
            });
    }

    res.json({
        ok: true,
        results: data
    })
}

module.exports = { getSearch, getCollectionSearch }