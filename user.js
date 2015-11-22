/**
 * 用户模块数据库操作
 */
var express = require('express'),
    // _       = require('lodash'),
    conn = require('./mysql-connection');

var app = module.exports = express.Router();

/**
 * 用户登录
 * @param  {[type]} req  [获取页面前端页面传递过来的用户名和密码]
 * @param  {[type]} res) {   登录成功返回用户信息，否则返回提示信息，并且状态码为400
 * @return {[type]}      [description]
 */
app.post('/api/login', function(req, res) {
  console.log('========== login =============');
  if (!req.body.username) {
    return res.status(400).send("请输入用户名！");
  }
  if (!req.body.password) {
  	return res.status(400).send("请输入密码！");	
  }

  //查询数据库判断登录用户是否存在
  conn.connect();  //打开数据库链接
  var data = [req.body.username, req.body.password];
  conn.query('select * from user where username = ? and password = ?', data, function(err, results) {
  	if (err) throw err;

	if (null != results && results.length > 0) {
		console.log('-------- login sucess --------');
		res.status(201).send({
		    user: results[0]
	    });
	} else {
		console.log('-------- login faile --------');
		res.status(400).send("用户名或密码有误，请重试！");
	}
	
  });

  conn.end();  //关闭连接

});

