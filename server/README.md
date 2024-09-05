# 书香漫卷服务端

## 数据库规划

## 逻辑分析

1. wx.login 返回 code
2. code + appId + secret = openid + session_key
3. wx.getUserInfo + session_key = nickName + avatarUrl +
   ```json
   {
     "openId": "ojRhw7Xohh4ZOm9hqVyWUh5Cgc_g",
     "nickName": "微信用户",
     "gender": 0,
     "language": "",
     "city": "",
     "province": "",
     "country": "",
     "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
     "watermark": { "timestamp": 1725351408, "appid": "wxbf1cd2e3c5794ad1" }
   }
   ```