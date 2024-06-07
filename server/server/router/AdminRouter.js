const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { db, genid } = require("../db/config")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
router.post("/register", async (req, res) => {
    let { account, password } = req.body;
    //查找当前用户名，看看是否已经存在
    let { err, rows } = await db.async.all("select * from admin where account = ?", [account])
    if (err === null && rows.length > 0) {
        //用户已经存在
        res.send({
            code: 400,
            msg: '用户已存在'
        })
    } else if (err === null) {
        //用户不存在
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let id = uuidv4();
        console.log("id", id);
        let token = generateToken(id);
        let register_sql = "INSERT INTO `admin`(`id`,`account`,`password`,`token`) VALUES(?,?,?,?)"
        let result = await db.async.all(register_sql, [id, account, hashedPassword, token]);
        res.send({
            code: 200,
            msg: '注册成功',
            data: token
        })
    }
    else {
        res.send({
            code: 500,
            msg: '注册失败'
        })
    }
})

//登录接口 验证通过
router.post("/login", async (req, res) => {
    let { account, password } = req.body
    let { err, rows } = await db.async.all("select * from admin where account = ?", [account])
    if (err === null && rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
        let update_token_sql = "UPDATE `admin` SET `token` = ? WHERE `id` = ?"
        let token = generateToken(rows[0].id);
        await db.async.all(update_token_sql, [token, rows[0].id])
        res.send({
            code: 200,
            msg: '登录成功',
            data: {
                token,
                account,
                password
            }
        })
    } else {
        res.send({
            code: 500,
            msg: '登录失败'
        })
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, 'shhhhh', {
        expiresIn: "5d",
    });
};
module.exports = router