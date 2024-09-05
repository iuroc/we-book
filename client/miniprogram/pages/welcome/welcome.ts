import { createUser } from "../../utils/util"

const app = getApp<IAppOption>()

// pages/login/login.ts
Page({
    /**
     * 页面的初始数据
     */
    data: {
        avatar: '/images/avatar.png',
        nickname: ''
    },

    onNicknameChange(event: WechatMiniprogram.Input) {
        this.setData({
            nickname: event.detail.value
        })
    },

    async startUse() {
        const { openID } = app.globalData
        if (!this.data.avatar) {
            wx.showToast({ title: '请上传头像' })
            return
        }
        if (!this.data.nickname) {
            wx.showToast({ title: '昵称不能为空' })
            return
        }
        try {
            const user = await createUser(openID as string, this.data.nickname, this.data.avatar)
            app.globalData.userInfo = user
            app.globalData.keepInWelcome = false
            await wx.navigateBack()
        } catch (error) {
            wx.showToast({ title: `操作失败: ${error.message}` })
        }
    },

    onChooseAvatar(event: WechatMiniprogram.CustomEvent<{ avatarUrl: string }>) {
        this.setData({
            avatar: event.detail.avatarUrl
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {

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