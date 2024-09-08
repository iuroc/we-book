/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        userInfo?: WechatMiniprogram.UserInfo,
        apiBaseURL: string
    }
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}