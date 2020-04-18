const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// req.body is now automatically parsed to JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/', function (req, res) {
    res.send('Use POST method.')
})

app.post('/', function (req, res) {
    _.merge({}, req.body);
    res.send(req.body);
})

app.listen(3004, function () {
    console.log('lodash env is listening on port 3004');
})
