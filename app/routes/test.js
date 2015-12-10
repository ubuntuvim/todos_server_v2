var express = require('express');

var app = module.exports = express.Router();

app.get('/api/test', function(req, res) {
	var obj = { id: 1, username: 'ubuntuvim', grage: 1 };
    res.status(200).send(obj);
});


//  获取人物名
// console.log('--------开始读取文件--------');
// var arr = require('../data/sgrm-arr');
// var s = arr.getNickname();
// console.log(s);
// console.log(arr.getNameByLineNum(1));
// console.log('test = ' + arr.test(0));
