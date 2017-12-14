/**  
 *   作者:  lingfe 
 *   时间:  2017-10-25
 *   描述:  我的
 * 
 * */
var app=getApp();

Page({
  data:{
    admin: ["oh4300CxufSClVEil0k7xNy24P5A", "oNWj80C6zKPwL2_muS08iIVtGhkA", "oh4300DFZdBeIGOoVKQK9OFuyPps", "oh4300BzivzPyMq9Uk05pF_GaVoc","oh4300LBMs6n0ylQ1H3XK1jC90YU"], //管理员
    myContributionAll:[],//贡献数据
    pagenum: 1,              //分页，第几业
    pagesize: 1000,            //返回数据量
  }, 

  //我的预约
  bindtapReservation:function(e){
    wx.navigateTo({
      url: "/pages/myInfo/myReservation/myReservation",
    })
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
    });
  },

  //咨询柠檬提示
  bindtapShow: function (e) {
    this.showModal("请关注柠檬回收官方微信号，搜索“柠檬回收”");
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
    that.setData({ 
      userInfo: userinfo,  //用户信息
      myContributionAll: [],//贡献数据
      pagenum: 1,              //分页，第几业
      pagesize: 1000,            //返回数据量 
    });
    //获取我的贡献资源,个人
    that.getContribtion(that);
    //获取我的贡献资源,所有
    that.getContribtionAll(that);
  },

  //冒泡排序
  bubbleSort: function (array) {
    var i = 0,len = array.length,j, d;
    for (; i < len; i++) {
      for (j = 0; j < len; j++) {
        if (array[i].resourceContribution > array[j].resourceContribution) {
          d = array[j];
          array[j] = array[i];
          array[i] = d;
        }
      }
    }
    return array;
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
          pagenum: that.data.pagenum,          //当前业
          pagesize: that.data.pagesize,        //数据大小长度
          rows: [{
            state:0,  //状态，0=正常  
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      //获取原始贡献数据
      var pageList =that.data.myContributionAll;

      //验证是否为空
      if (!app.checkInput(res.data.rows)) {
        var rows = res.data.rows;
        that.setData({
          myContributionAll: that.data.myContributionAll.concat(res.data.rows),
        });
        //执行排序
        var array = that.bubbleSort(that.data.myContributionAll);
        //判断非空
        if (!app.checkInput(array)){
          that.setData({
            myContributionAll: array,
          });
        }  
      }else{
        //提示
        wx.showToast({
          title: '没有更多了!',
          icon: 'loading',
          duration: 1000,
        });
        return;
      }
    });
  },

  //用户下拉动作
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      pagenum: 1,         //第几页
      myContributionAll: []        //贡献数据  
    });
    that.getContribtionAll(that);
    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    var that = this;
    var num = that.data.pagenum;
    num++;
    that.setData({
      pagenum: num,
      isPrices: false,
    });
    that.getContribtionAll(that);

    //提示
    wx.showToast({
      title: '正在加载..',
      icon: 'loading',
      duration: 2000,
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