const express = require('express');
const app = express();

const npm = require('npm-programmatic');

app.get('/', function (req, res) {
    const { cmd, pkg, save } = req.query;

    if (!cmd) {
        res.send('Command needs to be specified!');
        return;
    }
    if (cmd !== 'list' && !pkg) {
        res.send('Package needs to be specified!')
        return;
    }

    if (cmd === 'list') {
        npm.list('./')
            .then((packages) => { res.send(packages) })
            .catch(() => { res.status(400).send('Unable to list packages.') })
        return;
    }

    if (cmd === 'install') {
        npm.install([pkg], {
            cwd: './',
            save: Boolean(save)
        })
            .then(() => { res.send('OK') })
            .catch(() => {
                res.status(400);
                res.send(`Unable to install package ${pkg}.`);
            })
    }
});

app.listen(3003, function () {
    console.log('Example app listening on port 3000!');
});

