var app = getApp();
var util = require('../../utils/util.js');

Page({

  //异步方法要先设置空值
  data: {
    inThreaters : {},
    comingSoon : {},
    top250 : {},
    searchResult : {},
    containerShow : true,
    searchPannelShow : false,
    searchText: "",
  },

  onLoad: function (options) {
    var inThreatersUrl = app.globalData.g_doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3";
    var comingSoonUrl = app.globalData.g_doubanBase + '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250Url = app.globalData.g_doubanBase + '/v2/movie/top250' + "?start=0&count=3";
    this.getMovieListData(inThreatersUrl, "inThreaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "热门排行");
  },

  getMovieListData: function (url, key, categoryTitle) {
    var that = this;
    wx.request({
      //小程序无法使用豆瓣api
      url: url,
      method: 'GET',
      success: function (res) {
        // console.log("调用成功");
        // console.log(res);
        //处理数据
        that.formatDoubanData(res.data, key, categoryTitle);
      },
      fail: function (err) {
        console.log("调用失败");
        console.log(err);
      }
    })
  },

  //点击更多
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-film/more-film?category=' + category,
    })
  },

  //处理数据设置model
  formatDoubanData: function (data, key, categoryTitle) {
    var films = [];
    for (var index in data.subjects) {
      var subject = data.subjects[index];
      var title = subject.title;
      if (title.length >= 6)
        title = title.substring(0,6) + "...";
      var temp  = {
        title : title,
        average : subject.average,
        image : subject.images.large,
        movieId : subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
      }
      films.push(temp);
    }
    //设置对象，注意写法readyData[key]
    var readyData = {};
    readyData[key] = { 
      films: films,
      categoryTitle: categoryTitle
    };
    this.setData(readyData);
  },

  //搜索栏获取焦点
  onBindFocus: function (event) {
    console.log('搜索栏获取焦点');
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },

  //搜索栏失去焦点或回车，进行搜索
  onBindChange: function (event) {
    console.log('搜索光标离开');
    var text = event.detail.value;
    var searchUrl = app.globalData.g_doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  //点击X关闭搜索，要清空内容
  onCancelImgTap : function(event) {
    console.log('关闭搜索');
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult : {},
      searchText : "",
    })
  },

  //跳转到详情页面
  onFilmTap : function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'film-detail/film-detail?id=' + id,
    })
  }


})