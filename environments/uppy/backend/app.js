const express = require("express");

const app = express();

app.post('/upload', function (req, res) {
    res.send('Images received.');
})

app.listen(3005, function () {
    console.log('Uppy backend is listening on port 3005!');
})
