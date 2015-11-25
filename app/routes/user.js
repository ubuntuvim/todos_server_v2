/**
 * 用户模块数据库操作
 */
var express = require('express'),
      mysql = require('mysql'), // 引入MySQL模块
       cors = require('cors'); // 解决跨域请求问题

var app = module.exports = express.Router();

function getConnection() {

  var conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // debug: true,
    debug: ['RowDataPacket'],
    database: 'todos'
  });

  if (!conn) {
    console.log('数据库还未启动……');  
  }
  
  return conn;

}


/**
 * 用户登录
 * @param  {[type]} req  [获取页面前端页面传递过来的用户名和密码]
 * @param  {[type]} res) {   登录成功返回用户信息，否则返回提示信息，并且状态码为400
 * @return {[type]}      [description]
 */
app.post('/api/user/login', cors(), function(req, res) {


  if (!req.body.username) {
    return res.status(200).send("请输入用户名！");
  }
  if (!req.body.password) {
  	return res.status(200).send("请输入密码！");	
  }

  var conn = getConnection();

  //查询数据库判断登录用户是否存在
  conn.connect();  //打开数据库链接
  var data = [req.body.username, req.body.password];
  conn.query('select * from user where username = ? and password = ?', data, function(err, results) {
  	if (err) throw err;

  	if (null != results && results.length > 0) {
  		  res.status(200).send({
  		     user: results[0]
  	    });
  	} else {
  		  res.status(200).send("用户名或密码有误，请重试！");
  	}
	
  });

  conn.end();  //关闭连接

});

