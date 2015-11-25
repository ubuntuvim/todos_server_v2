/**
 * todos_v2 项目后台处理
 */
var http = require('http');
var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var _ = require('underscore');
var app = express();

var cors            = require('cors');
var dotenv          = require('dotenv');


// all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon('../public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join('../', 'public')));
app.use(cors());  //解决跨域请求问题

dotenv.load();


app.use(require('./routes/test'));
app.use(require('./routes/user'));

var port = process.env.PORT || 3001;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});

