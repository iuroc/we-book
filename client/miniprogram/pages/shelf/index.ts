import { getGedeRes } from "../store/utils/util"

// pages/shelf/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPopup: false,
    },

    onVisibleChange(event: WechatMiniprogram.CustomEvent<{
        visible: boolean
        trigger: 'close-btn' | 'overlay'
    }>) {
        this.setData({
            showPopup: event.detail.visible,
        })
    },

    toTestPage() {
        wx.navigateTo({ url: '/pages/test/index' })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getTabBar().setData({ value: 'shelf' })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    importLocal() {
        this.setData({
            showPopup: true
        })
    }
})