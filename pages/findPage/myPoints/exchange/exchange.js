/**  
 *   作者:  lingfe 
 *   时间:  2017-11-08
 *   描述:  兑换商品
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      contactPeople:null, //联系人
      phone:null, //联系电话
      adressInfo:null,//详细地址
      num: 0,   //数量
      surplus:0,//剩余
    },
  },

  //加
  bindtapJia:function(e){
    var that=this; 

    if (that.data.form.num < that.data.info.surplus){
      that.setData({
        'form.num': (that.data.form.num + 1),
        'form.surplus': (that.data.form.surplus - 1),
      });
    }
  },

  //减
  bindtapJian:function(e){
    var that=this;
    if(that.data.form.num > 0){
      that.setData({
        'form.num': that.data.form.num - 1,
        'form.surplus': (that.data.form.surplus + 1),
      });
    }
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: msg,
      showCancel: false,
    });
  },

  //联系人
  inputcontactPeople:function(e){
    this.setData({
      'form.contactPeople': e.detail.value,
    });
  },

  //联系电话
  inputphone:function(e){
    this.setData({
      'form.phone': e.detail.value
    });
  },

  //联系地址
  inputadressInfo:function(e){
    this.setData({
      'form.adressInfo':e.detail.value
    });
  },

  //确认兑换,订单提交
  submitOrder:function(e){
    var that=this;
    var form=that.data.form;
    var info=that.data.info;

    if(form.num<=0){
      //提示
      that.showModal('请选择兑换数量!');
      return;
    }

    //验证非空
    if (app.checkInput(form.contactPeople)){
      that.showModal('联系人不能为空!');
      return;
    }

    if (app.checkInput(form.phone)){
      that.showModal('联系电话不能为空!');
      return;
    }

    if (app.checkInput(form.adressInfo)){
      that.showModal("详细地址不能为空!");
      return;
    }

    var lemonIntegral = (that.data.form.num * that.data.info.surplus);
    if (that.data.lemonIntegral < lemonIntegral){
      that.showModal("您的积分不足，兑换失败!");
      return;
    }

    //保存兑换订单
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'convertibleOrder',           //预约表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            state: 0,                         //预约状态,0=已提交,1=已完成
            personalId: wx.getStorageSync("personalId"),  //用户id
            adressInfo: form.adressInfo,           //详细地址
            contactPeople: form.contactPeople,     //联系人
            phone: form.phone,                     //联系电话
            imgUrl: info.imgUrl,//商品图片
            title: info.title,//商品标题
            integral: info.integral,  //积分
            totalIntegral: info.integral * form.num, //合计积分
            number:form.num,//兑换数量
          }]
        }
      })
    };

    //提示
    wx.showModal({
      title: '确认兑换',
      content: '是否确认？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          //发送请求
          app.request.reqPost(url, header, data, function (res) {
            //修改库存
            that.updateNum(that);
          });
        }
      }
    });
  },

  //清空表单
  closeForm: function (that) {
    that.setData({
      form:{
        adressInfo: null,
        contactPeople: null,
        num: 1,
        phone: null,
      }
    });
  },

  //修改库存
  updateNum:function(that){
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'convertibleCommodity',           //兑换商品表
        scriptName: 'Query',
        cudScriptName: 'Update',
        nameSpaceMap: {
          rows: [{
            surplus: (that.data.info.surplus-that.data.form.num),
            id: that.data.info.id,
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      //修改贡献积分
      that.setUpdateLemonIntegral(that);
    });
  },

  //修改柠檬积分
  setUpdateLemonIntegral:function(that){
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var lemonIntegral = (that.data.lemonIntegral - (that.data.form.num * that.data.info.surplus));
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'myContribution',           //兑换商品表
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
      //清空表单
      that.closeForm(that);
      //根据id获取兑换商品
      that.getconvertibleCommodityId(that);
      
      //提示
      wx.showModal({
        title: '兑换成功!',
        content: '是否继续?',
        confirmText: "继续",
        cancelText: "返回",
        success: function (res) {
          if (!res.confirm) {
            //得到打开的页面
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];   //上一个页面

            //返回上一页
            wx.navigateBack();
          }
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      myContributionId: options.myContributionId,
      lemonIntegral: options.lemonIntegral,
    });
    //根据id获取兑换商品
    that.getconvertibleCommodityId(that);
  },

  //根据id获取兑换商品
  getconvertibleCommodityId: function (that) {
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
            id: that.data.id,
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      var info = res.data.rows;
      if (info.length != 0) {
        if (info[0].surplus <=0 ){
          that.setData({
            info: info[0],
            'form.surplus': 0,
          });
          //提示
          that.showModal('商品剩余不足不能兑换!');
        }else{
          that.setData({
            info: info[0],
            'form.num': 1,
            'form.surplus': (info[0].surplus - 1)
          });
        }
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