var DataFileObj = require("../../data/post-data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 模拟初始化动态获取数据
    // console.log(DataFileObj);
    // console.log(DataFileObj.PostListOut);
    this.setData({
      // myDatas应为数组不是对象
      myDatas: DataFileObj.PostListOut
    });
  },

  onPostTap: function(event) {
    //获取参数并跳转
    var postId = event.currentTarget.dataset.postid;
    //console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId
    })
  },

  onSwiperTap: function (event) {
    //向上冒泡，获取参数并跳转，不用currentTarget用target
    //target指的是事件发生的组件，currentTarget指的是捕获事件的组件
    var postId = event.target.dataset.postid;
    //console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },

})