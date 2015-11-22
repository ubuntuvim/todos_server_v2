/**
 * 获取MySQL数据库连接
 */

var mysql = require('mysql');  // 引入MySQL模块

//  使用连接池
var conn = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	// debug: true,
	debug: ['RowDataPacket'],
	database: 'todos'
});
// console.log(conn);
// 使用实例
/*  
```javascript
conn.connect();  //打开链接

conn.query('select * from user', function(err, rows, fields) {
	if (err) throw err;

	console.log('====================');
	for (var i = 0; i < rows.length; i++) {
		console.log('rows[i].id = ' + rows[i].id);
		console.log('rows[i].username = ' + rows[i].username);
		console.log('rows[i].timestamp = ' + rows[i].timestamp);
	}
	// console.log('rows ' + rows[0].username);
	// console.log('fields ' + fields);
});

conn.end();  //关闭连接
````
*/