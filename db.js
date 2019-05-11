//数据库连接
var mysql = require('mysql');
var connection= mysql.createConnection({
host:'localhost',
user:'root',
password:'my296466865',
port:3306,
database:'test'
});


//连接数据库 建表
connection.connect(function(err){
	if(err){
		console.log("链接失败");
		throw(err)
	}else{
		console.log("链接成功");
// 		connection.query("create table ta01 (username varchar(15) primary key, passwd varchar(32), name varchar(32))",
// 		 function(err){
// 			if(err)
// 			{throw err}
// 			else{
// 				console.log("创建表成功")
// 			}
// 		})
	}
})
 
 module.exports = connection;


 
// 	connection.query("select * from ta01  where username=? and passwd=md5(?)",[req.body.username,req.body.password],
// 	function (error, results, fields) {
// 	  if (error) throw error;
// 	  if(results.length>0){
// 	  console.log(results[0]);
// 	  }else{
// 	  console.log('not found');
// 	  }
// 	 
// 	});
 



// connection.query('INSERT INTO ta01 (username,name,passwd) VALUES(?,?,md5(?))',['2',"james",'123123'],
// function (error, results, fields) {
//   if (error) throw error;
//   console.log(results)
//  
// });


// connection.query("UPDATE ta01 set passwd=md5(?) where username=?",
//     ['asdfasdfasdfe33','aa'],
// function (error, results, fields) {
//   // try catch
//   if (error) throw error;
//   console.log(results)
//  
// });

// connection.end();

