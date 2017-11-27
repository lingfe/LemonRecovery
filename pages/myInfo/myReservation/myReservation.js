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
    list:null,
    cst:false,      //隐藏
  },

  //取消预约
  bindtapcancel:function(e){
    var that=this;
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
            state: 3,      //预约状态,0=(已提交,未处理),1=(已完成,已处理),2=(未采纳,不处理),3=(已取消,)
            id: e.currentTarget.id
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(){
      wx.showModal({title: '已取消', content: '' });
      //刷新
      that.getlemonRecovery(that);
    });
  },

  //显示或隐藏表单
  CalculationlistBindtap:function(e){
    console.log(e);
    if (e.currentTarget.id=="eixt"){
      this.setData({
        cst:this.data.cst==false?true:false
      });
    }
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