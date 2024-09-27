const cors = require('cors');
const express = require('express');


const reportRouter = require('./routes/report.router');  

const app = express();
app.use(cors());
app.use(express.json());


app.use('/report', reportRouter);  

app.get('/', (req, res) => {
    res.json({
        message: "ManteniPro APIv1"
    });
});

module.exports = app;
