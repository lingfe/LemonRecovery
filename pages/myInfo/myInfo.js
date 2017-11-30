/**  
 *   作者:  lingfe 
 *   时间:  2017-10-25
 *   描述:  我的
 * 
 * */
var app=getApp();

Page({
  data:{
    admin: ["oh4300CxufSClVEil0k7xNy24P5A", "oNWj80C6zKPwL2_muS08iIVtGhkA", "oh4300DFZdBeIGOoVKQK9OFuyPps", "oh4300BzivzPyMq9Uk05pF_GaVoc","oh4300LBMs6n0ylQ1H3XK1jC90YU"]
  }, 

  //我的预约
  bindtapReservation:function(e){
    wx.navigateTo({
      url: "/pages/myInfo/myReservation/myReservation",
    })
  },

  //我的预约
  userinfoBtntap:function(e){
    var that=this;
    var name = that.data.userInfo.userName;
    var admin=that.data.admin;
    for(var i=0;i<admin.length;++i){
      if (admin[i] == name ) {
        wx.navigateTo({
          url: "/pages/lemonRecovery/admin/admin",
        });
        return;
      } 
    }

    wx.navigateTo({
      url: "/pages/myInfo/myReservation/myReservation",
    });
  },

  //我的贡献
  bindtabContribtion:function(e){
    wx.navigateTo({
      url: "/pages/myInfo/myContribution/myContribution",
    });
  },

  //是否显示二维码
  consultationBtntap:function(e){
    this.setData({
      erweimaBl: this.data.erweimaBl==false?true:false,
    });
  },


  //设置我的贡献资源
  setContribtion: function (that){
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'myContribution',           //我的贡献表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            avatarUrl: that.data.userInfo.avatarUrl,//头像
            userName: that.data.userInfo.cnName,//名称
            personalId: wx.getStorageSync("personalId"),  //用户id
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      that.setData({
        myContribution: res.data.rows[0],
      });
    });
  },

  //页面显示时执行
  onShow:function(){
    var that = this;

    //获取用户信息
    var userinfo = wx.getStorageSync('user');
    that.setData({ userInfo: userinfo });
    //获取我的贡献资源,个人
    that.getContribtion(that);
    //获取我的贡献资源,所有
    that.getContribtionAll(that);
  },

  //获取我的贡献资源,所有
  getContribtionAll: function (that) {
    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'myContribution',           //我的贡献表
        scriptName: 'Query',
        nameSpaceMap: {
          rows: [{
            state:0,  //状态，0=正常  
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      //验证是否为空如果为空就生成一条贡献
      if (!app.checkInput(res.data.rows)) {
        var rows = res.data.rows;
        that.setData({
          myContributionAll: rows,
        });
      }
    });
  },

  //获取我的贡献资源,个人
  getContribtion:function(that){
    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'myContribution',           //我的贡献表
        scriptName: 'Query',
        nameSpaceMap: {
          rows: [{
            personalId: wx.getStorageSync("personalId"),  //用户id
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(res){
      console.log(res);
      //验证是否为空如果为空就生成一条贡献
      if (app.checkInput(res.data.rows)){
        that.setContribtion(that);
      } else {
        var rows = res.data.rows[0];
        rows.lemonIntegral = parseFloat(rows.lemonIntegral).toFixed(1);
        that.setData({
          myContribution: rows,
        });
      }
    });
  },
})