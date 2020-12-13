const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var upload = multer({dest: 'upload/'});

var win;
var fname = 'default';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/static')));
app.use('views', path.join(__dirname, '/views'));

if (fs.existsSync(path.join(__dirname, '/upload'))) {
    fs.rmdirSync(path.join(__dirname, '/upload'), {force: true});
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

app.get('/edit', (req, res) => {
    res.send('<form action="/up" method="post" enctype="multipart/form-data"><input type="file" name="newsite" /><input type="submit" value="Update" name="sub"/></form>');
});

app.post('/up', upload.single('newsite'), (req, res, next) => {
    fs.renameSync(req.file.path, 'views\\custom.ejs');
    fname = "custom";
    io.emit('ref');
    res.redirect('/edit');
});

http.listen(3003, () => {
    console.log("listening");
});