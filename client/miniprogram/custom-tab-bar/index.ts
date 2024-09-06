const app = getApp<IAppOption>()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        value: '',
        list: [
            { value: 'shelf', label: '书架', icon: 'table-1' },
            { value: 'store', label: '书城', icon: 'store' },
            { value: 'tool', label: '功能', icon: 'app' },
            { value: 'share', label: '书圈', icon: 'chat-message' },
            { value: 'user', label: '我的', icon: 'user' },
        ],
    },
    onChange(event: WechatMiniprogram.CustomEvent<{ value: string | number }>) {
        const value = event.detail.value.toString()
        this.setData({ value })
        wx.switchTab({ url: `/pages/${value}/index` })
    },

    attached() {
        console.log(1234567)
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

    }
})