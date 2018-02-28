var postDataFile = require("../../../data/post-data.js")  //导入数据，模仿网络访问
var app = getApp();  //全局变量

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlaying : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.myId = postId;
    var postDataList = postDataFile.PostListOut;
    var PostObj = postDataList[postId];
    this.setData({
      post: PostObj
    });

    //最好用setData
    if (app.globalData.g_isPlaying && app.globalData.g_currentPlayingId == postId) {
      this.setData({
        isPlaying: true
      })
    }

    this.monitorPostState(postId);

    this.monitorAudio();

  },

  //从缓存判断是否收藏
  monitorPostState(postId) {
    var postCollected = wx.getStorageSync("postCollected");
    if (postCollected) {
      //有缓存则从缓存中获取更新状态
      var postState = postCollected[postId];
      if (postState) {
        //为true
        this.setData({
          collected: true
        })
      } else {
        //未定义或为false
        this.setData({
          collected: false
        });
        postCollected[postId] = false;
        wx.setStorageSync("postCollected", postCollected);
      }
    } else {
      //无缓存则新建缓存
      var postCollected = {};
      postCollected[postId] = false;
      wx.setStorageSync("postCollected", postCollected);
    }
  },

  //监控音乐播放
  monitorAudio() {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlaying: true
      })
      app.globalData.g_isPlaying = true;
      app.globalData.g_currentPlayingId = that.data.post.postId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlaying: false
      })
      app.globalData.g_isPlaying = false;
      app.globalData.g_currentPlayingId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlaying: false
      })
      app.globalData.g_isPlaying = false;
      app.globalData.g_currentPlayingId = null;
    });
  },

  //点击收藏按钮
  onCollectionTap:function (event) {
    var postCollected = wx.getStorageSync("postCollected");
    //postCollected已初始化，不会为null
    if (postCollected == null)
      return;
    var postId = this.data.myId; //通过中间变量传递
    if (postCollected[postId]) {
      //同步为false
      this.updatePostState(postId, false);
    } else {
      //同步为true
      this.updatePostState(postId, true);
    }
  },

  //自定义修改收藏和不收藏的状态,注意调用时需要加上this.
  updatePostState: function (postId, state) {
    var postCollected = wx.getStorageSync("postCollected");
    this.setData({
      collected: state
    });
    postCollected[postId] = state;
    wx.setStorageSync("postCollected", postCollected);
    if (state) {
      wx.showToast({
        title: '已收藏',
      })
    } else {
      wx.showToast({
        title: '取消收藏',
      })
    }
  },

  onShareTap: function (event) {
    wx.showModal({
      title: '分享',
      content: '是否分享?',
      showCancel: "true",
      cancelText: "取消",
      confirmText: "分享",
      success: function (result) {
        var itemList =  [ '微信好友','QQ','微博'];
        if (result.confirm) {
          wx.showActionSheet({
            itemList: itemList,
            success : function (res) {
              wx.showToast({
                title: '已分享到' + itemList[res.tapIndex],
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },

  onMusicTap : function (event) {
    var isPlaying = this.data.isPlaying;
    var postDataList = postDataFile.PostListOut;
    var postId = this.data.myId; //通过中间变量传递
    var PostObj = postDataList[postId];
    if (isPlaying) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlaying : false
      })
      app.globalData.g_isPlaying = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: PostObj.music.url,
        title: PostObj.music.title,
        coverImgUrl: PostObj.music.coverImg,
      })
      this.setData({
        isPlaying: true
      })
      app.globalData.g_isPlaying = true;
    }

  }


})