import { AES, enc, lib, mode, pad } from 'crypto-js'
import { baseURL } from '../config'

type SessionInfo = {
    sessionKey: string
    openID: string
}

/** 将 `code` 转换成 `sessionKey` 和 `openID` */
export const code2session = (code: string) => {
    return new Promise<SessionInfo>((resolve, reject) => {
        wx.request({
            url: `${baseURL}/code2session?code=${code}`,
            success(result) {
                const res = result.data as ApiResponse<SessionInfo>
                if (res.success) resolve(res.data)
                else reject(new Error(res.message))
            },
            fail(error) {
                reject(new Error(error.errMsg))
            }
        })
    })
}

export const decryptAES = (data: string, key: string, iv: string) => {
    const keyWordArray = enc.Base64.parse(key)
    const ivWordArray = enc.Base64.parse(iv)
    const encryptedHex = enc.Base64.parse(data)
    const decrypted = AES.decrypt({ ciphertext: encryptedHex } as lib.CipherParams, keyWordArray, {
        iv: ivWordArray,
        mode: mode.CBC,
        padding: pad.Pkcs7
    })
    return decrypted.toString(enc.Utf8)
}

type UserInfoByCode = {
    exists: true
    user: User
} | {
    exists: false
    openID: string
    sessionKey: string
}

export const getUserInfoByCode = async (code: string): Promise<UserInfoByCode> => {
    return new Promise<UserInfoByCode>((resolve, reject) => {
        wx.request({
            url: `${baseURL}/getUserInfoByCode?code=${code}`,
            success(result) {
                const data = result.data as ApiResponse<UserInfoByCode>
                if (data.success) {
                    resolve(data.data)
                } else {
                    reject(new Error(data.message))
                }
            },
            fail(error) {
                reject(new Error(error.errMsg))
            }
        })
    })
}

const app = getApp<IAppOption>()

/** 根据 code 向服务器获取用户信息，如果用户不存在则自动调整欢迎页。
 * 
 * 该方法同时会获得 OpenID 并自动存储到 `app.globalData.openID`
 */
export const requireUserInfo = async () => {
    // 如果 keepInWelcome 为 true，说明服务器无当前的 openID 记录，自动跳转到 welcome 页面，且在 welcome 页面的工作未完成，如果此时返回到其他页面，会自动跳转回到 welcome 页面
    if (app.globalData.keepInWelcome) {
        wx.navigateTo({ url: '../welcome/welcome' })
        return
    }
    if (app.globalData.userInfo) return
    const { code } = await wx.login()
    const userInfoByCode = await getUserInfoByCode(code)
    if (userInfoByCode.exists) {
        app.globalData.userInfo = userInfoByCode.user
    } else {
        app.globalData.keepInWelcome = true
        app.globalData.openID = userInfoByCode.openID
        wx.navigateTo({ url: '../welcome/welcome' })
    }
}

export const createUser = async (openID: string, nickname: string, avatar: string) => {
    return new Promise<User>((resolve, reject) => {
        wx.request({
            url: `${baseURL}/createUser?openID=${openID}&nickname=${nickname}&avatar=${avatar}`,
            success(result) {
                const res = result.data as ApiResponse<{ user: User }>
                if (res.success) resolve(res.data.user)
                else reject(new Error(res.message))
            },
            fail(error) {
                reject(new Error(error.errMsg))
            }
        })
    })
}