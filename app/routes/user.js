/**
 * 用户模块数据库操作
 */
var express = require('express'),
      mysql = require('mysql'), // 引入MySQL模块
       cors = require('cors'); // 解决跨域请求问题

var app = module.exports = express.Router();

var randomName = require('../data/sgrm-arr');

function getConnection() {

  var conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // debug: true,
    debug: ['RowDataPacket'],
    database: 'todos'
  });

  // console.log('conn = ' + conn.threadId);

  //  这个错误信息会直接返回到调用处（ember代码）
  // if ('disconnected' === conn.state) throw "数据库链接失败，请检查MySQL是否已经启动成功！";

  return conn;

}

// 打开数据库连接池
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // debug: true,
    debug: ['RowDataPacket'],
    database: 'todos'
});


var __SUCCESS__ = "1";
var __FAILE__ = "0";

/**
 * 用户登录
 * @param  {[type]} req  [获取页面前端页面传递过来的用户名和密码]
 * @param  {[type]} res) {   登录成功返回用户信息，否则返回提示信息，并且状态码为400
 * @return {[type]}      [description]
 */
app.post('/api/user/login', cors(), function(req, res) {

  var conn = getConnection();

  if (!req.body.email) {
    return res.status(200).send("请输入登录邮箱！");
  }
  if (!req.body.password) {
  	return res.status(200).send("请输入密码！");
  }

  //查询数据库判断登录用户是否存在
  conn.connect();  //打开数据库链接
  var data = [req.body.email, req.body.password];
  conn.query('select * from user where email = ? and password = ?', data, function(err, results) {
    // console.log(err);
  	if (err) throw err;

  	if (null != results && results.length > 0) {
  		  res.status(200).send({
  		     user: results[0]
  	    });
  	} else {
  		  res.status(200).send("登录邮箱或密码有误，请确认无误后重试！");
  	}

  });

  conn.end();  //关闭连接

});


/**
 * 用户注册
 * @param  {[type]} req  [获取页面前端页面传递过来的注册信息]
 * @param  {[type]} res) {   注册成功返回用户信息，否则返回提示信息，并且状态码为400
 * @return {[type]}      [description]
 */
app.post('/api/user/register', cors(), function(req, res) {

  // var conn = getConnection();

  if (!req.body.email) {
    return res.status(200).send({ msgCode: 'email', msg: "请输入登录邮箱！"});
  }
  if (!req.body.password) {
    return res.status(200).send({ msgCode: 'pwd', msg: "请输入密码！"});
  }


  var un = req.body.username;
  if (!un)
    un = randomName.getNickname(); //获取一个随机名字作为昵称
    
  var email = req.body.email;
  var pwd = req.body.password;
  var userPic = req.body.userPic;

  //查询数据库判断登录用户是否存在
  // conn.connect();  //打开数据库链接
  pool.getConnection(function(err, conn) {
      var data = [req.body.email];
      conn.query('select * from user where email = ?', data, function(err, results) {
        // console.log(err);
        if (err) throw err;

        if (null != results && results.length > 0) {
            res.status(200).send({ msgCode: "same_email", msg: "此邮箱已经被注册，请直接登录或者换一个邮箱再注册。"});
        } else {
            //  用户还未注册
            var user = { username: un, email: email, password: pwd, userPic: userPic, timestamp: new Date().getTime(), grade: 1, regitsteredDate: new Date() };
            var q = conn.query('INSERT INTO user SET ?', user, function(err, result) {
                if (err) throw err;

                if (result.insertId) {
                    res.status(200).send({ msgCode: __SUCCESS__, data: user });
                }
            });
            console.log('用户注册 >>> ' + q.sql);
        }

        conn.release();  //释放数据库链接
      });
  });

});
