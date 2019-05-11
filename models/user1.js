// u{username"" name"" password""}
var db = require('../db');

var crypto = require('crypto');
var md5 = crypto.createHash('md5');

function register(u)
{
	console.log('model.u:',u);
	return new Promise(function(succ,fail){
		try{
			 //可以进行注册
			db.query('INSERT INTO ta01 (username,name,passwd,email) VALUES(?,?,md5(?),?)',[u.username,u.name,u.password,u.email],
			function (error, results, fields) {
			  if (error) throw error;
			  console.log(results)
				console.log('注册成功');
				succ('注册成功'); 
			});
		}catch(e){
		 
			succ(2);
		}
		
	})
}

function compareEmail(u){
return  check("select * from ta01  where email=? ",u);	
}

function checkRegister1(u)
{
return check("select * from ta01  where username=? ",u);
}

function check(string,u){
	
		return new Promise(function(succ,fail){
		try{
			// console.log('model-u',u);
			// console.log('string',string)
			
			db.query(string,[u],
			function (error, results, fields) {
			  if (error) throw error;
			  if(results.length>0){
			 	//用户已经在库
		 
				console.log('already');
				succ('already');
			  }else{
			  	//用户不在库
				console.log('not');
				succ('not');
			  }
			 
			}); 
				
		}catch(e){
			succ(e);	
		}
	
	})
}




function login(u)
{
		return new Promise(function(succ, fail) {
		try {
		db.query("select * from ta01  where username=? and passwd=md5(?)",[u.username,u.password],
		function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0){
			 
			console.log('user-info is ok,can login')	
			if(results[0].email_verify==1)
				  {
					  //已激活
					  console.log('email_verify=',results[0].email_verify)
					  	succ('yes1');
				  }else{
					  //未激活
					  console.log('not alive')
					  	succ('yes2');
				  }		
				  
		
		  }else{
		 	 console.log('the user-info is not found');
			 succ('not')
		  }
		 
		});
		} catch (e) {
			fail(e)
		
		}
		
	}) 
}

module.exports = {register,login,checkRegister1,compareEmail,check};
 


