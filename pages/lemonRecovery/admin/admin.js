/**  
 *   作者:  lingfe 
 *   时间:  2017-10-28
 *   描述:  管理员
 * 
 * */
var app = getApp();

Page({

  //页面的初始数据
  data: {
    tabs: ["未处理", "已处理","不处理"],   //tab菜单列
    activeIndex: 0,         //tab切换下标
    sliderOffset: 0,        //坐标x
    sliderLeft: 0,          //坐标y
    list: null              //数据
  },  

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: msg,
      showCancel: false,
    });
  },
  
  //tab点击切换
  tabClick: function (e) {
    //当前
    var that = this;
    var name = e.currentTarget.dataset.name;
    if(name == "未处理"){
      //未处理
      that.getlemonRecovery(that,0);
    }else if(name == "已处理"){
      //已处理
      that.getlemonRecovery(that,1);
    } else if (name == "不处理"){
      //不处理
      that.getlemonRecovery(that,2);
    }

    //设置
    that.setData({
      list:null,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  
  //修改预约状态
  Btntap:function(e){
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
            id: e.currentTarget.id,                        //预约id
            state: e.currentTarget.dataset.state           //预约状态,0=未处理,1=已处理,2=不处理
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(res){
      that.getlemonRecovery(that, 0);
    });
  },

  //页面加载
  onLoad: function (options) {
    var that = this;
    that.showModal("欢迎您！管理员");
    //默认获取未处理
    that.getlemonRecovery(that,0);
	
	  //设置tab
    var sliderWidth=50;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  //获取预约
  getlemonRecovery: function (that,state) {
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
            state: state           //预约状态,0=未处理,1=已处理,2=不处理
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      if (res.data.rows.length != 0) {
        that.setData({
          list: res.data.rows
        });
      }else{
        that.setData({
          list: null
        });
      }
    });
  }
})