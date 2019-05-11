   function $(id){
 		return typeof id==="string"?document.getElementById(id):null;
 	}
function change(str1,str2){
		
		$(str1).style.visibility='hidden';
		$(str1).style.display='none';
		$(str2).style.visibility='visible';
		$(str2).style.display='block';
	}