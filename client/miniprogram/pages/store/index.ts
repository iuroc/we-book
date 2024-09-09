import { TabValue } from "../../miniprogram_npm/tdesign-miniprogram/tabs"
import { requestGede } from "../../utils/util"
import { BookItem } from "./utils/util"

// pages/store/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /** 当前选项卡选中的 ID */
        activeID: 0 as TabValue,
        /** 选项卡列表数据 */
        categories: [] as { id: number, name: string }[],
        /** 图书列表数据 */
        bookList: [] as Array<BookItem>,
        /** 下一页的页码 */
        nextPage: 0,
        /** 当前滚动的距离 */
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

    /** 加载下一页列表，请确保已经设置 `activeID` 和 `nextPage`
     * 
     * @param cover 是否覆盖列表，该选项用于初始化列表
     */
    async loadNextList(cover: boolean = false) {
        if (cover) this.setData({ nextPage: 0, noMorePage: false })
        const pageSize = 72
        try {
            const result = await requestGede<BookItem[]>('book', 'getList', [this.data.activeID, this.data.nextPage, pageSize])
            const bookList = result.data
            this.data.nextPage++
            if (bookList.length < pageSize || bookList.length == 0) {
                // 已经到底了
                this.setData({ noMorePage: true })
            }
            this.setData({ bookList: cover ? bookList : this.data.bookList.concat(bookList) })
        } catch (error) {
            if (error instanceof Error) {
                this.showNetworkErrorTip()
            }
        }
    },

    onPageScroll(e) {
        this.setData({ scrollTop: e.scrollTop })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        wx.showLoading({ title: '正在加载' })
        await this.loadTab()
        if (!this.data.showResultTip)
            await this.loadNextList(true)
        wx.hideLoading()
    },
    async reload() {
        this.setData({ showResultTip: false })
        wx.showLoading({ title: '正在加载' })
        await Promise.all([
            this.loadTab()
        ])
    },
    /** 加载选项卡列表，并自动设置聚焦的选项卡 ID，如果获取失败，会显示加载失败 */
    async loadTab() {
        type Item = { id: number, name: string }
        try {
            const result = await requestGede<Item[]>('book', 'getCategories', [])
            const data = result.data.filter(item => item.id != 123)
            this.setData({
                categories: data,
                activeID: data[0].id
            })
        } catch (error) {
            if (error instanceof Error) {
                this.showNetworkErrorTip()
            }
        }
    },

    /** 显示网络错误提示信息 */
    showNetworkErrorTip() {
        this.setData({
            showResultTip: true,
            resultTipTheme: 'error',
            resultTipTitle: '加载失败，请检查网络连接~'
        })
    },

    async onTabsChange(event: WechatMiniprogram.CustomEvent<{ value: TabValue, label: string }>) {
        await wx.pageScrollTo({ duration: 300, scrollTop: 0 })
        const catagoryId = event.detail.value as number
        this.setData({ activeID: catagoryId })
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