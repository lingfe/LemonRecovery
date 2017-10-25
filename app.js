/**  
 *   作者:  lingfe 
 *   时间:  2017-10-21
 *   描述:  app
 * 
 * */
import config from './config/config'
import request from './assets/plugins/request'
import md5 from './utils/md5.js'

App({
  config, //配置信息
  request,//请求
  md5,    //md5加密

  //验证非空
  checkInput: function (data) {
    if (data == null || data == undefined || data == "" || data == 'null') {
      return true;
    }
    if (typeof data == "string") {
      var result = data.replace(/(^\s*)|(\s*$)/g, "");
      return result.length == 0 ? true : false;
    } else {
      return false;
    }
  },

  //当前时间
  getDateTime: function () {
    var dateTime = new Date().toLocaleString();
    return dateTime;
  },

  //时间间隔，传入一个时间计算与当前时间的间隔
  getTimeInterval(date) {
    var date1 = new Date(date);    //开始时间
    var date2 = new Date();    //结束时间
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数

    //计算出相差月
    var months = (date2.getFullYear() - date1.getFullYear()) * 12;
    if (months != 0) {
      return months + "月";
    }

    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    if (days != 0) {
      return days + "天";
    }

    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    if (hours != 0) {
      return hours + "小时";
    }

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    if (minutes != 0) {
      return minutes + "分钟";
    }

    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    if (seconds != 0) {
      return seconds + "秒";
    }
  },

  //用户数据
  globalData: {
    userInfo: null,                 //用户数据
    openid: null,                   //微信用户id

    loginAppid: '3DF7469FD3A1485B95ED16ED794780A8',  //登录服务器的appid
    appid: 'wxdb07051dc3fc031e',                    //小程序id
    secret: 'b2dec689f9b117a311891c6ac5ae9407',     //小程序的 app secret
    token: '31963CBD8CA24DEFB48B9799766F0583',      //请求唯一标识
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})