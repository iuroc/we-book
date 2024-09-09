import { TabValue } from "../../miniprogram_npm/tdesign-miniprogram/tabs"
import { requestGede } from "../../utils/util"
import { BookItem } from "./utils/util"

// pages/store/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: 0 as TabValue,
        categories: [] as { id: number, name: string }[],
        bookList: [] as Array<BookItem>,
        nextPage: 0,
        scrollTop: 0,
        /** 列表已经到底了 */
        noMorePage: false,
        /** 是否展示结果提示 `t-result` */
        showResultTip: false,
        /** `t-result` 的 `theme` */
        resultTipTheme: undefined as undefined | 'success' | 'warning' | 'error',
        /** `t-result` 的 `title` */
        resultTipTitle: '',
    },

    async loadNextList(cover: boolean = false) {
        if (cover) this.setData({ nextPage: 0, noMorePage: false })
        const pageSize = 72
        try {
            const result = await requestGede<BookItem[]>('book', 'getList', [this.data.value, this.data.nextPage, pageSize])
            const bookList = result.data
            this.data.nextPage++
            if (bookList.length < pageSize || bookList.length == 0) {
                // 已经到底了
                this.setData({
                    noMorePage: true
                })
            }
            this.setData({ bookList: cover ? bookList : this.data.bookList.concat(bookList) })
        } catch (error) {
            if (error instanceof Error) {
                this.showNetworkErrorTip()
            }
        }
    },

    onPageScroll(e) {
        const { scrollTop } = e
        this.setData({ scrollTop })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.loadTab()
    },
    reload() {
        wx.startPullDownRefresh()
    },
    async loadTab() {
        wx.showLoading({ title: '正在加载' })
        try {
            const result = await requestGede<{ id: number, name: string }[]>('book', 'getCategories', [])
            const data = result.data.filter(item => item.id != 123)
            this.setData({
                categories: data,
                value: data[0].id
            })
        } catch (error) {
            if (error instanceof Error) {
                this.showNetworkErrorTip()
            }
        } finally {
            wx.hideLoading()
        }
        await this.loadNextList(true)
    },

    /** 显示网络错误提示信息 */
    showNetworkErrorTip() {
        this.setData({
            showResultTip: true,
            resultTipTheme: 'error',
            resultTipTitle: '网络跑路啦~'
        })
    },

    async onTabsChange(event: WechatMiniprogram.CustomEvent<{ value: TabValue, label: string }>) {
        await wx.pageScrollTo({ duration: 300, scrollTop: 0 })
        const catagoryId = event.detail.value as number
        this.setData({ value: catagoryId })
        wx.showLoading({ title: '正在加载' })
        await this.loadNextList(true)
        wx.hideLoading()
    },

    onTabsClick(event: WechatMiniprogram.CustomEvent<{ value: TabValue, label: string }>) {
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
        this.getTabBar().setData({ value: 'store' })
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
    async onPullDownRefresh() {
        this.setData({ showResultTip: false })
        wx.showLoading({ title: '正在加载' })
        await this.loadNextList(true)
        wx.hideLoading()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
        if (this.data.noMorePage) return
        wx.showLoading({ title: '正在加载' })
        await this.loadNextList()
        wx.hideLoading()
        wx.stopPullDownRefresh()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})