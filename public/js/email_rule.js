	function $(id){
		return typeof id==='string'?document.getElementById(id):null;
	}
	 function EmailRight(str,str1){
		 /*邮箱验证规则*/
		var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
		var obj = document.getElementById(str);
		var tip =document.getElementById(str1);
		// console.log('tip=',tip.innerText)
		// console.log('email=',obj.vaule)
		if(obj.value==="")
		{
			tip.innerText="邮箱不能为空";
			return false;
		}
		if(!reg.test(obj.value)){
			tip.innerText="邮箱格式错误";
			return false;
		}
		else{
			return true;
		}
	 }
	 

	 function checkNull(input,tips,name){
	 	/*判断输入框是否为空*/
	 var obj=$(input);
	 var tip=$(tips)
	 console.log('tip1=',tip.innerText)
	 console.log('input=',obj.innerText)
	 if(obj.value===""){
	 tip.innerText=name+='不能为空';
	 	return false;
	 }
	 else 
	  tip.innerText="";
	 return true;
	 }