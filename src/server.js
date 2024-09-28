/* eslint-disable no-undef */
const cors = require('cors');
const express = require('express');


const reportRouter = require('./routes/report.router');  

const userssRouter = require('./routes/users.router')

const authRouter = require('./routes/auth.router')

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: "ManteniPro APIv1"
    });
});

module.exports = app;
