/**  
 *   作者:  lingfe 
 *   时间:  2017-10-27
 *   描述:  我的预约
 * 
 * */
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getlemonRecovery(that);
  },

  //获取预约
  getlemonRecovery: function (that){
    //保存预约
    var url = app.config.basePath_web + "api/exe/get";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'lemonRecovery',           //预约表
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
      if(res.data.rows.length!=0){
        that.setData({
          list: res.data.rows
        });
      }
    });
  }
})