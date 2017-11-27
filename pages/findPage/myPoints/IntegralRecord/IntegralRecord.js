/**  
 *   作者:  lingfe 
 *   时间:  2017-11-13
 *   描述:  积分纪录
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,//积分纪录数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //获取积分纪录
    that.getIntegralRecord(that);
  },

  //获取积分纪录
  getIntegralRecord: function (that) {
    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'recyclingRecords',           //积分回收纪录表
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