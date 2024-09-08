// custom-tab-bat2/index.ts
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
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

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event: WechatMiniprogram.CustomEvent<{ value: string | number }>) {
            const value = event.detail.value.toString()
            wx.switchTab({ url: `/pages/${value}/index` })
        },
    }
})