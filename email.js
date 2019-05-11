 
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '517225641@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'kgrclofpfseebhff'
    }
});




 module.exports = transporter;
 
 