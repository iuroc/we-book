import { requestGede } from "../../utils/util"
import { BookData, BookInfo } from "../store/utils/util"

// pages/info/index.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPage: false,
    } as { info: BookInfo, catalogs: BookData['catalogs'], catalogsFlat: CatalogsFalt, showPage: boolean },

    previewCover() {
        wx.previewImage({
            urls: [this.data.info.bigCover]
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(option) {
        wx.showLoading({ title: '正在加载' })
        const bookId = option.id as string || 'HYB15059548'
        const [info, catalog] = await Promise.all([
            this.getBookInfo(bookId),
            this.getBookCatalog(bookId)
        ])
        wx.setNavigationBarTitle({ title: info.name + ' - 图书详情' })
        const getCatalogsFalt = (items: BookData['catalogs'], indent: number = 0): CatalogsFalt => {
            const flats: CatalogsFalt = []
            for (const item of items) {
                flats.push({ title: item.title, page: item.page, indent })
                if (item.children) flats.push(...getCatalogsFalt(item.children, indent + 1))
            }
            return flats
        }
        const catalogsFlat: CatalogsFalt = getCatalogsFalt(catalog.catalogs)
        this.setData({ info, catalogs: catalog.catalogs, catalogsFlat, showPage: true })
        wx.hideLoading()
    },

    async getBookInfo(id: string) {
        const bookInfo = await requestGede<BookInfo>('book', 'getInfo', [id]).then(res => res.data)
        return bookInfo
    },

    async getBookCatalog(id: string) {
        const catalog = await requestGede<BookData>('book', 'getCatalog', [id]).then(res => res.data)
        return catalog
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

    goRead(event: WechatMiniprogram.CustomEvent) {
        const page = event.currentTarget.dataset.page as number
        wx.navigateTo({
            url: `/pages/read/index?id=${this.data.info.id}&page=${page}`
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        await this.onLoad({ id: this.data.info.id })
        wx.stopPullDownRefresh()
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

type CatalogsFalt = { page: number, title: string, indent: number }[]