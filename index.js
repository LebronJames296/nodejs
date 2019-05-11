//入口文件
var restify = require('restify');
var server =restify.createServer();
var route_user = require('./route/user1');
server.use(restify.plugins.bodyParser({ mapParams: true }));


server.get('/*',
  restify.plugins.serveStatic({
    directory: './public'
  })
)
route_user.init(server);

server.listen(8333, function() {
  console.log('%s listening at %s', server.name, server.url);
});