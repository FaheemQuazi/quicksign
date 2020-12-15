const express = require('express');
const basicAuth = require('express-basic-auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var upload = multer({dest: path.join(__dirname, 'upload/')});

var fname = 'default';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, '/views'));

if (fs.existsSync(path.join(__dirname, '/upload'))) {
    fs.rmdirSync(path.join(__dirname, '/upload'), {recursive: true, force: true});
}
fs.mkdirSync(path.join(__dirname, '/upload'));

if (fs.existsSync(path.join(__dirname, '/views/custom.ejs'))) {
    fname = 'custom';
}

app.get('/', (req, res) => {
    res.render('index', {
        fname: fname
    });
});

app.use(basicAuth({
    users: {
        'admin': 'test' // You should probably change this lol
    },
    challenge: true
}));

app.get('/edit', (req, res) => {
    res.render('edit');
});

app.post('/up', upload.single('newsite'), (req, res, next) => {
    fs.renameSync(req.file.path, path.join(__dirname, '/views/custom.ejs'));
    fname = "custom";
    io.emit('ref');
    res.redirect('/edit');
});

http.listen(3003, () => {
    console.log("listening");
});