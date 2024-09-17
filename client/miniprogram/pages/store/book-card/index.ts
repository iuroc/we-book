import { BookItem } from "../utils/util";

// pages/store/book-card/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: {} as BookItem
        },
        border: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        toBookInfo() {
            const item = this.properties.item as BookItem
            wx.navigateTo({
                url: `/pages/book-info/index?id=${item.id}`
            })
        }
    }
})