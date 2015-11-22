## 如何运行

Just clone the repository, run `npm install` and then `node server.js`. That's it :).

If you want to run it on another port, just run `PORT=3001 node server.js` to run it on port 3001 for example


### 参考网址

* https://github.com/ubuntuvim/node-mysql
* https://www.npmjs.com/package/mysql-wrapper

&nbsp;&nbsp;nodejs是如此强大！！！直接操作数据库也非常简单、快……


### 使用实例

#### 测试使用的数据库

```sql
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'ubuntuvim', '2015-11-22 17:50:30');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
```

#### 测试代码

##### 获取数据库链接

```javascript
/**
 * 后台服务，链接MySQL获取项目数据
 */
var mysql = require('mysql');  // 引入MySQL模块

var conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // debug: true,
    debug: ['RowDataPacket'],
    database: 'todos'
});
```


##### 使用连接池

```javascript
//  使用连接池
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    // debug: true,
    database: 'todos'
});
pool.getConnection(function(err, conn) {
    conn.query('select * from user', function(err, rows) {
        console.log('>>>>>>>>>>> 使用连接池 >>>>>>>>>>>>>>>>>');
        for (var i = 0; i < rows.length; i++) {
            console.log('rows[i].id = ' + rows[i].id);
            console.log('rows[i].username = ' + rows[i].username);
            console.log('rows[i].timestamp = ' + rows[i].timestamp);
        }
        conn.release();  //释放连接，放回到连接池

        //  甚至可以直接关闭连接池
        conn.destroy();
    });
});
```

##### 查询所有数据

```javascript
conn.connect();  //打开链接

conn.query('select * from user', function(err, rows, fields) {
    if (err) throw err;

    console.log('========= 查询所有数据 ===========');
    for (var i = 0; i < rows.length; i++) {
        console.log('rows[i].id = ' + rows[i].id);
        console.log('rows[i].username = ' + rows[i].username);
        console.log('rows[i].timestamp = ' + rows[i].timestamp);
    }
    // console.log('rows ' + rows[0].username);
    // console.log('fields ' + fields);
});

conn.end();  //关闭连接
```

##### 多表关联查询

```javascript
//  多表连接查询
var options = { sql: 'select * from user u, todoItem td where u.id = td.user', nestTables: '_' };
conn.connect();  //打开链接
conn.query(options, function(err, results) {
    if (err) throw err;

    console.log('---------------- 多表连接查询 -------------------');
    // console.log('results = ' + results);
    // console.log('results[0] = ' + results[0]);
    //  如果查询的时候使用nestTables: '_'分割属性名，那么查询也需要带表明前缀
    //  debug: ['RowDataPacket'] 连接时打开debug可以看到 打印的RowDataPacket信息
    console.log('results[0].username = ' + results[0].u_username);
});
conn.end();
```

#####  查询某个字段值

```javascript
//  根据属性查
conn.connect();  //打开数据库连接
//  与jdbc操作数据库类似，也可以使用占位符
conn.query('select username from user where id = ?', [1], function(err, results, fields) {
    if (err) throw err;

    console.log("-------------- 查询某个字段值 ----------------");
    for (var i = 0; i < results.length; i++) {
        console.log('username = ' + results[i].username);
    }

    //  field 包含的属性
    // [ { catalog: 'def',
    //     db: 'todos',
    //     table: 'user',
    //     orgTable: 'user',
    //     name: 'username',
    //     orgName: 'username',
    //     charsetNr: 33,
    //     length: 150,
    //     type: 253,
    //     flags: 0,
    //     decimals: 0,
    //     default: undefined,
    //     zeroFill: false,
    //     protocol41: true } ]
    //
    console.log("-------------- 字段名称----------");
    for (var i = 0; i < fields.length; i++) {
        console.log('fields = ' + fields[i].name);
    }

});
conn.end();  //关闭MySQL连接
```

##### 插入数据

```javascript
// 插入数据
console.log('------------- 插入数据 ------------');
conn.connect();  //打开连接
var user = { username: 'add test', timestamp: new Date() };
var query = conn.query('insert into user SET ?', user, function(err, result) {
    if (err) throw err;
    //  返回记录的id值
    console.log('result = ' + result.insertId);
});
// 执行的sql为：insert into user SET `username` = 'add test', `timestamp` = '2015-11-22 22:23:36.768'
// 注意与常规insert语句语法的区别
console.log('sql: ' + query.sql);  //  
conn.end();  //关闭连接
```

##### 更新数据

```javascript
console.log('------------- 更新数据 ------------');
conn.connect();  //打开连接
var data = [ 'update test', 4 ];  //需要跟占位符的顺序一致
var query = conn.query('UPDATE user SET username = ? where id = ?', data, function(err, result) {
    if (err) throw err;
    //  返回被更新的行数
    console.log('成功更新【' + result.changedRows + "】行数据。");
});
// 执行的sql为：UPDATE user SET username = 'update test' where id = 4
console.log('sql: ' + query.sql);  //  
conn.end();  //关闭连接
```

##### 删除数据

```javascript
console.log('------------- 删除数据 ------------');
conn.connect();  //打开连接
var data = [ 4 ];  //需要跟占位符的顺序一致
var query = conn.query('delete user where id = ?', data, function(err, result) {
    if (err) throw err;
    //  返回被更新的行数
    console.log('成功删除【' + result.affectedRows + "】行数据。");
});
// 执行的sql为：delete from user where id = 4
console.log('sql: ' + query.sql);  //  
conn.end();  //关闭连接
```

**注意更新和删除获取的影响行数所使用的属性是不一样的。更新使用_changeRows_而删除使用_affectedRows_。**
