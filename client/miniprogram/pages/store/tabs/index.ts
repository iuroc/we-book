import { TabValue } from "../../../miniprogram_npm/tdesign-miniprogram/tabs"

// pages/store/tabs/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        activeID: { type: Number },
        categories: { type: Array }
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
        onTabsChange(event: WechatMiniprogram.CustomEvent<{ value: TabValue, label: string }>) {
            const { value, label } = event.detail
            this.triggerEvent('change', { value, label })
        }
    }
})