/**
 * user.js单元测试类，模拟浏览器的请求
 * 运行测试： mocha user-test.js
 */
var request = require('supertest'),
	should = require('should'),
	express = require('express');

var app = express();

// app.get('/api/test', function(req, res) {
// 	res.send(200, { responseValue: 'test...' });
// });

// request(app)
// 	.get('http://localhost:3001/api/test')
// 	.expect('Content-Type', '/json/')
// 	.expect('Content-Length', '20')
// 	.expect(200)
// 	.end(function(err, res) {
// 		if (err) throw err;

// 		console.log('res = ' + res);
// 		console.log('res.body = ' + res.body);
//  	});


describe('登录测试', function() {
	it('测试用户名不能为空。', function(done) {
	    request(app).post('http://localhost:3001/api/user/login')
		    .send({
		        username: '',
		        password: '123'
		    })
		    .expect(400, function(err, res) {
		        should.not.exist(err);
		        // res.text.should.containEql('用户名或密码不能为空');
		        console.log('res = ' + res); 
		        done();
		    });
	});
	it('测试密码不能为空。', function(done) {
	    request(app).post('http://localhost:3001/api/user/login')
		    .send({
		        username: 'ember',
		        password: ''
		    })
		    .expect(400, function(err, res) {
		        should.not.exist(err);
		        // res.text.should.containEql('用户名或密码不能为空');
		        console.log('res = ' + res); 
		        done();
		    });
	});
	// it('should not sign up an user when it is exist', function(done) {
	//     request(app).post('http://localhost:3001/api/login')
	//     .send({
	//         username: 'username',
	//         password: 'password'
	//     })
	//     .expect(200, function(err, res) {
	//         should.not.exist(err);
	//         res.text.should.containEql('用户已经存在');
	//         done();
	//     });
	// });
});