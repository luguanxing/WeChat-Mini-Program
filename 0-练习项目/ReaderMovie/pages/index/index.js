Page({

  onTap : function() {
    console.log("onTap");
    //url不能与跳转到的页面中tabbar链接相同
    // 转发(hide页面)
    wx.navigateTo({
      url: '/pages/post/post'
    })

    //重定向(unload页面)
    // wx.redirectTo ({
    //   url: '/pages/post/post'
    // })
    
    // wx.redirectTo({
    //   url: '/pages/post/post',
    //   success: function(res) {
    //     console.log("成功");
    //   },
    //   fail: function(res) {
    //     console.log("失败");
    //   },
    //   complete: function(res) {
    //     console.log("完成");
    //   }
    // })
  }

})