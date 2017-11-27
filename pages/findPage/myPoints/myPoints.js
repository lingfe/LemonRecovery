/**  
 *   作者:  lingfe 
 *   时间:  2017-11-7
 *   描述:  我的积分
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,//兑换商品数据
  },

  //积分纪录
  bindtapIntegralRecord:function(e){
    wx.navigateTo({
      url: "/pages/findPage/myPoints/IntegralRecord/IntegralRecord"
    })
  },

  //兑换订单
  bindtapPointsOrder:function(e){
    wx.navigateTo({
      url: "/pages/findPage/myPoints/pointsOrder/pointsOrder",
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取我的贡献资源
    that.getContribtion(that);
    //获取兑换商品信息
    that.getconvertibleCommodity(that);
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
        });
      }
    });
  },

  //获取兑换商品信息
  getconvertibleCommodity:function(that){
    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'convertibleCommodity',           //兑换商品表
        scriptName: 'Query',
        nameSpaceMap: {
          rows: [{
            df:0,  
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(res){
      var list = res.data.rows;
      if (list.length != 0) {
        that.setData({
          list: list,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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