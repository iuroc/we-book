/** 统一的 API 响应结构 */
export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
}

/** 构建统一的 API 响应结构，默认为响应成功。
 * 
 * ```
 * // 默认值 { success: true, message: "请求成功", data: null }
 * res.send(makeApiResponse())
 * // 自定义参数
 * res.send(makeApiResponse({
 *      success: true,
 *      message: '请求成功',
 *      data: {}
 * }))
 * ```
 */
export const makeApiResponse = <T = any>(init?: Partial<ApiResponse<T | null>>) => {
    init = init || {}
    if (typeof init.success == 'undefined') init.success = true
    if (typeof init.message == 'undefined') init.message = init.success ? '请求成功' : '请求失败'
    if (typeof init.data == 'undefined') init.data = null
    return init as ApiResponse<T>
}