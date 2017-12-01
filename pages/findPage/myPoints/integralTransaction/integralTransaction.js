/**  
 *   作者:  lingfe 
 *   时间:  2017-11-30
 *   描述:  积分交易
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBltype: 'shou',         //显示送分或者收分,默认收分
    integral:'',      //积分
    pwd:'',//密匙
  },

  //帮助
  bindtapbangzhu:function(e){
    var that=this;
    //判断指令
    if(that.data.isBltype == "shou"){
      that.showModal("说明:请输入密匙领取积分!");
    }else {
      that.showModal("说明: 好友根据您设置的密匙领取积分!");
    }
  },

  //送分或者收分
  bindtapIntegral:function(e){
    console.log(e.currentTarget.id);
    var that=this;
    that.setData({
      isBltype: e.currentTarget.id,
    });
  },

  //积分
  inputcontactPeople:function(e){
    var that = this;
    var integral = '';
    if (!app.checkInput(e.detail.value)){
      integral = parseFloat(e.detail.value);
      if (that.data.myContribution.lemonIntegral < integral) {
        that.showModal("您的积分不足!");
        return;
      }
    }

    that.setData({
      integral: integral,
      lemonIntegral: parseFloat(that.data.myContribution.lemonIntegral - integral),
    });
  },

  //密匙
  inputPwd:function(e){
    this.setData({
      pwd:e.detail.value
    });
  },

  //提交，送分或者收分
  binSbmint:function(e){
    var that=this;
    //判断送分或者收分
    if (that.data.isBltype =="shou")  {
      //收分
      that.getShou(that);
    } else if (that.data.isBltype == "so") {
      //送分
      that.setSo(that);
    }
  },

  //收分
  getShou:function(that){
    //验证非空
    if (app.checkInput(that.data.pwd)) {
      that.showModal("请输入密匙!");
      return;
    }

    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'integralTransaction',           //积分交易表
        scriptName: 'Query',
        nameSpaceMap: {
          rows: [{
            state: 0,//状态,0=未领取,1=已领取
            pwd: that.data.pwd,    //领取密匙
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      //验证非空
      if (!app.checkInput(res.data.rows)){
        var row = res.data.rows[0];
        //保存积分交易id
        wx.setStorageSync("integralTransaction_Id", row.id);
        wx.setStorageSync("integralTransaction_integral", row.integral);
        //修改我的柠檬积分
        var lemonIntegral = (row.integral + parseFloat(that.data.myContribution.lemonIntegral));
        that.setUpdateLemonIntegral(that, lemonIntegral);
      }else{
        that.showModal("密匙不对或已被领取!");
        that.setData({
          pwd: '',
        });
      }
    });
  },

  //修改我的贡献,柠檬积分
  setUpdateLemonIntegral: function (that, lemonIntegral) {
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
        cudScriptName: 'Update',
        nameSpaceMap: {
          rows: [{
            lemonIntegral: lemonIntegral,
            id: that.data.myContributionId,
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      if (that.data.isBltype == "shou"){
        //修改积分交易状态
        that.setUpdate(that);
      }
      //重新获取我的贡献、
      that.getContribtion(that);
    });
  },

  //修改积分交易状态
  setUpdate:function(that){
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'integralTransaction',           //积分交易表
        scriptName: 'Query',
        cudScriptName: 'Update',
        nameSpaceMap: {
          rows: [{
            state: 1, //设置未已领取
            id: wx.getStorageSync('integralTransaction_Id'),//积分交易id
            lq_personalId: wx.getStorageSync("personalId"),  //积分领取者
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      var integral = wx.getStorageSync('integralTransaction_integral');
      that.showModal("领取成功!积分+"+integral);
      that.setData({
        pwd:'',
      });
    });
  },

  //送分
  setSo:function(that){

    //验证非空
    if (app.checkInput(that.data.integral)){
      that.showModal("请输入积分!");
      return;
    }
    if (app.checkInput(that.data.pwd)){
      that.showModal("请输入密匙!");
      return;
    }

    //保存一条积分交易纪录
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'integralTransaction',           //积分交易表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            state: 0,                         //状态,0=未领取,1=已领取
            personalId: wx.getStorageSync("personalId"),  //积分发送者
            integral: that.data.integral,         //积分
            pwd:that.data.pwd,              //领取密匙
          }]
        }
      })
    };

    //提示
    wx.showModal({
      title: '提示',
      content: '是否确定送分？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          //发送请求
          app.request.reqPost(url, header, data, function (res) {
            if (!app.checkInput(res.data.rows)) {
              //修改我的柠檬积分
              var lemonIntegral = (that.data.myContribution.lemonIntegral - res.data.rows[0].integral);
              that.setUpdateLemonIntegral(that, lemonIntegral);
              that.showModal("发送成功!");
              that.setData({
                pwd: '',
                integral: '',
              });
            }
          });
        }
      }
    });
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: msg,
      showCancel: false,
    });
  },

  //获取我的贡献资源
  getContribtion: function (that) {
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
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      //验证是否为空如果为空就生成一条贡献
      if (app.checkInput(res.data.rows)) {
        that.setContribtion(that);
      } else {
        var rows = res.data.rows[0];
        rows.lemonIntegral = parseFloat(rows.lemonIntegral).toFixed(1);
        that.setData({
          myContribution: rows,
          lemonIntegral: rows.lemonIntegral,    //柠檬积分
          myContributionId:rows.id,     //贡献id
        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取我的贡献资源
    that.getContribtion(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})