// u{username"" name"" password""}
var db = require('../db');
function register(u)
{
	return new Promise(function(succ,fail){
		try{
			db.query('INSERT INTO ta01 (username,name,passwd) VALUES(?,?,md5(?))',[u.username,u.name,u.passwd],
			function (error, results, fields) {
			  if (error){
				 succ(1);
				  console.log(results)
			}
			  else{
				 succ(results); 
			  }
			});
		}catch(e){
			succ(2);
		}
		
	}); 
}



function login(u)
{
		return new Promise(function(succ, fail) {
		try {
				db.query("select * from ta01  where username=? and passwd=md5(?)",[u.username,u.passwd],
				function (error, results, fields) {
				  if (error) throw error;
				  if(results.length>0){
				  console.log(results[0]);
				  }else{
				  console.log('not found');
				  }
				 
				}); 
		} catch (e) {
			succ(2)
		
		}
		
	}) 
}

module.exports = {register,login};
// 
// async doit(u)
// {
// 	var r=await =register(u);
// 	console.log(r);
// 	
// }
// 
// doit({username:'test01',name:'james',passwd:'123456'});
