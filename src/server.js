/* eslint-disable no-undef */
const cors = require('cors');
const express = require('express');

const usersRouter = require('./routes/users.router')

const authRouter = require('./routes/auth.router')

const reportRouter = require('./routes/report.router')  


const app = express();


app.use(cors());
app.use(express.json());

app.use('/users', usersRouter)

app.use('/auth', authRouter)

app.use('/report', reportRouter)  

app.get('/', (req, res) => {
    res.json({
        message: "ManteniPro APIv1"
    });
});

module.exports = app;
