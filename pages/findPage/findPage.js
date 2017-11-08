/**  
 *   作者:  lingfe 
 *   时间:  2017-11-07
 *   描述:  发现
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  //积分兑换
  bindtapPoints:function(e){
    wx.navigateTo({
      url: "/pages/findPage/myPoints/myPoints",
    })
  }, 

  //柠檬公益
  bindtapLemonCommonweal:function(e){
    wx.navigateTo({
      url: "/pages/findPage/lemonCommonweal/lemonCommonweal"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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