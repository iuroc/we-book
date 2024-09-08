export type ApiResponse<T = any> = {
    success: boolean
    message: string
    data: T
}

const app = getApp<IAppOption>()

export const requestGede = async <T = any>(module: 'magazine' | 'book', func: string, args: (string | number | boolean)[]) => new Promise<ApiResponse<T>>((resolve, reject) => {
    wx.request({
        url: `${app.globalData.apiBaseURL}/gede/${module}/${func}?args=${JSON.stringify(args)}`,
        success(result) {
            resolve(result.data as ApiResponse)
        },
        fail(error) {
            reject(new Error(error.errMsg))
        }
    })
})