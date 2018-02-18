var app = getApp();
var util = require('../../../utils/util.js');

Page({

  data: {
    navigateTitle:"",
    films: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty:true,
  },

  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.g_doubanBase + '/v2/movie/in_theaters';
        break;
      case "热门排行":
        dataUrl = app.globalData.g_doubanBase + '/v2/movie/top250';
        break;
      case "即将上映":
        dataUrl = app.globalData.g_doubanBase + '/v2/movie/coming_soon';
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.showDoubanData);
  },

  //设置页面的model，展示数据
  showDoubanData : function(data) {
    var films = [];
    for (var index in data.subjects) {
      var subject = data.subjects[index];
      var title = subject.title;
      if (title.length >= 6)
        title = title.substring(0, 6) + "...";
      var temp = {
        title: title,
        average: subject.average,
        image: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
      }
      films.push(temp);
    }
    var totalFilms = {};
    if (!this.data.isEmpty) {      //不是第一次加载时追加内容
      totalFilms = this.data.films.concat(films);
    } else {     //第一次加载时初始化内容
      totalFilms = films;
      this.data.isEmpty = false;
    }
    this.setData({ films : totalFilms });
    this.data.totalCount += 20;
  },

  //下拉框响应
  onScrollLower : function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.showDoubanData);
  },

  onReady: function(event) {
    //等页面加载完ui元素后更改标题栏，不能在onLoad或onShow中更改
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  }

})