/*
url /login
data: username ll passwd 1234
d = new FormData;
d.append("username","ll") 
d.append("passwd","")
method : GET POST 
callback function(result){}
*/
function urlCall(url, data, method, callback) {
	var xh = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	if (!xh) return;
	xh.onreadystatechange = function() {
		 
		if (xh.readyState == 4) { // 4 = "loaded"
			if (xh.status == 200) { // 200 = OK
				callback(xh.responseText);
			}
		}
	}
	xh.open(method, url, true);
	xh.send(data);
	
}
