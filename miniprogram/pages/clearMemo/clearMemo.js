// miniprogram/pages/clearMemo/clearMemo.js
const canal = require("../../lib/canal.min.js")
const dayjs = require("../../lib/dayjs.min.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "scrollTop": 0,
    "sidebarWidth": 80,
    "viewHeight": 0,
    "viewWidth": 0,
    "weekHeads": [],
    "weekArray": [],
    "weekHeadHeight": 40,
    "weekDayHeight": 40,
    "weekDayWidth": 20,
    "yearNumber": "xxxx"
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.weekLeadMin = this.getLastSunday(dayjs().startOf("month"))
    this.weekLeadMax = this.weekLeadMin.add(4, "week")

    this.setData({
      "viewHeight": this.getViewHeight(),
      "viewWidth": this.getViewWidth(),
      "weekHeads": this.getWeekHeads(), // 获取周视图的头部
      "weekArray": this.getWeekArray(this.weekLeadMin, this.weekLeadMax), //获取周数组
      "weekHeadHeight": this.getWeekHeadHeight(), // 获取周的表头高度
      "weekDayHeight": this.getWeekDayHeight(), // 获取周的高度
      "weekDayWidth": this.getWeekDayWidth(), // 获取周的每天宽度
      "yearNumber": this.weekLeadMin.format("YYYY") // 获取初始年份
    })

    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      // 传给云函数的参数
      data: {

      },
      success: function(res) {
        console.log(res.result)
      },
      fail: console.error
    })

  },

  getLastSunday: function(date) {
    return date.subtract(parseInt(date.format("d")), "day")
  },

  getItemsByMonth: function(month) {
    if (month == "201906") {
      return [{
        "date": "20190607",
        "text": "备忘事项"
      }, {
        "date": "20190611",
        "text": "备忘事项"
      }, {
        "date": "20190617",
        "text": "备忘事项"
      }, {
        "date": "20190620",
        "text": "备忘事项"
      }]
    } else if (month == "201907") {
      return [{
        "date": "20190705",
        "text": "备忘事项"
      }, {
        "date": "20190713",
        "text": "备忘事项"
      }, {
        "date": "20190714",
        "text": "备忘事项"
      }, {
        "date": "20190725",
        "text": "备忘事项"
      }]
    } else if (month == "201908") {
      return [{
        "date": "20190809",
        "text": "备忘事项"
      }, {
        "date": "20190818",
        "text": "备忘事项"
      }, {
        "date": "20190825",
        "text": "备忘事项"
      }]
    } else {
      return []
    }
  },

  getWeekArray: function(weekLeadFrom, weekLeadTo) {
    var array = []
    var weeks = weekLeadTo.diff(weekLeadFrom, "week")
    for (var i = 0; i <= weeks; i++) {
      var weekLead = weekLeadFrom.add(i, "week")
      var days = []
      for (var j = 0; j < 7; j++) {
        var date = weekLead.add(j, "day")
        days.push({
          "date": date.format("M/D")
        })
      }
      var week = {
        "id": weekLead.format("YYYY-MM-DD"),
        "days": days
      }
      array.push(week)
    }
    return array
  },

  getWeekHeads: function() {
    return [{
      "name": "周日"
    }, {
      "name": "周一"
    }, {
      "name": "周二"
    }, {
      "name": "周三"
    }, {
      "name": "周四"
    }, {
      "name": "周五"
    }, {
      "name": "周六"
    }]
  },

  getViewHeight: function() {
    var width = wx.getSystemInfoSync().windowWidth
    var height = wx.getSystemInfoSync().windowHeight
    return Math.min(width, height)
  },

  getViewWidth: function() {
    var width = wx.getSystemInfoSync().windowWidth
    var height = wx.getSystemInfoSync().windowHeight
    return Math.max(width, height)
  },

  getWeekDayHeight: function() {
    var width = wx.getSystemInfoSync().windowWidth
    var height = wx.getSystemInfoSync().windowHeight
    return (this.getViewHeight() - this.getWeekHeadHeight()) / this.getWeeksNumber()
  },

  getWeekDayWidth: function() {
    return this.getViewWidth() / 7.0
  },

  getWeeksNumber: function() {
    return 3.4
  },

  getWeekHeadHeight: function() {
    return 35
  },

  getWeekLeadByRatio: function(ratio, min, max) {
    return min.add(Math.floor(max.diff(min, 'day') * ratio), 'day')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 屏幕发生旋转
   */
  onResize: function() {
    console.log("rolled")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },


  whenScrollToTop: function(e) {
    if (e.detail.direction == "top") {
      var weekLeadTo = this.weekLeadMin.subtract(1, "week")
      this.weekLeadMin = this.weekLeadMin.subtract(5, "week")
      var delta = this.getWeekArray(this.weekLeadMin, weekLeadTo)
      this.setData({
        "scrollTop": this.getWeekDayHeight() * 5 - 1
      })
      this.setData({
        "scrollTop": this.getWeekDayHeight() * 5,
        "weekArray": delta.concat(this.data.weekArray)
      })
    }
  },

  whenScrollToBottom: function(e) {
    if (e.detail.direction == "bottom") {
      var weekLeadFrom = this.weekLeadMax.add(1, "week")
      this.weekLeadMax = this.weekLeadMax.add(5, "week")
      var delta = this.getWeekArray(weekLeadFrom, this.weekLeadMax)
      this.setData({
        "weekArray": this.data.weekArray.concat(delta)
      })
    }
  },

  whenScroll: function(e) {
    this.setData({
      "yearNumber": this.getWeekLeadByRatio(e.detail.scrollTop / (e.detail.scrollHeight - this.getViewHeight()), this.weekLeadMin, this.weekLeadMax).format("YYYY")
    })
  },

  /**
   * 监听用户滑动页面事件
   */
  onPageScroll: function(event) {
    //console.log("scroll", event)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})