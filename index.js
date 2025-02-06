require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Create Express Server
const app = express();

//CORS Configuration
app.use(cors());

//Read and parse Request or Body
app.use(express.json());

// Database
dbConnection();

//Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/todo', require('./routes/searchs'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log('Servido corriendo en puerto:', process.env.PORT);
});