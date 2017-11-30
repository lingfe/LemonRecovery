/**  
 *   作者:  lingfe 
 *   时间:  2017-11-08
 *   描述:  兑换订单
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
  },

  //确认收货
  bindtapConfirmReceipt:function(e){
    var that=this;
    var id = e.currentTarget.id;
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };

    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'convertibleOrder',           //订单兑换表
        scriptName: 'Query',
        cudScriptName: 'Update',
        nameSpaceMap: {
          rows: [{
            state: 2,    //状态,0=（已下单,未发货）,1=（已发货,未确认),2=(已收货,已确认)
            personalId: wx.getStorageSync('personalId'),//用户id
            id: id,  //订单id
          }]
        }
      })
    };

    //提示
    wx.showModal({
      title: '确认收货',
      content: '是否确认？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          //发送请求
          app.request.reqPost(url, header, data, function (res) {
            console.log(res);
            //获取我的兑换订单
            that.getMyconvertibleOrder(that);
          });
        }
      }
    });
  },

  //页面加载
  onLoad:function(opention){
    var that=this;
    //获取我的兑换订单
    that.getMyconvertibleOrder(that);
  },

  //获取我的兑换订单
  getMyconvertibleOrder:function(that){

    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'convertibleOrder',           //兑换订单表
        scriptName: 'Query',
        nameSpaceMap: {
          orderByClause: 'mdate desc',
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

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
    
  },

  //生命周期函数--监听页面显示
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