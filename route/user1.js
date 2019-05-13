var model =require('../models/user1');
var db=require('../db');
var email =require('../email/user');
var sessions ={};	
var registers={};
var logining_user;
var verify;
var reqEmail="zcvx@*/21.}[]m";
var crypto = require('crypto');


 /*注册*/
 
async function register(req,res,next)
 {
  console.log('req.body:',req.body);
  var r  = await model.register(req.body);
  console.log('param-r:',r);
  //默认注册成功，进行伪登录,发送激活邮件
  // falseLogin(req.body.username,res);
  // RegisterSendMail(req.body.username);
  var md5 = crypto.createHash('md5');
  //创建注册用户的cookie，用于判断是否注册成功
  	
  var result = md5.update('james'+Date.now()).digest('hex');
  		 console.log(result);
	
  		 registers[result] =req.body.username;
  		 //获取客户端传送的注册用户参数
  	 
  		 console.log('register-user',req.body.username);
  		
  		 res.header("Set-Cookie",`register=${result}; httponly`);
 
	res.redirect('http://localhost:8333/form.html',next);
 
 }
 
  /*
 伪登录
 当用户注册后马上为其添加user-cookie用于验证成功后的跳转*/
 function falseLogin(reName,res){
 				//身份验证成功，可以写session了
 	var md5 = crypto.createHash('md5');
 	var result = md5.update('james'+Date.now()).digest('hex');
 			 console.log(result);
 			  //获取客户端传送的用户参数
 			 sessions[result] =reName;
 			//全局变量  当前登录用户  从登录成功获取 用于检测该用户是否已经邮箱验证成功
 			logining_user=reName;
 			 
 			 console.log('username=',reName);
 			
 			 res.header("Set-Cookie",`user=${result}; httponly`);
 	 
 } 
 
  /*邮件激活
 当用户注册时完成时调用一次且仅调用一次*/
 async function RegisterSendMail(reName){
 	 console.log('reName',reName)
 	
 	 //执行发送邮件逻辑：生成一个12位数token令牌，存入数据库，并且作为参数加到邮件链接上
 	 var token =randomWord(false, 12)
 	  console.log('token',token)
 	 try{
 	  var r= await email.sendMail(reName,token);
 	  console.log('send-email-right',r);	
 	  
 	  }catch(e){
 	  console.log('send-email-error',r);	
 	  }
 }

 /*
 只支持已完成邮箱验证的用户
 找回密码*/
 async function getKey(req,res,next){
	 //得到一个邮箱，生成令牌，再发送邮件
	  console.log('req.email',req.params.email)
	  //将申请的邮箱保存下来，作为之后的判断
	  reqEmail=req.params.email;
	  console.log('getkey-reqEmail'.reqMail)
	  //生成一个register-cookie里面存放已发送的信息
	 
	  getKeySendMail(req.params.email);
	 //生成一个cookie告诉用户邮箱已发送
	  makeCookie('send',res)
	  res.redirect('http://localhost:8333/getkey.html',next);
 }
 
 /*生成register-cookie 用于判断状态
 name:存放的键值
 
 */
function makeCookie(name,res){
	 var md5 = crypto.createHash('md5');
	//创建注册用户的cookie，用于判断是否注册成功
		
	var result = md5.update('james'+Date.now()).digest('hex');
			 console.log(result);
		//****键值  registers[result]
			 registers[result] =name;
			 //获取客户端传送的注册用户参数 
			 res.header("Set-Cookie",`register=${result}; httponly`);
} 
 /*发送找回密码邮件
*/
 async function getKeySendMail(Email){
	 console.log('reEmail',Email)
	
	 //执行发送邮件逻辑：生成一个12位数token令牌，存入数据库，并且作为参数加到邮件链接上
	 var token =randomWord(false, 12)
	  console.log('token',token)
	 try{
		 var r= await email.getKeySendMail(Email,token);
	  console.log('send-email-right',r);	
	  
	  }catch(e){
	  console.log('send-email-error',e);	
	  }
 }

/*当重置密码邮件中的链接点击以后跳转到这来*/
async function SetPass(req,res,next){
	//取得参数,开始验证参数，如果成功则跳转到重置密码界面
	var arr=req.params.token.split(":");
	var arr1=req.params.email.split(":");
	//打印参数	
	console.log('req.token',arr[1])
	console.log('req.email',arr1[1])
	
	try{
		var r = await email.setPass(arr1[1],arr[1])

		console.log('r=',r)
		if(r=='1'){
			//验证通过，跳转到重置密码页面
			res.redirect('http://localhost:8333/reset.html',next);
		}
		else{
			//验证失败
			res.send('链接已经失效');
		}
		
	}catch(e){
		//TODO handle the exception
	}
}


/*完成身份验证后，在密码重置页面提交表单后的路由
获取密码更新密码
写一个密码重置成功的cookie
跳转到登录页面
*/
async function reset(req,res,next){
	
 
		console.log('req.email-reset:',req.params); 
		//判断用户邮箱是否为发起邮箱
		if(reqEmail!=req.params.email){
			res.send('请输入自己的邮箱');
			//考虑再加一条cookie
		}else{
		var r = await email.reset(req.params.email,req.params.password)
		console.log('get-it-r',r);
	 //请求用户邮箱置零
		console.log('reqMail',reqEmail)
		reqEmail=0;
		if(r=='ok'){
			console.log('ok is ok')
		//用户密码重置成功，先写一个重置成功的cookie再跳转
		makeCookie('reset',res);
		res.redirect('http://localhost:8333/form.html',next);
		}			
		}
 
	
}

/*监控密码重置页面的邮箱是否等于发起请求的邮箱*/
function checkEmail(req,res,next){
	console.log('email-checkEmail',req.body)
	console.log('checkE-reqEmail',reqEmail)
	if(req.body==reqEmail){
 
		res.send('ok');
	}else{
		res.send('no');
	}
}

//handle user action
async function login(req,res,next)
{
	 console.log('req.body',req.body);
 
 try{
 		 var r= await model.login(req.body);
 		console.log('param-r:',r);
		if(r!='not'){
			//判断用户邮箱是否激活
			if(r=='yes1'){
				verify=1;
			}else{
				verify=0;
			}
			//身份验证成功，可以写session了
			var md5 = crypto.createHash('md5');
			var result = md5.update('james'+Date.now()).digest('hex');
					 console.log(result);
					  //获取客户端传送的用户参数
					 sessions[result] =req.body.username;
					//全局变量  当前登录用户  从登录成功获取 用于检测该用户是否已经邮箱验证成功
					logining_user=req.body.username;
					 
					 console.log('username=',req.body.username);
					
					 res.header("Set-Cookie",`user=${result}; httponly`);
			 	 
				res.redirect('http://localhost:8333/home.html',next);
		}else{
			//登录错误，原地罚站：做一个错误的cookie返回
			var md5 = crypto.createHash('md5');
			//创建注册用户的cookie，用于判断是否注册成功
			var result = md5.update('james'+Date.now()).digest('hex');
					 console.log(result);
					 registers[result] ='error';
					 //获取客户端传送的注册用户参数
					 
					 console.log('error-login-user', registers[result]);
					
					 res.header("Set-Cookie",`register=${result}; httponly`);
				res.redirect('http://localhost:8333/form.html',next);
		}
 }catch(e){
		res.send(e);
 }
 
 

 }
 
 
 /*检查登录信息，用于异步返回给主页*/
 function checklogin(req,res,next){
  var s = ('cookies?==',req.headers.cookie);
  
  if(req.headers.cookie==undefined)
  {
  	res.send('not');
  }
  else{
  //获取user的cookie
   var arrCookie=req.headers.cookie.split('; ');
   var  login_user;
  for(var i=0;i<arrCookie.length;i++)
  {
  			 var arr= arrCookie[i].split("=");
  			 // console.log("arr[0]",arr[0])
  			if("user"==arr[0]){
              login_user =arr[1];
  				// console.log("arr[1]",arr[1])
                 break;
          }
  }
  
 	// console.log("login_user",login_user);
 			
 			if(login_user==000000000000000000000000000000000)
 			{
 					res.send('not');
 			}
 			else if(sessions[login_user]==undefined)
 			{
 					
 					res.send('not');
 			}
 			else{
 				console.log("user:",sessions[login_user])
 				if(verify==1){
 					
 					res.send({username:sessions[login_user],verify:1});
 				}else{
 					res.send({username:sessions[login_user],verify:0});
 				}
 			}
 	
 	
  }
 }
 
 
 
/*
 1.判断用户是否注册成功,在登录页面监听
 2.登录时信息错误的用户返回error*/            
 async function checkRegister(req,res,next)
 {
	
	 // console.log("register-cookie",req.headers.cookie);
	  if(req.headers.cookie==undefined)
	 {
	 	console.log('无cookie信息');
		res.send('undefined');//not
	 }
	 else{
		 //得到cookie数组
		  var arrCookie=req.headers.cookie.split('; ');
		   var  register_user;
		  for(var i=0;i<arrCookie.length;i++)
		  {
		 		 var arr= arrCookie[i].split("=");
		 		 // console.log("arr[0]",arr[0])
		 		if("register"==arr[0]){
		             register_user =arr[1];
		 			console.log("arr[1]",arr[1])
		                 break;
		          }
		  }
		
		  // console.log("arr-register",register_user);
		  console.log('register-user',registers[register_user])
	 
			 switch (registers[register_user]){
			 	case undefined:
					{
						console.log('if-1',registers[register_user])
						res.send('null');
						break;
					}
				
			 		
			 	case 'error':{
					console.log('if-2',registers[register_user])
					delCookie(register_user)
					res.send('error')
					break;
				}
 	
			 	case 'send':{
					console.log('if-3',registers[register_user])
					delCookie(register_user)//检查成功，删除注册regitsers存的键(上一个注册者)
					console.log('register-cookie键已删除')
					res.send('send');
					break;
				}
 			 	case 'reset':{
					console.log('if-4',registers[register_user])
					delCookie(register_user)//检查成功，删除注册regitsers存的键(上一个注册者)
					console.log('register-cookie键已删除')
					res.send('reset');
					break;
				}
 
			 	default:{
					console.log('if-5',registers[register_user])
					
					try{
						var r = await model.checkRegister1(registers[register_user]);
							delCookie(register_user)//检查成功，删除注册regitsers存的键(上一个注册者)
							console.log('register-cookie键已删除')
							res.send(r);
					}catch(e){
							res.send(e);
					}
					break;					
				}
					

 	
			 }
 	 
	 }
 
 
 }
 
 
 /*register-cookie只用一次就删除*/
 function delCookie(string){
	 delete registers[string];
 }
 
 
 

 
 /*检查邮箱是否已经在数据库中*/
  async  function compareEmail(req,res,next)
 {
 	 console.log('compareEmail-email',req.body);
 	 try{
 	 	var r = await model.compareEmail(req.body);
		 console.log('r-email',r);
 		res.send(r);
 	 }catch(e){
 		 console.log('e-email',e);
 	 	 res.send(e);
 	 }
 	 
 	 
 }
 
 /*检查用户名是否已经再数据库中*/
 async  function compareRegister(req,res,next)
 {
	 console.log('request-username',req.body);
	 try{
	 	var r = await model.checkRegister1(req.body);
 
		res.send(r);
	 }catch(e){
		 console.log('e',e);
	 	 res.send(e);
	 }
	 
	 
 }


/*退出登录*/
function logout(req,res,next){
 	var s = ('cookies?==',req.headers.cookie);
	 
	var ss = s.split('=');
 
		delete sessions[ss[1]];
		//用户退出后，当前登录用户值为null
		logining_user="null";
		res.header("Set-Cookie",`user=000000000000000000000000000000000; httponly`);
		console.log('sessions =',sessions)
		 
		res.redirect('http://localhost:8333/home.html',next);
}





/*
邮件激活：从服务端得到当前登录用户的信息，判断后
选择是否发送邮件：逻辑->如果当前有用户登录，且邮件未激活，调用email的发送邮件方法
*/
 async function sendMail(req,res,next)
 {
	console.log('loging-user',logining_user);
	if(logining_user==undefined||logining_user=='null')
	{
		console.log("当前无登录用户-sendMail")
	}
	//
	else{
		console.log('有来自登录用户的发邮件请求-sendMail');
		//执行发送邮件逻辑：生成一个12位数token令牌，存入数据库，并且作为参数加到邮件链接上
		var token =randomWord(false, 12)
		// console.log('token',token)
		try{
		var r= await email.sendMail(logining_user,token);
		console.log('send-email-right',r);	
		
		}catch(e){
		console.log('send-email-error',r);	
		}
	}

	//返回客户端，
	res.send(logining_user);
 }
 

 
 

 /*发送邮件后，跳转的路由
 用于完成邮箱的验证，并且清空token
 最后跳转到主页*/
 async	function aliveMail(req,res,next){
 	var arr=req.params.token.split(":");
 	var arr1=req.params.email.split(":");
  
 	console.log('req.token',arr[1])
 	console.log('req.email',arr1[1])
 	
 	try{
 		var r = await email.aliveMail(arr1[1],arr[1])
 		//验证成功，刷新认证
		verify=1;
		console.log('r=',r)
 		res.redirect('http://localhost:8333/home.html',next);
 	}catch(e){
 		//TODO handle the exception
 	}
 	
 }
 
 //生成随机串 token
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
} 
 
 
function init(server){
	server.post('/login',login);
	server.post('/register',register);
	//退出会话
	server.get("/logout",logout);
	
	server.post("/getKey",getKey);
	//检查登录状态
	server.get("/checklogin",checklogin);
	server.get('/checkRegister',checkRegister);
	server.post('/compareRegister',compareRegister);
	server.get('/sendMail',sendMail);
	server.post('/compareEmail',compareEmail);
	server.get('/aliveMail/:token/:email',aliveMail);
	server.head('/aliveMail/:token/:email',aliveMail);
	server.get('/SetPass/:token/:email',SetPass);
	server.head('/SetPass/:token/:email',SetPass);
	server.post('/reset',reset);
	server.post('/checkEmail',checkEmail);
 
 
 
}
module.exports ={init}
