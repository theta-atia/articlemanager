const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const app = express()
const { db, genid } = require("./db/config")
const port = 8080


//开放端口使用
app.all('*', function (req, res, next) {
    //设置跨域允许访问的类型
    res.header('Access-Control-Allow-Origin', '*');
    //设置前端带过来的访问请求头
    res.header('Access-Control-Allow-Headers', 'Content-Type,token');
    //设置请求方法
    res.header('Access-Control-Allow-Methods', '*');
    //设置参数传递的类型？是form-data形式还是json格式？
    // res.header('Content-Type', 'application/json;charset=utf-8');
    // 因为我还要上传图片，所以不能只用json格式,所以干脆不限制，让浏览器自动判断就行了。
    // res.header('Content-Type', 'multipart/form-data');
    next();
});
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//处理post请求,解析json数据
app.use(bodyParser.json());
//解析urlencoded编码数据
app.use(bodyParser.urlencoded({ extended: false }));


//定义中间件
//category/_token/add  有_token进行校验
const ADMIN_TOKEN_PATH = "/_token"

app.all("*", async (req, res, next) => {
    console.log('查找接口是否是权限接口中。。');
    console.log(req.path.indexOf(ADMIN_TOKEN_PATH) !== -1, req.path);
    if (req.path.indexOf(ADMIN_TOKEN_PATH) !== -1) {
        const token = req.headers.authorization.split(' ')[1];
        console.log("token", token);
        let decode;
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.send({
                        code: 401,
                        msg: 'token过期,请重新登录'
                    })
                    return;
                }
            } else {
                decode = decoded;
            }
        });
        console.log("decoded", decode);
        let admin_token_sql = "SELECT * FROM `admin` WHERE `id` = ?"
        let adminResult = await db.async.all(admin_token_sql, [decode.id]);
        //用户在数据库中的更新时间
        // const userUpdatedAt = jwt.verify(adminResult.rows[0].token, 'shhhhh').iat;
        // // JWT token 的发行时间（Issued At）
        // const jwtIssueAt = decode.iat;
        // console.log(jwtIssueAt, userUpdatedAt);
        //用户在数据库中的时间晚于该jwt发行的时间，代表已经发行过了新的token,该token已经失效。
        if (adminResult.err !== null || adminResult.rows.length == 0) {
            res.send({
                code: 401,
                msg: '请先登录'
            })
            return;
        } else {
            console.log('token验证正确,进行下一步');
            next()
        }

    } else {
        console.log('无需进行token验证,进行下一步');
        next()
    }
})


app.use('/admin', require('./router/AdminRouter'));
app.use('/category', require('./router/CategoryRouter'));
app.use('/blog', require('./router/BlogRouter'));
app.use('/upload', require('./router/UploadRouter'));
app.use('/comment', require('./router/CommentRouter'));

app.listen(port, () => {
    console.log(`启动成功:http://localhost:${port}/`);
})