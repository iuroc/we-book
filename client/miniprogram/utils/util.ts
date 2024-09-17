export type ApiResponse<T = any> = {
    success: boolean
    message: string
    data: T
}

const app = getApp<IAppOption>()

/** {@link https://github.com/iuroc/gede-book-api?tab=readme-ov-file#api-%E6%96%87%E6%A1%A3 查看 `gede-book-api` 文档} */
export const requestGede = async <T = any>(module: 'magazine' | 'book', func: string, args: (string | number | boolean)[]) => new Promise<ApiResponse<T>>((resolve, reject) => {
    wx.request({
        url: `${app.globalData.apiBaseURL}/gede/${module}/${func}?args=${JSON.stringify(args)}`,
        success(result) {
            const response = result.data as ApiResponse
            if (response.success) resolve(response)
            else reject(new Error(response.message))
        },
        fail(error) {
            reject(new Error(error.errMsg))
        }
    })
})

export const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))