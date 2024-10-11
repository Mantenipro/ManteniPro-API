/* eslint-disable no-undef */
const cors = require('cors');
const express = require('express');
require('dotenv').config()

const usersRouter = require('./routes/users.router')
const authRouter = require('./routes/auth.router')
const reportRouter = require('./routes/report.router')  
const RegisterRouter = require('./routes/register.router')
const activateRouter = require('./routes/activate.router')
const requestPasswordResetRouter = require('./routes/requestReset.router')
const resetPasswordRouter = require('./routes/resetPassword.router')
const assignmentRouter = require('./routes/assignment.router');
const paymentRoutes = require('./routes/paymentRoutes')
const companiesRouter = require('./routes/companies.router')

const app = express();


app.use(cors());
app.use(express.json());

app.use('/users', usersRouter)

app.use('/auth', authRouter)

app.use('/report', reportRouter)

app.use('/register', RegisterRouter)

app.use('/requestPasswordReset', requestPasswordResetRouter)

app.use('/resetPassword', resetPasswordRouter)

app.use('/activate', activateRouter)

app.use('/assignment', assignmentRouter);

app.use('/payments', paymentRoutes)

app.use('/companies', companiesRouter)

app.get('/', (request, response) => {
    response.json({
        message: "ManteniPro APIv1"
    });
});

module.exports = app;
