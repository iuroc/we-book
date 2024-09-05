/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        userInfo?: User
        /** 从 Welcome 页面返回到其他在 `onShow` 中调用了 `requireUserInfo` 的页面，会自动跳回 Welcome */
        keepInWelcome?: boolean
        /** 用户创建用户时传给服务器 */
        openID?: string
    }
}

type User = {
    openID: string
    nickname: string
    avatar: string
    createAt: Date
    id: number
}

interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
}