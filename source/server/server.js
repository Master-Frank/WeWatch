/*
 * @Author: qinanm wenmumu_qinan@163.com
 * @Date: 2022-08-06 16:47:49
 * 持续学习中...
 */
const Websocket = require("websocket").server;
const http = require("http");

// 创建 HTTP 服务，作为第一次握手连接使用
const httpServer = http.createServer().listen(8080, () => {
  console.log("http://127.0.0.1:8080");
});

// 创建 websocket 服务实例
const wsServer = new Websocket({
  //选择刚刚创建的http后台服务器为WebSocket服务器
  httpServer: httpServer,
  autoAcceptConnections: false,
});

// 保存链接池
let conArr = [];

// 监听 ws 请求事件
wsServer.on("request", (request) => {
  // 获取链接示例
  let connection = request.accept();
  // 保存链接池
  conArr.push(connection);
  // 输出连接信息
  console.log("已连接，连接数为" + conArr.length);
  // 监听消息事件
  connection.on("message", (msg) => {
    // 输出接收到的数据
    console.log(msg);
    // 循环链接池，推送广播消息至客户端
    for (let i = 0; i < conArr.length; i++) {
      conArr[i].send(msg.utf8Data);
    }
  });
  // 监听关闭
  connection.on("close", function (reasonCode, description) {
    //某个连接删除的时候，删除数组c中储存的对应连接
    //获取当前索引
    var index = conArr.indexOf(connection);
    //删除
    conArr.splice(index, 1);
    console.log("连接关闭，当前连接数为", conArr.length);
  });
});
