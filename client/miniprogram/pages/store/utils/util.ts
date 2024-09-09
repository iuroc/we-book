import { ApiResponse } from "../../../utils/util"

const app = getApp<IAppOption>()

/** 图书列表项
 * 
 * {@link https://github.com/iuroc/gede-book-api/blob/971cb132f281f9d9740a371454de5011e2100a55/src/book.mts#L162 gede-book-api/src/book.mts#L162}
 */
export type BookItem = {
    name: string
    author: string
    id: string
    publish: string
    summary: string
    bigCover: string
    smallCover: string
    surl: string
    price: string
    /** 网页阅读器 */
    webReader: string
    type: 'HY' | 'GD'
    isbn: string
}

/** 图书详情
 * 
 * {@link https://github.com/iuroc/gede-book-api/blob/971cb132f281f9d9740a371454de5011e2100a55/src/book.mts#L179 gede-book-api/src/book.mts#L179}
 */
export type BookInfo = BookItem & {
    /** EPUB 文件地址 */
    epub: string
    /** 发布时间 */
    publishTime: string
}

/** 调用 {@link https://github.com/iuroc/gede-book-api/blob/main/src/book.ts gede-book-api} 的 Book API */
export const getGedeRes = async<T = any>(
    func: string,
    args: Array<string | number>
) => {
    return new Promise<T>((resolve, reject) => {
        const url = `${app.globalData.apiBaseURL}/gede/book/${func}?args=${JSON.stringify(args)}`
        wx.request({
            url,
            success(result) {
                const data = result.data as Partial<ApiResponse>
                if (!data.success) {
                    reject(new Error(data.message))
                } else {
                    resolve((result.data as ApiResponse<T>).data)
                }
            },
            fail(error) {
                reject(new Error(error.errMsg))
            }
        })
    })
}
