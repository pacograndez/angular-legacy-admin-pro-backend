const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");
const User = require("../models/user");
const fs = require("fs");

const deleteImg = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
const updateImg = async (table, id, nameFile) => {

    let oldPath = '';
    switch(table) {
        case 'users': 
        const user = await User.findById(id);

        if (!user) {
            console.log('No existe el usuario')
            return false;
        }

        deleteImg(`./uploads/users/${user.img}`);        

        user.img = nameFile;
        await user.save();
        return true;
        
        case 'doctors': 
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            console.log('No existe el doctor')
            return false;
        }

        deleteImg(`./uploads/doctors/${doctor.img}`);

        doctor.img = nameFile;
        await doctor.save();
        return true;

        case 'hospitals': 
        const hospital = await Hospital.findById(id);

        if (!hospital) {
            console.log('No existe el hospital')
            return false;
        }

        deleteImg(`./uploads/hospitals/${hospital.img}`);

        hospital.img = nameFile;
        await hospital.save();
        return true;
    }
}

module.exports = {
    updateImg
}