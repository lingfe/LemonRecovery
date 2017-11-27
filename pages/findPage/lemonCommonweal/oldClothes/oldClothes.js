/**  
 *   作者:  lingfe 
 *   时间:  2017-11-07
 *   描述:  申领旧衣
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      contactPeople:null,//联系人
      phone:null,//联系电话
      adressInfo:null,//联系地址
      applyReason:null,//申请原因
      demandExplain:null,//需求说明
    },//表单
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: msg,
      showCancel: false,
    });
  },

  //联系人
  inputcontactPeople: function (e) {
    this.setData({
      'form.contactPeople': e.detail.value,
    });
  },

  //联系电话
  inputphone: function (e) {
    this.setData({
      'form.phone': e.detail.value
    });
  },

  //联系地址
  inputadressInfo: function (e) {
    this.setData({
      'form.adressInfo': e.detail.value
    });
  },

  //申领原因
  inputapplyReason:function(e){
    this.setData({
      'form.applyReason':e.detail.value
    });
  },

  //需求说明
  inputdemandExplain:function(e){
    this.setData({
      'form.demandExplain':e.detail.value
    });
  },

  //申领旧衣
  setapplyOldclothes:function(e){
    var that=this;
    var form=that.data.form;

    //验证非空
    if (app.checkInput(form.contactPeople)) {
      that.showModal('联系人不能为空!');
      return;
    }

    if (app.checkInput(form.phone)) {
      that.showModal('联系电话不能为空!');
      return;
    }

    if (app.checkInput(form.adressInfo)) {
      that.showModal("详细地址不能为空!");
      return;
    }

    if (app.checkInput(form.applyReason)){
      that.showModal("申请原因不能为空!");
      return;
    }

    if (app.checkInput(form.demandExplain)){
      that.showModal("需求说明不能为空!");
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
        nameSpace: 'applyOldclothes',           //申领旧衣表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            state: 0,                         //预约状态,0=已提交,1=已完成
            personalId: wx.getStorageSync("personalId"),  //用户id
            adressInfo: form.adressInfo,           //详细地址
            contactPeople: form.contactPeople,     //联系人
            phone: form.phone,                     //联系电话
            applyReason: form.applyReason,        //申领原因
            demandExplain: form.demandExplain,  //需求说明
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      that.showModal("申领请求提交成功!");
      that.closeForm(that);
    });
  },

  //清空表单
  closeForm: function (that) {
    that.setData({
      form:{
        adressInfo: null,
        contactPeople: null,
        demandExplain: null,
        applyReason: null,
        phone: null,
      }
    });
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