var transporter = require('../email');
 var db = require('../db');
 var crypto = require('crypto');
 var md5 = crypto.createHash('md5');

/*在用户尚未完成邮箱验证的情况下，用户登录主页
发起的邮箱验证操作
*/
function sendMail(u,token)
{	
	console.log('email.u-sendMail:',u);
	console.log('email.token-sendMail:',token);
	return new Promise(function(succ,fail){
		try{
			 /*
			 根据传过来的用户名，在数据库中找到email_verify，判断是否激活
			 如果激活则无需再进行发送邮件验证操作
			 */
				db.query("select email_verify from ta01  where username=?",[u],
				function (error, results, fields) {
				
				  if (error) throw error;
				  if(results[0].email_verify==1)
				  { //已激活,无需操作
					  succ('ok');
			  	  }else{
					  //未激活,先把令牌存入数据库，然后再发送邮件链接
					  db.query("update ta01 set email_token =? where username =? ",[token,u],
					  function(error,results,fields){
					  if (error) throw error;
				 
						  if(results.affectedRows>0)
						  {	//插入成功->获取邮箱
						 db.query("select email from ta01  where username=? ",[u],
						  function(error,results,fields){
						  if (error) throw error;	
						  // console.log('email:',results[0].email);
						  if(results[0].email!=undefined){
						  	console.log('未验证邮箱的用户的邮箱',results[0].email)
							//获取邮箱成功 开始发邮件
							send(results[0].email,token,"注册",'aliveMail');
						   succ('yes1');
						  }
						  else{
							  //没有获取到邮箱
						  succ('no1');
						  }
						  	
						  });
 
						  }else{
							  //令牌插入邮箱失败
							  succ('no2');
						  }
					  
					  });
					 
				  }
  
				});
			
			
		}catch(e){
			//TODO handle the exception
			succ('not');
		}
		
	});
	
	
}


/*
 尚未完成激活的用户点击链接后，服务端调用该方法
*/
function  aliveMail(u,token){
	return new Promise(function(succ,fail){
		//token 验证token后 把token清空并且激活邮件权限
		try{
						 db.query("select email_token from ta01  where email=? ",[u],
						  function(error,results,fields){
						  if (error) throw error;	
						 
						  if(results[0].email_token!=undefined){
						  	console.log('model-token',results[0].email_token)
							//令牌对比
							if(token==results[0].email_token){
								//令牌清空，邮件激活
								alive(u);
								setNull(u);
								succ('yes1');
							}
							else{
								//令牌错误
								succ('no1');
							}
					
						  }
						  else{
							//无信息  
						  succ('no2');
						  }
						  	
						  });			
		}catch(e){
			//TODO handle the exception
		}
		
	});
}



 /*发送重置密码邮件
 先存令牌再发邮件
 */

  function getKeySendMail(Email,token){
	return new Promise( async function(succ,fail){
		try{
		 var result =  await insertToken('email',Email,token);
		 console.log('result=',result)
		 if(result=='ok'){
			//令牌插入成功，开始发送邮件 
		 send(Email,token,"密码重置",'SetPass');
		 succ('ok');
		 }else{
			 //插入失败，返回错误
			 succ('1');
		 }
		}catch(e){
		succ('2');
		}
	});
}

 
 /*存入令牌*/
 function insertToken(way,value,token){
 	return new Promise(function(succ,fail){
		try{
			 db.query("update ta01 set email_token =? where "+way+" =? ",[token,value],
			  function(error,results,fields){
			  if (error) throw error;
				if(results.affectedRows>0){
						succ('ok');
				}else{
						succ('no');
				}
			
			})
		}catch(e){
			  succ('error');
		}
	})
 }
 
 
 /*执行参数对比操作：
 1.验证令牌正确性
 2.令牌清零*/
 function setPass(Email,token){
	return new Promise( async function(succ,fail){
		 try{
			 //令牌验证
			var r = await checkToken(Email,token);
			if(r==1)
			{
			//令牌验证通过，令牌置零
			setNull(Email);
			succ('1');
			}
			else{
				//验证失败
				succ('2');
			}
		}catch(e){
			//TODO handle the exception
			succ('3');
		}
	})
 }
 
 /*
 密码重置
 更新数据库密码
 */
 function reset(Email,password){
 	return new Promise(function(succ,fail){
 		try{
 				 db.query("update ta01 set passwd =md5(?) where email =? ",[password,Email],
 				  function(error,results,fields){
 				  if (error) throw error;
 					if(results.affectedRows>0){
 						console.log('ret-result',results.affectedRows)
 							console.log('更新成功')
 							succ('ok');
 					}else{
 							console.log('更新失败')
 							succ('no1');
 					}
 				
 				})		
 		}catch(e){
 			succ('no2')
 		}
 	});
 }
 
 /*验证令牌正确性*/
 
 function checkToken(Email,token){
	return new Promise(function(succ,fail){
		try{
			 db.query("select email_token from ta01  where email=? ",[Email],
			 function(error,results,fields){
			 if (error) throw error;	
			 	console.log('check-result',results)
				if(results[0].email_token==token)
				{//令牌对比正确,
			
 				succ('1');
				} else{
					//令牌对比错误
					succ('2');
				}
				 })
		}catch(e){
			//抛出异常
			 succ('3');
		}
	}) 
 }
 
 //激活邮件
function alive(u){
	try{
		db.query("update ta01 set email_verify =? where email =? ",[1,u],function(error,results,fields){
			  if (error) throw error;
			// console.log('results1',results.changedRows)
		})
			
		
	}
	catch(e){
	return 'error';	
	}
} 
//令牌清空

function setNull(u){
	try{
		db.query("update ta01 set email_token =? where email =? ",[0,u],function(error,results,fields){
		  if (error) throw error;
		// console.log('results2',results.changedRows)
		})
			
		
	}
	catch(e){
		return 'error';
	}
} 

/*发邮件
str4:url
str3:发邮件的目的
str2:token
str1:邮箱
*/
function send(str1,str2,str3,str4){
	 
	//填写邮件内容事宜
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '517225641@qq.com', // 发件地址
	    to: str1, // 收件列表
	    subject: 'My Blog', // 标题
	    //text和html两者只支持一种
	    // text: 'Hello world ?', // 标题
	    html: '<p>请点击下面的链接完成'+`${str3}`+'： <a href="http://localhost:8333/'+`${str4}`+'/:'+`${str2}`+'/:'+`${str1}`+'"> http://localhost:8333/'+`${str4}`+'/:'+`${str2}`+'/:'+`${str1}`+'  </a></p>' // html 内容
	 
	};
	
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.messageId);
		
	}); 
}

module.exports={sendMail,aliveMail,getKeySendMail,setPass,reset};