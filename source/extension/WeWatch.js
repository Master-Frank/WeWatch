// 连接上服务器
let ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  if (ws.readyState === 1) {
    console.log("连接已建立");
  }
};

// 通用video事件函数 ，监听视频的变化，并使用ws发送数据
function videoEvent(type) {
  let vdMsg = {};
  document.querySelector("video").addEventListener(type, function () {
    vdMsg.type = type;
    vdMsg.href = window.location.href; // 当前页面的url
    switch (type) {
      // case只能判断一个值，所以不能写成 play || pause， 那么这两个条件都运行相同代码的正确写法如下（并列不写break即可）
      case "play":
      case "pause":
        vdMsg.currentTime = this.currentTime;
        break;
      case "ratechange":
        vdMsg.playbackRate = this.playbackRate;
        break;
      default:
        break;
    }
    ws.send(JSON.stringify(vdMsg));
  });
}

// 视频变化需要用到的数据 播放事件， 停止事件， 倍数事件, 因缓冲等待时间到开始播放
let videoMsgs = ["play", "pause", "ratechange"];

// 循环注入不同的video事件
for (vedioType of videoMsgs) {
  videoEvent(vedioType);
}

// ws接收数据
ws.onmessage = (backData) => {
  // 接收播放的信息
  let data = JSON.parse(backData.data);
  console.log("Message from server:", backData.data);
  if (data.href === window.location.href) {
    switch (data.type) {
      case "play":
        document.querySelector("video").play();
        document.querySelector("video").currentTime = data.currentTime;
        break;
      case "pause":
        document.querySelector("video").pause();
        document.querySelector("video").currentTime = data.currentTime;
        break;
      case "ratechange":
        document.querySelector("video").playbackRate = data.playbackRate;
        break;
    }
  }
};
