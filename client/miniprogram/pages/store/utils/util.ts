import { ApiResponse } from "../../../utils/util"

const app = getApp<IAppOption>()

/** 图书正文和目录数据 */
export type BookData = {
    contents: string[]
    catalogs: {
        page: number,
        title: string
        children: BookData['catalogs']
    }[]
}

/** 图书列表项
 * 
 * {@link https://github.com/iuroc/gede-book-api/blob/971cb132f281f9d9740a371454de5011e2100a55/src/book.mts#L162 gede-book-api/src/book.mts#L162}
 */
export type BookItem = {
    /** 书名 */
    name: string
    /** 作者 */
    author: string
    /** 编号 */
    id: string
    /** 出版社 */
    publish: string
    /** 简介 */
    summary: string
    /** 封面 */
    bigCover: string
    /** 封面 */
    smallCover: string
    /** 资源标识 */
    surl: string
    /** 价格 */
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
            timeout: 3000,
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
