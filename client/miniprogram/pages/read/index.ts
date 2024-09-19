import { requestGede } from "../../utils/util"
import { BookData } from "../store/utils/util"

// pages/read/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(option) {
        wx.showLoading({ title: '正在加载' })
        const bookId = option.id as string || 'HYB11735982'
        const page = parseInt(option.page || '6')
        const bookData = await this.getBookData(bookId, page, 30)
        const content = bookData.contents[0].replace(/<img/g, '<img class="image"')
        this.setData({ content })
        wx.hideLoading()
    },

    async getBookData(id: string, page: number, pageSize: number) {
        const data = await requestGede<BookData>('book', 'getData', [id, page, pageSize]).then(res => res.data)
        return data
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

    },

    longPress(event: WechatMiniprogram.CustomEvent) {
        console.log(event)
    }
})