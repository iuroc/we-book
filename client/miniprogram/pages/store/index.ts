import { TabValue } from "../../miniprogram_npm/tdesign-miniprogram/tabs"
import { requestGede, sleep } from "../../utils/util"
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
     * 
     * @throws {Error}
     */
    async loadNextList(cover: boolean = false) {
        if (cover) this.setData({ nextPage: 0, noMorePage: false })
        const pageSize = 72
        const result = await requestGede<BookItem[]>('book', 'getList', [this.data.activeID, this.data.nextPage, pageSize])
        const bookList = result.data
        this.data.nextPage++
        if (bookList.length < pageSize || bookList.length == 0) {
            // 已经到底了
            this.setData({ noMorePage: true })
        }
        this.setData({ bookList: cover ? bookList : this.data.bookList.concat(bookList) })
    },

    onPageScroll(e) {
        this.setData({ scrollTop: e.scrollTop })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        this.refresh()
    },

    /** 根据当前的 `activeID` 刷新列表，如果 `categories` 为空，则加载 Tab 列表并将第一项设为 `activeID` */
    async refresh() {
        wx.showLoading({ title: '正在加载', mask: true })
        try {
            if (this.data.categories.length == 0) await this.loadTab()
            await this.loadNextList(true)
            this.setData({
                showResultTip: false
            })
        } catch (error) {
            if (error instanceof Error) {
                this.showErrorTip(this.convertErrorMessage(error))
                await sleep(300)
            }
        }
        wx.hideLoading()
    },

    /** 加载选项卡列表，并自动设置聚焦的选项卡 ID，如果获取失败，会显示加载失败
     * 
     * @throws {Error}
     */
    async loadTab() {
        type Item = { id: number, name: string }
        const result = await requestGede<Item[]>('book', 'getCategories', [])
        const data = result.data.filter(item => item.id != 123)
        if (data.length == 0) throw new Error('选项卡加载失败')
        this.setData({
            categories: data,
            activeID: data[0].id
        })
    },

    showErrorTip(title: string) {
        this.setData({
            showResultTip: true,
            resultTipTheme: 'error',
            resultTipTitle: title
        })
    },

    async onTabsChange(event: WechatMiniprogram.CustomEvent<{ value: TabValue, label: string }>) {
        await wx.pageScrollTo({ duration: 300, scrollTop: 0 })
        const catagoryId = event.detail.value as number
        this.setData({ activeID: catagoryId })
        this.refresh()
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
        await this.refresh()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
        if (this.data.noMorePage) return
        wx.showLoading({ title: '正在加载', mask: true })
        try {
            await this.loadNextList()
        } catch (error) {
            if (error instanceof Error) {
                this.showErrorTip(this.convertErrorMessage(error))
                await sleep(300)
            }
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
    },

    convertErrorMessage(error: Error) {
        if (error.message.includes('request:fail')) error.message = '请求出错啦~'
        return error.message
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})