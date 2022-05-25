// 连接数据库
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
//   port     : 3306,          默认为3306
  user     : 'root',
  password : '123456',
  database : 'blogr'
});
 
connection.connect(function(err){
    if(err){
        console.error('error connection:'+err.stack)
        return
    }
    console.log('connected as id:'+connection.threadId);
});

module.exports=connection

// connection.end();