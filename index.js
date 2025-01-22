require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Create Express Server
const app = express();

//CORS Configuration
app.use(cors());

// Database
dbConnection();

//Routes
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    })
});

app.listen(process.env.PORT, () => {
    console.log('Servido corriendo en puerto:', process.env.PORT);
});