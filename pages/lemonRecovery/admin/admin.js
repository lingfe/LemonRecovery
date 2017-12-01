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
    list: null,
    cst: false,      //隐藏
    form:{
      usedClothes:0, //旧衣
      wastePaper:0, //废纸
      other:0,     //其他
      personalId:null,   //用户id
      collector:null, //收集员编号
      num:0,    //总积分
      lemonRecoveryId:null,     //预约表id
      resourceContribution:0,  //总共多少斤
      state: null,    //预约状态,0=(已提交,未处理),1=(已完成,已处理),2=(未采纳,不处理),3=(已取消,)
    }
  },

  //拨打用户电话
  bindtapPhone: function (e) {
    var that = this;
    wx.showModal({
      title: '拨打用户电话',
      content: '是否确定拨打？' + e.currentTarget.id,
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.id
          });
        }
      }
    });
  },

  //旧衣
  inputusedClothes:function(e){
    var that=this;
    var form=that.data.form;
    console.log(e.detail.value);
    var usedClothes = parseFloat(e.detail.value == '' ? 0 : e.detail.value);
    var num = form.wastePaper * 0.3 + form.other * 0.3+usedClothes;
    var nresourceContribution = parseInt(form.wastePaper + form.other + usedClothes);
    console.log("nresourceContribution:" + nresourceContribution);
    that.setData({
      'form.usedClothes': usedClothes,
      'form.num': num.toFixed(1),
      'form.resourceContribution': nresourceContribution
    });
  },

  //废纸
  inputwastePaper:function(e){
    var that = this;
    var form = that.data.form;
    var wastePaper = parseFloat(e.detail.value == '' ? 0 : e.detail.value);
    var num = form.usedClothes + form.other * 0.3 + wastePaper * 0.3;
    var nresourceContribution = parseInt(wastePaper + form.other + form.usedClothes);
    console.log("nresourceContribution:" + nresourceContribution);
    this.setData({
      'form.wastePaper': wastePaper,
      'form.num': num.toFixed(1),
      'form.resourceContribution': nresourceContribution
    });
  },

  //其他
  inputother:function(e){
    var that = this;
    var form = that.data.form;
    var other = parseFloat(e.detail.value == '' ? 0 : e.detail.value);
    var num = form.wastePaper * 0.3 + form.usedClothes + other * 0.3;
    var nresourceContribution = parseInt(form.wastePaper + other + form.usedClothes);
    console.log("nresourceContribution:" + nresourceContribution);
    this.setData({
      'form.other': other,
      'form.num': num.toFixed(1),
      'form.resourceContribution': nresourceContribution
    });
  },

  //收集员编号
  inputcollector:function(e){
    this.setData({
      'form.collector':e.detail.value
    });
  },

  //设置我的贡献资源
  setContribtion: function (that) {
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var resourceContribution=(that.data.myContribution.resourceContribution + that.data.form.resourceContribution);
    var lemonIntegral = parseFloat(that.data.myContribution.lemonIntegral + parseFloat(that.data.form.num)).toFixed(1);
    var usedClothes = (that.data.myContribution.usedClothes + that.data.form.usedClothes);
    var wastePaper = (that.data.myContribution.wastePaper + that.data.form.wastePaper);
    var other = (that.data.myContribution.other + that.data.form.other);

    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'myContribution',           //我的贡献表
        scriptName: 'Query',
        cudScriptName: 'Update',
        nameSpaceMap: {
          rows: [{
            id: that.data.myContribution.id,  //贡献表id
            personalId: that.data.myContribution.personalId,  //用户id
            resourceContribution: resourceContribution,    //资源贡献多少斤
            lemonIntegral: lemonIntegral ,//柠檬总积分
            usedClothes: usedClothes,//衣服的斤数
            wastePaper: wastePaper,//废纸斤数
            other:other,//其他
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      that.setData({
        myContribution: null,
        cst:false,
      });
    });
  },

  //显示或隐藏表单
  CalculationlistBindtap: function (e) {
    if (!app.checkInput(e.currentTarget.id)) {
      console.log(e);
      var that=this;
      that.setData({
        'form.state': e.currentTarget.dataset.state,
        'form.personalId': e.currentTarget.dataset.personalid,
        'form.lemonRecoveryId':e.currentTarget.id,
        cst: this.data.cst == false ? true : false
      });
      //获取我的贡献资源
      that.getContribtion(that, e.currentTarget.dataset.personalid);
    }
  },

  //获取我的贡献资源
  getContribtion: function (that, personalId) {
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
            personalId: personalId,  //用户id
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      console.log(res);
      //验证是否为空如果为空就生成一条贡献
      if (!app.checkInput(res.data.rows)) {
        that.setData({
          myContribution: res.data.rows[0],
        });
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

  //不处理
  bindtapnostate:function(e){
    var that = this;
    if (!app.checkInput(e.currentTarget.id)) {
      this.setData({
        'form.state': 2,
        'form.lemonRecoveryId': e.currentTarget.id,
      });
    }
    //调用函数
    that.Btntap();
  },
  
  //修改预约状态
  Btntap:function(){
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
            id: that.data.form.lemonRecoveryId,    //预约id
            state: that.data.form.state   //预约状态,0=(已提交,未处理),1=(已完成,已处理),2=(未采纳,不处理),3=(已取消,)
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url,header,data,function(res){
      //刷新
      that.getlemonRecovery(that, 0);
    });
  },

  //设置回收纪录
  submitForm:function(e){
    var that=this;
    //得到表单
    var form=that.data.form;

    //验证
    if (form.usedClothes <= 0 && form.wastePaper <= 0 && form.other <= 0){
      that.showModal("请输入斤数,至少输入一项!");
      return;
    }

    //url
    var url = app.config.basePath_web + "api/exe/save";
    //请求头
    var header = { cookie: wx.getStorageSync("cookie"), "Content-Type": "application/x-www-form-urlencoded" };
    //参数
    var data = {
      timeStamp: wx.getStorageSync("time"),
      token: wx.getStorageSync("token"),
      reqJson: JSON.stringify({
        nameSpace: 'recyclingRecords',           //预约表
        scriptName: 'Query',
        cudScriptName: 'Save',
        nameSpaceMap: {
          rows: [{
            personalId: form.personalId,  //用户id
            usedClothes: form.usedClothes,    //旧衣
            wastePaper: form.wastePaper,      //废纸
            other: form.wastePaper, //其他
            lemonIntegral:form.num,//总积分
            collector: form.collector //收集员编号
          }]
        }
      })
    };
    //发送请求
    app.request.reqPost(url, header, data, function (res) {
      if(res.data.status==1){
        //修改状态
        that.Btntap();
        //修改用户贡献
        that.setContribtion(that);
        //刷新
        that.getlemonRecovery(that, 0);
      }
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