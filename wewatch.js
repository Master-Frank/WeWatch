// ==UserScript==
// @name         weWatch xxxx
// @version      1.0
// @description  Watch weWatch xxxxx
// @author       八个葫芦娃
// @match        *://*/*
// @grant        none
// ==/UserScript==


(function(){
    // 数据    
    let dataType = {
        updateMessage: null
    }  

    // 入口
    class mainSet {
        constructor() {
            // 初始基础数据
            this.key = "key";

            // 房间html+css


            // 房间按钮
            this.createRoomButton = document.querySelector('#createRoom');
            this.joinRoomButton = document.querySelector("#joinRoom");
            this.exitRoom = document.querySelector("#exitRoom");

            this.createRoomButton.onclick = this.createRoomButtonOnClick.bind(this);
            this.joinRoomButton.onclick = this.joinRoomButtonOnClick.bind(this);
            this.exitRoom.onclick = (() => {
                window.setRoom.exitRoom();
            });

            this.inputName = document.querySelector('#nameInput');
            this.inputPassword = document.querySelector("#RoomPasswordInput");

            this.text = document.querySelector("#text");
        }

        // 初始化数据
        Init() {
            const data = this.GetRoomInfo()
            if (data) {
                if (data.name) {
                    this.inputName.value = data.name;
                }
                if (data.password) {
                    this.inputPassword.value = data.name;
                }
            }
        }
        
        // 获取房间信息
        GetRoomInfo() {
            try {
                const data = JSON.parse(sessionStorage.getItem(this.key) || '');
                if (data && (data.name || data.password)) {
                    return data;
                }
                return null;
            } catch {
                return null;
            }
        }

        // 设置房间信息
        setRoomInfo(name, password) {
            const data = JSON.stringify({ name, password });
            sessionStorage.setItem(this.key, data);
        }

        // 房间按钮
        createRoomButtonOnClick() {
            let name = this.inputName.value;
            let password = this.inputPassword.value;
            this.setRoomInfo(name, password);
            window.setRoom.createRoom(name, password)
        }
        joinRoomButtonOnClick() {
            let name = this.inputName.value;
            this.setRoomInfo(name);
            window.setRoom.joinRoom(name)
        }

        // 更新信息
        updateMessage(text, color) {
            this.text.innerHTML = text;
            this.text.style.color = color;
        }
    }

    class setRoom {
        constructor() {
            this.roleType = {
                master: 0,
                menber: 1,
                null:2
            }
            this.name = ""
            this.password = ""
            this.role = this.roleType.null
        }

        // 设置用户信息
        setRoleInfo(role) {
            this.role = role
            switch (role) {
                case this.roleType.master:
                    document.querySelector("#RoleText").innerHTML = "房主";
                    break;
                case this.roleType.menber:
                    document.querySelector("#RoleText").innerHTML = "房客";
                    break;
                default:
                    document.querySelector("#RoleText").innerHTML = "";
                    break;
            }
        }

        // 加入
        async joinRoom(name) {
            try {
                this.name = name;
                this.setRoleInfo(this.roleType.menber);
            } catch (e) {}
        }

        // 退出
        exitRoom() {
            window.mainSet.inputName.value = "";
            window.mainSet.inputPassword.value = "";
            this.name = "";
            this.setRoleInfo(this.roleType.null);
        }

        // 创建
        async createRoom(name, password) {
            try {
                this.setRoleInfo(this.roleType.master);
                this.name = name;
                this.password = password;
            } catch (e) { this.updateMessage(e, "red") }
        }

        // 上传信息
        PostMessage(window, data) {
            if (/\{\s+\[native code\]/.test(Function.prototype.toString.call(window.postMessage))) {
                window.postMessage(data, "*");
            } else {
                if (!this.NativePostMessageFunction) {
                    let temp = document.createElement("iframe");
                    document.body.append(temp);
                    this.NativePostMessageFunction = temp.contentWindow.postMessage;
                }
                this.NativePostMessageFunction.call(window, data, "*");
            }
        }

        sendMessage(type, data) {
            this.PostMessage(window.top, {
                type: type,
                data: data
            });
        }

        // 更新信息
        updateMessage(text, color) {
            if (window.self != window.top) {
                this.sendMessage(dataType.updateMessage, { text: text + "", color: color });
            } else {
                window.mainSet.updateMessage(text + "", color);
            }
        }
    }

    if (window.mainSet === undefined) {
        window.mainSet = null;
        window.mainSet = new mainSet();
    }
    if (window.setRoom === undefined) {
        window.setRoom = null;
        window.setRoom = new setRoom();
    }
})