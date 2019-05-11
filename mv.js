
var fs = require('fs');
function mv(path1,path2){
	
	
	var readStream = fs.createReadStream(path1);
	var writeStream = fs.createWriteStream(path2);
	readStream.pipe(writeStream);
	console.log("拷贝完成")
	
}
mv('e:/5.txt','e:/3.txt');
