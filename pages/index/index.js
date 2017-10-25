/**  
 *   作者:  lingfe 
 *   时间:  2017-10-21
 *   描述:  首页
 * 
 * */
//获取应用实例
var app = getApp()

Page({
  data: {
    index:0,
    arr: ['本周六', '本周日']
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: msg,
      showCancel: false,
    });
  },

  //提交预约
  submitForm:function(e){
    var that = this;

    //上门时间
    var doorTime = e.detail.value.doorTime;
    //预约地点
    var yuyueAdress = e.detail.value.yuyueAdress;
    if (app.checkInput(yuyueAdress)) {
      that.showModal("预约地点不能为空!");
      return;
    }

    //详细地址
    var adressInfo = e.detail.value.adressInfo;
    if (app.checkInput(adressInfo)) {
      that.showModal("详细地址不能为空!");
      return;
    }

    //对您称呼
    var cellYou = e.detail.value.cellYou;
    if (app.checkInput(cellYou)) {
      that.showModal("称呼不能为空!");
      return;
    }

    //对您称呼
    var phone = e.detail.value.phone;
    if (app.checkInput(phone)) {
      that.showModal("联系电话不能为空!");
      return;
    }

    //保存预约
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'lemonRecovery',           //预约表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            personalId: wx.getStorageSync("personalId"),  //用户id
            doorTime: doorTime,               //什么时间
            yuyueAdress: yuyueAdress,         //预约地点
            adressInfo: adressInfo,           //详细地址
            cellYou: cellYou,                 //对您称呼
            phone:phone,                      //联系电话
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(res){
      that.showModal("预约成功!");
    });
  },

  //上门时间
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //发起登录请求
  loginRequest: function (that) {
    //地址
    var url = app.config.basePath_sys + "api/plug/save";
    //请求头
    var header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    //参数
    var time = new Date().getTime();
    var token = app.md5.hexMD5(app.globalData.token + time.toString()).toUpperCase();
    var data = {
      timeStamp: time,
      token: token,
      reqJson: JSON.stringify({
        nameSpace: "sys_userinfo",
        scriptName: "com.dahuo.plugin.impl.WxLgPlugin",
        nameSpaceMap: {
          rows: [{
            openid: wx.getStorageSync('openid'),         //用户id
            realname: that.data.userInfo.nickName,
            avatarUrl: that.data.userInfo.avatarUrl,
            appId: app.globalData.loginAppid,
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data,
      function (res) {
        console.log(res);
        if (res.data.status === 1) {
          if (res.data.rows == null) return;
          //提示
          wx.showToast({ title: res.data.message, icon: 'ok', duration: 2000, });
          //得到cookie
          var cookie = res.header["Set-Cookie"].split(",")[0].split(";")[0] + ";";

          //保存在本地缓存中
          wx.setStorageSync("cookie", cookie);
          wx.setStorageSync("time", time);
          wx.setStorageSync("token", token);
          //得到个人id，保存在本地缓存中
          var personalId = res.data.rows.id;
          var user = res.data.rows;
          wx.setStorageSync("personalId", personalId);
          wx.setStorageSync("user", user);

          //登录成功！跳转到首页
          wx.switchTab({
            url: '/pages/index/index',
          });
        }
      }, function (res) {
        //提示
        wx.showToast({ title: "请求失败!", icon: 'loading', duration: 2000, });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //自动登录第一步，获取openid
    that.getOpenId(that);
  },

  //获取openid
  getOpenId: function (that) {
    //调用登录接口
    wx.login({
      success: function (logRes) {
        //获取openid
        var url = app.config.login_sys + 'sns/jscode2session';
        var data = {
          appid: app.globalData.appid,
          secret: app.globalData.secret,
          js_code: logRes.code,
          grant_type: 'authorization_code'
        }
        //发送请求
        app.request.reqGet(url, data,
          function (res) {
            app.globalData.openid = res.data.openid;
            wx.setStorageSync('openid', res.data.openid);
            that.setData({ openid: res.data.openid });
            //自动登录第二步，获取微信用户
            that.getUserInfo(that);
          });
      }, fail: function (res) {
        console.log(res);
      }
    });
  },

  //自定义获取用户数据
  getUserInfo: function (that) {
    //调用登录接口
    wx.login({
      success: function () {
        //获取用户
        wx.getUserInfo({
          success: function (res) {
            app.globalData.userInfo = res.userInfo
            wx.setStorageSync('userinfo', res.userInfo);
            that.setData({ userInfo: res.userInfo });
            ////自动登录第三步，发送登录服务器请求
            that.loginRequest(that);
          }
        });
      }
    })
  },
  
})
