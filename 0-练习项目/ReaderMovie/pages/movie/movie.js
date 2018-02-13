var app = getApp();

Page({

  data: {
  
  },

  onLoad: function (options) {
    var inThreatersUrl = app.globalData.g_doubanBase + '/v2/movie/in_theaters';
    var comingSoonUrl = app.globalData.g_doubanBase + '/v2/movie/coming_soon';
    var top250Url = app.globalData.g_doubanBase + '/v2/movie/top250';
    this.getMovieListData(top250Url);
  },

  getMovieListData: function(url) {
    wx.request({
      //小程序无法使用豆瓣api
      url: url,
      method: 'GET',
      success: function (res) {
        console.log("调用成功");
        console.log(res);
      },
      fail: function (err) {
        console.log("调用失败");
        console.log(err);
      }
    })
  }

})