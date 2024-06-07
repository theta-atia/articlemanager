const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const protect = asyncHandler(async (req, res, next) => {
    let token;
    //authorization 字段带着 Bearer 要进行验证
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                res.status(401)
                throw new Error('not authorized')
            }
            //用户在数据库中的更新时间
            const userUpdatedAt = parseInt(req.user.updatedAt.valueOf() / 1000);
            // JWT token 的发行时间（Issued At）
            const jwtIssueAt = decoded.iat;
            //用户在数据库中的时间晚于该jwt发行的时间，代表已经发行过了新的token,该token已经失效。
            if (userUpdatedAt > jwtIssueAt) {
                res.status(401)
                throw new Error('not authorized')
            }
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('not authorized, no token')
    }

})

module.exports = { protect }