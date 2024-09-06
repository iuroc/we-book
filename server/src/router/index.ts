import { Router } from 'express'
import { miniProgram } from '../config.js'
import Joi from 'joi'
import { makeApiResponse } from '../common/response.js'
import { logger } from '../common/logger.js'
import { userRepository } from '../common/repository.js'
import { User } from '../common/entity.js'

const router = Router()

router.get('/code2session', async (req, res, next) => {
    logger.debug(JSON.stringify(req.query))
    const scheme = Joi.object({
        code: Joi.string().required()
    })
    const { error, value } = scheme.validate(req.query)
    if (error) {
        res.send(makeApiResponse({
            success: false,
            message: error.message
        }))
    } else {
        req.query = value
        next()
    }
}, (req, res) => {
    const { code } = req.query as { code: string }
    code2session(code).then(result => {
        res.send(makeApiResponse({
            success: true,
            data: result
        }))
    }).catch(err => {
        res.send(makeApiResponse({
            success: false,
            message: err.message
        }))
    })
})

router.get('/getUserInfoByCode', async (req, res, next) => {
    const scheme = Joi.object({
        code: Joi.string().required()
    })
    const { error, value } = scheme.validate(req.query)
    if (error) {
        res.send(makeApiResponse({
            success: false,
            message: error.message
        }))
    } else {
        req.query = value
        next()
    }
}, async (req, res) => {
    const { code } = req.query as { code: string }
    try {
        const { openID, sessionKey } = await code2session(code)
        const user = await userRepository.findOneBy({ openID })
        logger.debug(JSON.stringify({ openID }))
        if (user) {
            return res.send(makeApiResponse({
                data: { user, exists: true }
            }))
        }
        else {
            return res.send(makeApiResponse({
                message: '用户不存在',
                data: { openID, sessionKey, exists: false }
            }))
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.send(makeApiResponse({
                success: false,
                message: error.message
            }))
        }
    }
})

router.get('/createUser', async (req, res, next) => {
    const schema = Joi.object({
        openID: Joi.string().required(),
        nickname: Joi.string().required(),
        avatar: Joi.string().required()
    })
    const { error, value } = schema.validate(req.query)
    if (error) {
        res.send(makeApiResponse({
            success: false,
            message: error.message
        }))
    } else {
        req.query = value
        next()
    }
}, async (req, res) => {
    const { openID, nickname, avatar } = req.query as { openID: string, nickname: string, avatar: string }
    const user = new User()
    user.openID = openID
    user.nickname = nickname
    user.avatar = avatar
    try {
        await userRepository.save(user)
        res.send(makeApiResponse({
            success: true,
            data: user
        }))
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Duplicate entry')) {
                const user = await userRepository.findOneBy({ openID }) as User
                user.nickname = nickname
                user.avatar = avatar
                await userRepository.save(user)
                res.send(makeApiResponse({
                    success: true,
                    data: user,
                    message: '用户已经存在，直接获取用户信息'
                }))
                return
            }
            res.send(makeApiResponse({
                success: false,
                message: error.message
            }))
        }
    }
})

const code2session = async (code: string): Promise<SessionInfo> => {
    return fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${miniProgram.appId}&secret=${miniProgram.secret}&js_code=${code}&grant_type=authorization_code`).then(res => res.json()).then((result: {
        errcode?: number
        errmsg?: string
        session_key?: string
        openid?: string
    }) => {
        if (result.errcode) throw new Error(result.errmsg)
        return {
            sessionKey: result.session_key as string,
            openID: result.openid as string
        }
    })
}

type SessionInfo = {
    sessionKey: string
    openID: string
}

export default router