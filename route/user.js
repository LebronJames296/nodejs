var model =require('../models/user');
var db=require('../db');
var sessions ={};	
//handle user action
function login(req,res,next)
{
	 console.log(req.body);
	var crypto = require('crypto');
	var md5 = crypto.createHash('md5');
	 
		db.query("select * from ta01  where username=? and passwd=md5(?)",[req.body.username,req.body.password],
		function (error, results, fields) {
		  if (error) throw error;
		  if(results.length>0){
		//   console.log(results[0]);
		//身份验证成功，可以写session了
		 var result = md5.update('liyusen'+Date.now()).digest('hex');
					 console.log(result);
					 sessions[result] =req.body.username;
					 //获取客户端传送的用户参数
					 
					  console.log('username=',req.body.username);
					
						res.header("Set-Cookie",`user=${result}; httponly`);
							res.send("ok！");
					next();
		
		  }else{
		  console.log('not found');
		res.send("failed ..");
		  }
		 
		});
 }
 
 function register(req,res,next)
 {
  
  	
  
 
 }



function checklogin(req,res,next){
	var s = ('cookies?==',req.headers.cookie);
	console.log('s=',s);
	var ss = s.split('=');
	console.log('ss[1]=',ss[1]);
	
	if([ss[1]]==000000000000000000000000000000000)
	{
			res.send('您尚未登录');
	}
	else{
			console.log("user:",sessions[ss[1]])
			res.send('您已登录');
	}

}

function logout(req,res,next){
 	var s = ('cookies?==',req.headers.cookie);
	 
	var ss = s.split('=');
 
		delete sessions[ss[1]];
		
		res.header("Set-Cookie",`user=000000000000000000000000000000000; httponly`);
		console.log('sessions =',sessions)
		 
		res.send('已退出登录');
}



function init(server){
	server.post('/login',login);
	server.post('/register',register);
	//退出会话
	server.get("/logout",logout);
	//检查登录状态
	server.get("/checklogin",checklogin);
}
module.exports ={init}
